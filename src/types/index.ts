// ============================================================
// Tipos principais do projeto SDR IA Dashboard
// ============================================================

/** Espelho fiel da tabela `leads` no Supabase */
export interface Lead {
  id: string
  created_at: string
  nome: string | null
  email: string | null
  intencao: string | null
  telefone: string | null
  transacao: string | null
  tipo_imovel: string | null
  quartos: string | null // Armazenado como int8, mas a request indica usar compatibilidade (ou string se for string JSON)
  bairro_ou_regiao: string | null
  faixa_de_preco: number | null
  imovel_de_interesse: string | null
  data_visita: string | null
  status_visita: string | null
  proximo_passo: string | null
  historico: string | null
}

/** Tipagem dos filtros da tabela de leads */
export interface FiltrosLeads {
  busca: string
  intencao: string | 'todos'
  transacao: string | 'todos'
  status_visita: string | 'todos'
  tipo_imovel: string
  data_inicio: string
  data_fim: string
}

/** Estatísticas consolidadas do dashboard */
export interface EstatisticasLeads {
  total: number
  // métricas de status (substituindo as de visitas anteriores)
  emAtendimento: number
  aguardandoConsultor: number
  // horários
  dentroHorario: number
  foraHorario: number
  // leads gerados por hora (0 a 23)
  leadsPorHora: { hora: number; quantidade: number }[]
}

/** Resposta paginada do serviço de leads */
export interface RespostaPaginada<T> {
  data: T[]
  total: number
  pagina: number
  totalPaginas: number
}
