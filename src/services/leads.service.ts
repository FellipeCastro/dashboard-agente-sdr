import { createClient } from '@/lib/supabase/server'
import { classificarLead } from '@/lib/lead-score'
import {
  Cliente,
  ClienteComClassificacao,
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

  // Filtro de busca por nome ou telefone
  if (filtros.busca) {
    query = query.or(
      `nome.ilike.%${filtros.busca}%,numero_telefone.ilike.%${filtros.busca}%`
    )
  }

  // Filtro de ação
  if (filtros.acao && filtros.acao !== 'todos') {
    query = query.eq('acao', filtros.acao)
  }

  // Filtro de renda
  if (filtros.renda === 'acima') query = query.eq('renda', true)
  if (filtros.renda === 'abaixo') query = query.eq('renda', false)

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

  // Aplica classificação e filtra por temperatura se necessário
  let resultado: ClienteComClassificacao[] = clientes.map((c) => ({
    ...c,
    classificacao: classificarLead(c),
  }))

  if (filtros.classificacao && filtros.classificacao !== 'todos') {
    resultado = resultado.filter((c) => c.classificacao === filtros.classificacao)
  }

  const total = filtros.classificacao && filtros.classificacao !== 'todos'
    ? resultado.length
    : (count ?? 0)

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

  return {
    ...(data as Cliente),
    classificacao: classificarLead(data as Cliente),
  }
}

/**
 * Busca estatísticas consolidadas para o dashboard.
 */
export async function getEstatisticasLeads(): Promise<EstatisticasLeads> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('clientes')
    .select('renda, restricao')

  if (error || !data) return { total: 0, quentes: 0, mornos: 0, frios: 0 }

  const total = data.length
  let quentes = 0
  let mornos = 0
  let frios = 0

  for (const lead of data as Pick<Cliente, 'renda' | 'restricao'>[]) {
    const classificacao = classificarLead(lead)
    if (classificacao === 'quente') quentes++
    else if (classificacao === 'morno') mornos++
    else frios++
  }

  return { total, quentes, mornos, frios }
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
    classificacao: classificarLead(c),
  }))
}
