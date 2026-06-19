import type { Metadata } from 'next'
import { getOrCreateCompanySettings } from './actions'
import { ConfiguracoesForm } from './configuracoes-form'

export const metadata: Metadata = {
  title: 'Configurações',
  description: 'Configurações da conta, dados da empresa e horário comercial do robô SDR',
}

export default async function ConfiguracoesPage() {
  // Obter ou auto-seeder as configurações a partir do Supabase
  const { settings, businessHours } = await getOrCreateCompanySettings()

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Configurações</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Gerencie as diretrizes de funcionamento do robô SDR IA e dados da empresa
        </p>
      </div>

      {/* Formulário de Configuração */}
      <ConfiguracoesForm initialSettings={settings} initialHours={businessHours} />
    </div>
  )
}
