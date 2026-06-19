import { createClient } from '@/lib/supabase/server'
import { isDentroHorarioComercialDB, type BusinessHourRecord } from '@/lib/utils'
import {
  Cliente,
  ClienteComClassificacao,
  ClassificacaoLead,
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
): Promise<RespostaPaginada<ClienteComClassificacao>> {
  const supabase = await createClient()
  const offset = (pagina - 1) * tamanhoPagina

  let query = supabase
    .from('clientes')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + tamanhoPagina - 1)

  // Filtro de busca por nome, telefone, imóvel de interesse ou tipo de imóvel
  if (filtros.busca) {
    query = query.or(
      `nome.ilike.%${filtros.busca}%,numero_telefone.ilike.%${filtros.busca}%,imovel_de_interesse.ilike.%${filtros.busca}%,tipo_imovel.ilike.%${filtros.busca}%`
    )
  }

  // Filtro de classificação
  if (filtros.classificacao && filtros.classificacao !== 'todos') {
    query = query.eq('classificacao', filtros.classificacao)
  }

  // Filtro de ação
  if (filtros.acao && filtros.acao !== 'todos') {
    query = query.eq('acao', filtros.acao)
  }

  // Filtro de renda (coluna numérica no banco de dados)
  if (filtros.renda === 'acima') query = query.gte('renda', 2500)
  if (filtros.renda === 'abaixo') query = query.lt('renda', 2500)

  // Filtro de restrição
  if (filtros.restricao === 'com') query = query.eq('restricao', true)
  if (filtros.restricao === 'sem') query = query.eq('restricao', false)

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

  const clientes = (data as Cliente[]) ?? []

  const resultado: ClienteComClassificacao[] = clientes.map((c) => ({
    ...c,
    classificacao: (c.classificacao as ClassificacaoLead) || 'Em atendimento',
  }))

  const total = count ?? 0

  return {
    data: resultado,
    total,
    pagina,
    totalPaginas: Math.ceil(total / tamanhoPagina),
  }
}

/**
 * Busca um lead pelo ID.
 */
export async function getLeadById(id: string): Promise<ClienteComClassificacao | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  const lead = data as Cliente
  return {
    ...lead,
    classificacao: (lead.classificacao as ClassificacaoLead) || 'Em atendimento',
  }
}

/**
 * Busca estatísticas consolidadas para o dashboard.
 */
export async function getEstatisticasLeads(): Promise<EstatisticasLeads> {
  const supabase = await createClient()

  const { data: leadsData, error: leadsError } = await supabase
    .from('clientes')
    .select('classificacao, created_at')

  if (leadsError || !leadsData) {
    return {
      total: 0,
      quentes: 0,
      emAtendimento: 0,
      frios: 0,
      dentroHorario: 0,
      foraHorario: 0,
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
  let quentes = 0
  let emAtendimento = 0
  let frios = 0
  let dentroHorario = 0
  let foraHorario = 0

  for (const lead of leadsData as { classificacao: string | null; created_at: string | null }[]) {
    const c = lead.classificacao
    if (c === 'quente') quentes++
    else if (c === 'frio') frios++
    else emAtendimento++

    if (lead.created_at && isDentroHorarioComercialDB(lead.created_at, businessHours, timezone)) {
      dentroHorario++
    } else {
      foraHorario++
    }
  }

  return {
    total,
    quentes,
    emAtendimento,
    frios,
    dentroHorario,
    foraHorario,
  }
}

/**
 * Busca os últimos N leads para o dashboard.
 */
export async function getUltimosLeads(limite: number = 10): Promise<ClienteComClassificacao[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limite)

  if (error || !data) return []

  return (data as Cliente[]).map((c) => ({
    ...c,
    classificacao: (c.classificacao as ClassificacaoLead) || 'Em atendimento',
  }))
}
