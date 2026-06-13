'use client'

import { useActionState } from 'react'
import { signIn } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, Mail, Lock, Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, undefined)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Card principal */}
      <div className="w-full max-w-md">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            SDR IA Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie seus leads com inteligência
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Entrar na plataforma</h2>
            <p className="text-slate-500 text-sm mt-0.5">Acesse com suas credenciais</p>
          </div>

          <form action={action} className="space-y-4">
            {/* E-mail */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                  disabled={pending}
                  className="pl-10 h-11 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={pending}
                  className="pl-10 h-11 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* Mensagem de erro */}
            {state?.erro && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{state.erro}</span>
              </div>
            )}

            {/* Botão entrar */}
            <Button
              type="submit"
              disabled={pending}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-150"
            >
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Link recuperar senha */}
          <div className="mt-5 text-center">
            <a
              href="/login/recuperar"
              className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors"
            >
              Esqueci minha senha
            </a>
          </div>
        </div>

        {/* Rodapé */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Plataforma segura · Dados protegidos
        </p>
      </div>
    </div>
  )
}
