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

interface HorarioDia {
  start: string
  end: string
}

/**
 * Retorna o horário comercial configurado para um determinado dia da semana (em inglês, ex: "Monday").
 * Suporta o formato unificado "NEXT_PUBLIC_COMERCIAL_WEEKDAY=HH:MM-HH:MM" ou "CLOSED",
 * com fallback para as variáveis gerais e padrões do sistema.
 */
export function getHorarioParaDia(diaSemana: string): HorarioDia | null {
  // 1. Tentar ler no formato dinâmico unificado: NEXT_PUBLIC_COMERCIAL_MONDAY, etc.
  const envKeyNovo = `NEXT_PUBLIC_COMERCIAL_${diaSemana.toUpperCase()}`
  const valueNovo = process.env[envKeyNovo]

  if (valueNovo !== undefined) {
    const trimmed = valueNovo.trim()
    if (!trimmed || trimmed.toUpperCase() === 'CLOSED' || trimmed.toUpperCase() === 'FECHADO') {
      return null
    }

    const partes = trimmed.split('-')
    if (partes.length === 2) {
      const [start, end] = partes.map((p) => p.trim())
      if (/^\d{2}:\d{2}$/.test(start) && /^\d{2}:\d{2}$/.test(end)) {
        return { start, end }
      }
    }
  }

  // 2. Fallback para as variáveis gerais antigas ou padrões internos
  const configMap: Record<string, { envPrefix: string; defaultStart: string | null; defaultEnd: string | null }> = {
    Monday: { envPrefix: 'MON', defaultStart: '08:00', defaultEnd: '18:00' },
    Tuesday: { envPrefix: 'TUE', defaultStart: '08:00', defaultEnd: '18:00' },
    Wednesday: { envPrefix: 'WED', defaultStart: '08:00', defaultEnd: '18:00' },
    Thursday: { envPrefix: 'THU', defaultStart: '08:00', defaultEnd: '18:00' },
    Friday: { envPrefix: 'FRI', defaultStart: '08:00', defaultEnd: '18:00' },
    Saturday: { envPrefix: 'SAT', defaultStart: '08:00', defaultEnd: '13:00' },
    Sunday: { envPrefix: 'SUN', defaultStart: null, defaultEnd: null },
  }

  const config = configMap[diaSemana]
  if (!config) return null

  // Verificar se há variáveis específicas do dia antigo no env, ex: NEXT_PUBLIC_COMMERCIAL_START_SAT
  const startEnv = process.env[`NEXT_PUBLIC_COMMERCIAL_START_${config.envPrefix}`]
  const endEnv = process.env[`NEXT_PUBLIC_COMMERCIAL_END_${config.envPrefix}`]

  if (startEnv !== undefined || endEnv !== undefined) {
    if (
      startEnv === 'closed' ||
      startEnv === 'fechado' ||
      !startEnv ||
      !endEnv ||
      endEnv === 'closed' ||
      endEnv === 'fechado'
    ) {
      return null
    }
    return { start: startEnv, end: endEnv }
  }

  // Para segunda a sexta, fallback para os gerais (NEXT_PUBLIC_COMMERCIAL_START / END)
  if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(diaSemana)) {
    const generalStart = process.env.NEXT_PUBLIC_COMMERCIAL_START || config.defaultStart || '08:00'
    const generalEnd = process.env.NEXT_PUBLIC_COMMERCIAL_END || config.defaultEnd || '18:00'
    return { start: generalStart, end: generalEnd }
  }

  // Para sábado e domingo, fallback para o padrão interno
  if (config.defaultStart && config.defaultEnd) {
    return { start: config.defaultStart, end: config.defaultEnd }
  }

  return null
}

/**
 * Verifica se um timestamp ISO pertence ao horário comercial configurado no .env
 * ou aos padrões dinâmicos estabelecidos por dia da semana, respeitando o fuso horário local.
 */
export function isDentroHorarioComercial(dataIso: string | null | undefined): boolean {
  if (!dataIso) return false
  
  try {
    const date = new Date(dataIso)
    const timezone = process.env.NEXT_PUBLIC_COMMERCIAL_TIMEZONE || 'America/Sao_Paulo'
    
    // Obter dia da semana no fuso horário configurado (ex: "Monday", "Saturday")
    const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
    })
    
    const diaSemana = weekdayFormatter.format(date)
    
    // Obter o horário comercial definido para este dia da semana
    const horario = getHorarioParaDia(diaSemana)
    if (!horario) {
      return false // Fechado
    }
    
    // Obter hora e minuto no fuso horário configurado
    const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    
    const partes = timeFormatter.formatToParts(date)
    const hourVal = partes.find((p) => p.type === 'hour')?.value || '0'
    const minuteVal = partes.find((p) => p.type === 'minute')?.value || '0'
    
    const horaAtualMinutos = parseInt(hourVal, 10) * 60 + parseInt(minuteVal, 10)
    
    const [startH, startM] = horario.start.split(':').map(Number)
    const [endH, endM] = horario.end.split(':').map(Number)
    
    const horaInicioMinutos = startH * 60 + startM
    const horaFimMinutos = endH * 60 + endM
    
    return horaAtualMinutos >= horaInicioMinutos && horaAtualMinutos <= horaFimMinutos
  } catch {
    return false
  }
}
