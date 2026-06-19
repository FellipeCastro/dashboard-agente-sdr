'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * Server Action para alternar o status de pausa da IA para um lead.
 */
export async function togglePauseIaAction(id: string, currentStatus: boolean) {
  try {
    const supabase = await createClient()
    const newStatus = !currentStatus

    const { data, error } = await supabase
      .from('clientes')
      .update({ pausar_ia: newStatus })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Erro ao atualizar pausar_ia no Supabase:', error)
      return { success: false, error: error.message }
    }

    // Revalida a página do lead específico e a listagem de leads para atualizar o cache
    revalidatePath(`/dashboard/leads/${id}`)
    revalidatePath('/dashboard/leads')
    
    return { success: true, newStatus }
  } catch (err: any) {
    console.error('Erro ao executar togglePauseIaAction:', err)
    return { success: false, error: err?.message || 'Erro interno do servidor' }
  }
}
