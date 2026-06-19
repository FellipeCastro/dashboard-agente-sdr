'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Server Action: realiza login com e-mail e senha via Supabase Auth.
 */
export async function signIn(
  _prevState: { erro?: string } | undefined,
  formData: FormData
): Promise<{ erro?: string }> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { erro: 'Preencha e-mail e senha.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { erro: 'E-mail ou senha incorretos.' }
    }
    return { erro: 'Erro ao fazer login. Tente novamente.' }
  }

  redirect('/dashboard')
}

/**
 * Server Action: encerra a sessão do usuário.
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Server Action: envia e-mail de recuperação de senha.
 */
export async function resetPassword(
  _prevState: { erro?: string; sucesso?: boolean } | undefined,
  formData: FormData
): Promise<{ erro?: string; sucesso?: boolean }> {
  const supabase = await createClient()
  const email = formData.get('email') as string

  if (!email) return { erro: 'Informe seu e-mail.' }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/dashboard`,
  })

  if (error) return { erro: 'Erro ao enviar e-mail de recuperação.' }
  return { sucesso: true }
}
