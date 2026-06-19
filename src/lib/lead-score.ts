import { Cliente, ClassificacaoLead } from '@/types'

/**
 * Calcula a classificação de temperatura de um lead com base nas regras de negócio.
 *
 * Regras:
 * - Quente: renda >= 2500 E restricao = false
 * - Frio:   renda < 2500 E restricao = true
 * - Em atendimento: outros casos
 */
export function classificarLead(lead: Pick<Cliente, 'renda' | 'restricao'>): ClassificacaoLead {
  const { renda, restricao } = lead

  if (renda !== null && renda >= 2500 && restricao === false) return 'quente'
  if (renda !== null && renda < 2500 && restricao === true) return 'frio'
  return 'Em atendimento'
}

/** Labels de exibição por classificação */
export const LABELS_CLASSIFICACAO: Record<ClassificacaoLead, string> = {
  quente: 'Quente',
  'Em atendimento': 'Em Atendimento',
  frio: 'Frio',
}

/** Cores Tailwind por classificação */
export const CORES_CLASSIFICACAO: Record<ClassificacaoLead, string> = {
  quente: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Em atendimento': 'bg-blue-100 text-blue-800 border-blue-200',
  frio: 'bg-red-100 text-red-800 border-red-200',
}

/** Emoji por classificação */
export const EMOJI_CLASSIFICACAO: Record<ClassificacaoLead, string> = {
  quente: '🟢',
  'Em atendimento': '🔵',
  frio: '🔴',
}
