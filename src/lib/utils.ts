import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/** Combina classes Tailwind de forma segura */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formata data ISO para exibição em pt-BR */
export function formatarData(dataIso: string | null | undefined): string {
  if (!dataIso) return '—'
  try {
    return format(parseISO(dataIso), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch {
    return '—'
  }
}

/** Formata data ISO só com data */
export function formatarDataCurta(dataIso: string | null | undefined): string {
  if (!dataIso) return '—'
  try {
    return format(parseISO(dataIso), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return '—'
  }
}

/** Formata data ISO para exibição por extenso amigável */
export function formatarDataLonga(dataIso: string | null | undefined): string {
  if (!dataIso) return '—'
  try {
    return format(parseISO(dataIso), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return '—'
  }
}


/** Formata número de telefone para exibição */
export function formatarTelefone(telefone: string | null | undefined): string {
  if (!telefone) return '—'
  const num = telefone.replace(/\D/g, '')
  if (num.length === 13) return `+${num.slice(0, 2)} (${num.slice(2, 4)}) ${num.slice(4, 9)}-${num.slice(9)}`
  if (num.length === 11) return `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`
  if (num.length === 10) return `(${num.slice(0, 2)}) ${num.slice(2, 6)}-${num.slice(6)}`
  return telefone
}

/** Gera URL do WhatsApp para um número */
export function urlWhatsApp(telefone: string | null | undefined): string {
  if (!telefone) return '#'
  const num = telefone.replace(/\D/g, '')
  return `https://wa.me/${num}`
}

/** Capitaliza a primeira letra de cada palavra */
export function capitalizarNome(nome: string | null | undefined): string {
  if (!nome) return '—'
  return nome
    .toLowerCase()
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

/** Formata valor numérico para exibição como moeda Real (R$) */
export function formatarRenda(renda: number | string | null | undefined): string {
  if (renda === null || renda === undefined || renda === '') return '—'
  const valor = Number(renda)
  if (isNaN(valor)) return String(renda)
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
