'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Obtém as configurações da empresa e a grade de horários de funcionamento.
 * Caso não existam registros no banco de dados, cria e inicializa valores padrão.
 */
export async function getOrCreateCompanySettings() {
  const supabase = await createClient()

  // 1. Tentar buscar a primeira configuração registrada
  const { data: existing } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (existing) {
    // Buscar a grade de horários de funcionamento do estabelecimento
    const { data: hours } = await supabase
      .from('business_hours')
      .select('*')
      .eq('company_id', existing.id)
      .order('day_of_week', { ascending: true })

    return { settings: existing, businessHours: hours || [] }
  }

  // 2. Se não existir nada nas tabelas, inicializa os dados padrão de fábrica (auto-seeding)
  const defaultSettings = {
    company_name: process.env.NEXT_PROJECT_NAME || 'Minha Imobiliária',
    agent_name: 'Robô SDR',
    phone: '',
    email: '',
    website: '',
    address: '',
    welcome_message: 'Olá! Sou o assistente virtual. Como posso ajudar?',
    away_message: 'Olá! No momento estamos fora do horário de atendimento, mas responderemos assim que retornarmos.',
    timezone: 'America/Sao_Paulo',
  }

  const { data: newSettings, error: insertError } = await supabase
    .from('company_settings')
    .insert(defaultSettings)
    .select()
    .single()

  if (insertError || !newSettings) {
    console.error('Erro ao inicializar configurações padrão:', insertError)
    throw new Error('Falha ao inicializar configurações da empresa.')
  }

  // Criar a grade padrão de segunda a domingo:
  // Mon-Fri: 08:00-18:00, Sat: 08:00-12:00, Sun: CLOSED (is_active = false)
  const defaultHours = [
    { company_id: newSettings.id, day_of_week: 0, start_time: '08:00:00', end_time: '12:00:00', is_active: false }, // Domingo
    { company_id: newSettings.id, day_of_week: 1, start_time: '08:00:00', end_time: '18:00:00', is_active: true },  // Segunda
    { company_id: newSettings.id, day_of_week: 2, start_time: '08:00:00', end_time: '18:00:00', is_active: true },  // Terça
    { company_id: newSettings.id, day_of_week: 3, start_time: '08:00:00', end_time: '18:00:00', is_active: true },  // Quarta
    { company_id: newSettings.id, day_of_week: 4, start_time: '08:00:00', end_time: '18:00:00', is_active: true },  // Quinta
    { company_id: newSettings.id, day_of_week: 5, start_time: '08:00:00', end_time: '18:00:00', is_active: true },  // Sexta
    { company_id: newSettings.id, day_of_week: 6, start_time: '08:00:00', end_time: '12:00:00', is_active: true },  // Sábado
  ]

  const { error: hoursError } = await supabase
    .from('business_hours')
    .insert(defaultHours)

  if (hoursError) {
    console.error('Erro ao inicializar horários padrão:', hoursError)
  }

  // Recarregar os horários recém-criados
  const { data: hours } = await supabase
    .from('business_hours')
    .select('*')
    .eq('company_id', newSettings.id)
    .order('day_of_week', { ascending: true })

  return { settings: newSettings, businessHours: hours || [] }
}

/**
 * Salva as configurações gerais da empresa e do tom do agente.
 */
export async function saveCompanySettings(id: string, settingsData: {
  company_name: string
  agent_name: string
  phone?: string | null
  email?: string | null
  website?: string | null
  address?: string | null
  welcome_message?: string | null
  away_message?: string | null
  timezone?: string | null
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('company_settings')
    .update({
      ...settingsData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao atualizar configurações da empresa:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/configuracoes')
  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Salva a grade de horários de funcionamento no Supabase.
 */
export async function saveBusinessHours(companyId: string, hoursList: {
  id?: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}[]) {
  const supabase = await createClient()

  const recordsToUpsert = hoursList.map((h) => ({
    ...(h.id ? { id: h.id } : {}),
    company_id: companyId,
    day_of_week: h.day_of_week,
    start_time: h.start_time,
    end_time: h.end_time,
    is_active: h.is_active,
  }))

  const { error } = await supabase
    .from('business_hours')
    .upsert(recordsToUpsert)

  if (error) {
    console.error('Erro ao salvar horários de atendimento:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/configuracoes')
  revalidatePath('/dashboard')
  return { success: true }
}
