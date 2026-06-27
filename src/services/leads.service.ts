import { createClient } from '@/lib/supabase/server'
import { isDentroHorarioComercialDB, type BusinessHourRecord } from '@/lib/utils'
import {
  Lead,
  EstatisticasLeads,
  FiltrosLeads,
  RespostaPaginada,
} from '@/types'

/**
 * Busca leads paginados com filtros aplicados.
 */
export async function getLeads(
  filtros: Partial<FiltrosLeads>,
  pagina: number = 1,
  tamanhoPagina: number = 10
): Promise<RespostaPaginada<Lead>> {
  const supabase = await createClient()
  const offset = (pagina - 1) * tamanhoPagina

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + tamanhoPagina - 1)

  // Filtro de busca por nome, telefone, imóvel de interesse ou tipo de imóvel
  if (filtros.busca) {
    query = query.or(
      `nome.ilike.%${filtros.busca}%,telefone.ilike.%${filtros.busca}%,imovel_de_interesse.ilike.%${filtros.busca}%,tipo_imovel.ilike.%${filtros.busca}%`
    )
  }

  // Filtro de intencao
  if (filtros.intencao && filtros.intencao !== 'todos') {
    query = query.ilike('intencao', `%${filtros.intencao}%`)
  }

  // Filtro de transacao
  if (filtros.transacao && filtros.transacao !== 'todos') {
    query = query.ilike('transacao', `%${filtros.transacao}%`)
  }
  
  // Filtro de status_visita
  if (filtros.status_visita && filtros.status_visita !== 'todos') {
    query = query.ilike('status_visita', `%${filtros.status_visita}%`)
  }

  // Filtro de tipo de imóvel
  if (filtros.tipo_imovel) {
    query = query.ilike('tipo_imovel', `%${filtros.tipo_imovel}%`)
  }

  // Filtro de data inicial
  if (filtros.data_inicio) {
    query = query.gte('created_at', `${filtros.data_inicio}T00:00:00`)
  }

  // Filtro de data final
  if (filtros.data_fim) {
    query = query.lte('created_at', `${filtros.data_fim}T23:59:59`)
  }

  const { data, error, count } = await query

  if (error) throw new Error(`Erro ao buscar leads: ${error.message}`)

  const leads = (data as Lead[]) ?? []

  const total = count ?? 0

  return {
    data: leads,
    total,
    pagina,
    totalPaginas: Math.ceil(total / tamanhoPagina),
  }
}

/**
 * Busca um lead pelo ID.
 */
export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return data as Lead
}

/**
 * Busca estatísticas consolidadas para o dashboard.
 */
export async function getEstatisticasLeads(): Promise<EstatisticasLeads> {
  const supabase = await createClient()

  const { data: leadsData, error: leadsError } = await supabase
    .from('leads')
    .select('status_visita, created_at')

  const defaultLeadsPorHora = Array.from({ length: 24 }).map((_, i) => ({ hora: i, quantidade: 0 }))

  if (leadsError || !leadsData) {
    return {
      total: 0,
      emAtendimento: 0,
      aguardandoConsultor: 0,
      dentroHorario: 0,
      foraHorario: 0,
      leadsPorHora: defaultLeadsPorHora,
    }
  }

  // Buscar configurações de horário comercial no Supabase
  const { data: settings } = await supabase.from('company_settings').select('*').limit(1).maybeSingle()
  let businessHours: BusinessHourRecord[] = []
  let timezone = 'America/Sao_Paulo'

  if (settings) {
    timezone = settings.timezone || 'America/Sao_Paulo'
    const { data: hours } = await supabase
      .from('business_hours')
      .select('*')
      .eq('company_id', settings.id)
      .eq('is_active', true)
    businessHours = hours || []
  } else {
    // Fallback padrão caso as tabelas estejam vazias/sem dados
    businessHours = [
      { day_of_week: 1, start_time: '08:00', end_time: '18:00', is_active: true },
      { day_of_week: 2, start_time: '08:00', end_time: '18:00', is_active: true },
      { day_of_week: 3, start_time: '08:00', end_time: '18:00', is_active: true },
      { day_of_week: 4, start_time: '08:00', end_time: '18:00', is_active: true },
      { day_of_week: 5, start_time: '08:00', end_time: '18:00', is_active: true },
      { day_of_week: 6, start_time: '08:00', end_time: '13:00', is_active: true },
    ]
  }

  const total = leadsData.length
  let emAtendimento = 0
  let aguardandoConsultor = 0
  let dentroHorario = 0
  let foraHorario = 0
  const countPorHora = new Array(24).fill(0)

  for (const lead of leadsData as { status_visita: string | null; created_at: string | null }[]) {
    const s = lead.status_visita?.toLowerCase() || ''
    if (s.includes('em atendimento')) emAtendimento++
    else if (s.includes('aguardando')) aguardandoConsultor++

    if (lead.created_at) {
      if (isDentroHorarioComercialDB(lead.created_at, businessHours, timezone)) {
        dentroHorario++
      } else {
        foraHorario++
      }

      const date = new Date(lead.created_at)
      if (!isNaN(date.getTime())) {
        const h = date.getHours()
        countPorHora[h]++
      }
    }
  }

  const leadsPorHora = countPorHora.map((quantidade, hora) => ({ hora, quantidade }))

  return {
    total,
    emAtendimento,
    aguardandoConsultor,
    dentroHorario,
    foraHorario,
    leadsPorHora,
  }
}

/**
 * Busca os últimos N leads para o dashboard.
 */
export async function getUltimosLeads(limite: number = 10): Promise<Lead[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limite)

  if (error || !data) return []

  return data as Lead[]
}
