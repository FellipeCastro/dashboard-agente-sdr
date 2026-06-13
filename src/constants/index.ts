import { FiltrosLeads, ClassificacaoLead } from '@/types'

/** Classificações disponíveis */
export const CLASSIFICACOES: { value: ClassificacaoLead | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todas as Classificações' },
  { value: 'quente', label: '🟢 Quente' },
  { value: 'morno', label: '🟡 Morno' },
  { value: 'frio', label: '🔴 Frio' },
]

/** Ações disponíveis */
export const ACOES: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todas as Ações' },
  { value: 'visita', label: 'Visita' },
  { value: 'simulacao', label: 'Simulação' },
]

/** Opções de renda */
export const OPCOES_RENDA: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todas as Rendas' },
  { value: 'acima', label: 'Acima de R$ 2.500' },
  { value: 'abaixo', label: 'Abaixo de R$ 2.500' },
]

/** Opções de restrição */
export const OPCOES_RESTRICAO: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todas' },
  { value: 'sem', label: 'Sem Restrição' },
  { value: 'com', label: 'Com Restrição' },
]

/** Tipos de imóvel */
export const TIPOS_IMOVEL: string[] = [
  'Apartamento',
  'Casa',
  'Terreno',
  'Sobrado',
  'Comercial',
]

/** Opções de tamanho de página */
export const OPCOES_PAGINA: number[] = [10, 25, 50, 100]

/** Filtros padrão */
export const FILTROS_PADRAO: FiltrosLeads = {
  busca: '',
  classificacao: 'todos',
  acao: 'todos',
  renda: 'todos',
  restricao: 'todos',
  tipo_imovel: '',
  data_inicio: '',
  data_fim: '',
}

/** Labels de ação */
export const LABELS_ACAO: Record<string, string> = {
  visita: 'Visita',
  simulacao: 'Simulação',
}
