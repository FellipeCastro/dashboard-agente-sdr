import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings, Sparkles, Shield, Wrench, Bell } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Configurações',
  description: 'Configurações da conta e do agente de inteligência artificial',
}

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Configurações</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Gerencie as diretrizes do robô SDR IA e integrações da plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Menu lateral de configurações */}
        <div className="md:col-span-1 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 bg-indigo-50/60 border border-indigo-100/60 text-indigo-700 font-semibold text-sm rounded-lg">
            <Settings className="w-4 h-4" />
            Geral
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-lg cursor-not-allowed">
            <Sparkles className="w-4 h-4" />
            Robô SDR (Prompt)
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-lg cursor-not-allowed">
            <Shield className="w-4 h-4" />
            Segurança
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-lg cursor-not-allowed">
            <Bell className="w-4 h-4" />
            Notificações
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="md:col-span-2">
          <Card className="shadow-sm border-slate-100">
            <CardHeader>
              <div className="flex items-center gap-2 text-slate-700">
                <Wrench className="w-4 h-4 text-indigo-600" />
                <CardTitle className="text-md font-bold">Painel de Controle do Agente</CardTitle>
              </div>
              <CardDescription className="text-xs">
                As configurações detalhadas de integração do WhatsApp e edição do comportamento do SDR IA estarão disponíveis na próxima atualização.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Próximos Recursos em Desenvolvimento</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Estamos preparando uma interface para você editar o tom de voz do robô, definir regras de qualificação customizadas e configurar o webhook de envio de leads direto para o seu CRM.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
