import { FiltrosLeads } from '@/types'

/** Intenções disponíveis */
export const INTENCOES: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todas as Intenções' },
  { value: 'Comprar', label: 'Comprar' },
  { value: 'Alugar', label: 'Alugar' },
]

/** Transações disponíveis */
export const TRANSACOES: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todas as Transações' },
  { value: 'Compra', label: 'Compra' },
  { value: 'Aluguel', label: 'Aluguel' },
]

/** Status de visita disponíveis */
export const STATUS_VISITA: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todos os Status' },
  { value: 'Em atendimento', label: 'Em atendimento' },
  { value: 'Aguardando consultor', label: 'Aguardando consultor' },
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
  intencao: 'todos',
  transacao: 'todos',
  status_visita: 'todos',
  tipo_imovel: '',
  data_inicio: '',
  data_fim: '',
}
