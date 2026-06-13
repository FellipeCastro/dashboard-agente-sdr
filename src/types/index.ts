// ============================================================
// Tipos principais do projeto SDR IA Dashboard
// ============================================================

/** Espelho fiel da tabela `clientes` no Supabase */
export interface Cliente {
  id: string
  created_at: string
  numero_telefone: string | null
  nome: string | null
  acao: string | null
  renda: boolean | null
  restricao: boolean | null
  tipo_imovel: string | null
  pausar_ia: boolean | null
}

/** Classificação de temperatura do lead */
export type ClassificacaoLead = 'quente' | 'morno' | 'frio'

/** Lead com classificação calculada */
export interface ClienteComClassificacao extends Cliente {
  classificacao: ClassificacaoLead
}

/** Tipagem dos filtros da tabela de leads */
export interface FiltrosLeads {
  busca: string
  classificacao: ClassificacaoLead | 'todos'
  acao: 'visita' | 'simulacao' | 'todos'
  renda: 'acima' | 'abaixo' | 'todos'
  restricao: 'com' | 'sem' | 'todos'
  tipo_imovel: string
  data_inicio: string
  data_fim: string
}

/** Estatísticas consolidadas do dashboard */
export interface EstatisticasLeads {
  total: number
  quentes: number
  mornos: number
  frios: number
}

/** Resposta paginada do serviço de leads */
export interface RespostaPaginada<T> {
  data: T[]
  total: number
  pagina: number
  totalPaginas: number
}
