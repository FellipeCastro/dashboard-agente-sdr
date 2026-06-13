import { Cliente, ClassificacaoLead } from '@/types'

/**
 * Calcula a classificação de temperatura de um lead com base nas regras de negócio.
 *
 * Regras:
 * - Quente: renda=true E restricao=false
 * - Morno:  (renda=true E restricao=true) OU (renda=false E restricao=false)
 * - Frio:   renda=false E restricao=true
 */
export function classificarLead(lead: Pick<Cliente, 'renda' | 'restricao'>): ClassificacaoLead {
  const { renda, restricao } = lead

  if (renda === true && restricao === false) return 'quente'
  if (renda === false && restricao === true) return 'frio'
  return 'morno'
}

/** Labels de exibição por classificação */
export const LABELS_CLASSIFICACAO: Record<ClassificacaoLead, string> = {
  quente: 'Quente',
  morno: 'Morno',
  frio: 'Frio',
}

/** Cores Tailwind por classificação */
export const CORES_CLASSIFICACAO: Record<ClassificacaoLead, string> = {
  quente: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  morno: 'bg-amber-100 text-amber-800 border-amber-200',
  frio: 'bg-red-100 text-red-800 border-red-200',
}

/** Emoji por classificação */
export const EMOJI_CLASSIFICACAO: Record<ClassificacaoLead, string> = {
  quente: '🟢',
  morno: '🟡',
  frio: '🔴',
}
