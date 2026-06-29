'use client'

import * as React from 'react'
import { useState, useTransition } from 'react'
import {
  Building2,
  Bot,
  Clock,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Save,
  CheckCircle2,
  AlertCircle,
  Globe2,
  MapPin,
  Calendar,
  Lock,
  Unlock,
  Camera,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { saveCompanySettings, saveBusinessHours } from './actions'
import { cn } from '@/lib/utils'

interface BusinessHour {
  id?: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

interface CompanySettings {
  id: string
  company_name: string
  agent_name: string
  phone?: string | null
  email?: string | null
  website?: string | null
  address?: string | null
  welcome_message?: string | null
  away_message?: string | null
  timezone?: string | null
  creci?: string | null
  instagram?: string | null
}

interface ConfiguracoesFormProps {
  initialSettings: CompanySettings
  initialHours: BusinessHour[]
}

const DIAS_SEMANA_MAP = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
]

// Lista comum de fusos horários para o Brasil
const TIMEZONES = [
  { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3) - America/Sao_Paulo' },
  { value: 'America/Manaus', label: 'Amazonas (GMT-4) - America/Manaus' },
  { value: 'America/Recife', label: 'Nordeste (GMT-3) - America/Recife' },
  { value: 'America/Belem', label: 'Pará (GMT-3) - America/Belem' },
  { value: 'America/Fortaleza', label: 'Ceará (GMT-3) - America/Fortaleza' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2) - America/Noronha' },
  { value: 'UTC', label: 'Tempo Universal Coordenado - UTC' },
]

function formatTimeForInput(timeStr: string): string {
  if (!timeStr) return '08:00'
  const parts = timeStr.split(':')
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
  }
  return timeStr
}

export function ConfiguracoesForm({ initialSettings, initialHours }: ConfiguracoesFormProps) {
  // Estado geral
  const [settings, setSettings] = useState<CompanySettings>(initialSettings)
  const [hours, setHours] = useState<BusinessHour[]>(() => {
    // Garantir que todos os 7 dias estão presentes e ordenados
    const sorted = [...initialHours].sort((a, b) => a.day_of_week - b.day_of_week)
    // Garantir formato HH:MM nos inputs
    return sorted.map(h => ({
      ...h,
      start_time: formatTimeForInput(h.start_time),
      end_time: formatTimeForInput(h.end_time)
    }))
  })

  const [activeTab, setActiveTab] = useState('geral')
  const [isPending, startTransition] = useTransition()

  // Feedback visual do salvamento
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error' | null
    message: string | null
  }>({ type: null, message: null })

  // Atualizar inputs gerais
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Atualizar inputs de horários
  const handleHourToggle = (day: number) => {
    setHours(prev => prev.map(h => {
      if (h.day_of_week === day) {
        return { ...h, is_active: !h.is_active }
      }
      return h
    }))
  }

  const handleHourTimeChange = (day: number, field: 'start_time' | 'end_time', value: string) => {
    setHours(prev => prev.map(h => {
      if (h.day_of_week === day) {
        return { ...h, [field]: value }
      }
      return h
    }))
  }

  // Salvar Geral/Empresa
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveStatus({ type: null, message: null })

    if (!settings.company_name.trim() || !settings.agent_name.trim()) {
      setSaveStatus({
        type: 'error',
        message: 'Nome da Empresa e Nome do Agente são campos obrigatórios.'
      })
      return
    }

    startTransition(async () => {
      const res = await saveCompanySettings(settings.id, {
        company_name: settings.company_name,
        agent_name: settings.agent_name,
        phone: settings.phone,
        email: settings.email,
        website: settings.website,
        address: settings.address,
        welcome_message: settings.welcome_message,
        away_message: settings.away_message,
        timezone: settings.timezone,
        creci: settings.creci,
        instagram: settings.instagram,
      })

      if (res.success) {
        setSaveStatus({
          type: 'success',
          message: 'Configurações da empresa salvas com sucesso!'
        })
        // Limpar feedback após 4 segundos
        setTimeout(() => setSaveStatus({ type: null, message: null }), 4000)
      } else {
        setSaveStatus({
          type: 'error',
          message: `Erro ao salvar: ${res.error}`
        })
      }
    })
  }

  // Salvar Grade de Horários
  const handleSaveHours = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveStatus({ type: null, message: null })

    // Validação de intervalo de horários
    for (const h of hours) {
      if (h.is_active) {
        const [startH, startM] = h.start_time.split(':').map(Number)
        const [endH, endM] = h.end_time.split(':').map(Number)
        const startMin = startH * 60 + startM
        const endMin = endH * 60 + endM

        if (startMin >= endMin) {
          const diaNome = DIAS_SEMANA_MAP.find(d => d.value === h.day_of_week)?.label
          setSaveStatus({
            type: 'error',
            message: `Erro no ${diaNome}: A hora inicial deve ser menor que a hora final.`
          })
          return
        }
      }
    }

    startTransition(async () => {
      // Ajustar formatos das horas (enviar como HH:MM:00)
      const formattedHours = hours.map(h => ({
        ...h,
        start_time: `${h.start_time}:00`,
        end_time: `${h.end_time}:00`,
      }))

      const res = await saveBusinessHours(settings.id, formattedHours)

      if (res.success) {
        setSaveStatus({
          type: 'success',
          message: 'Grade de horários atualizada com sucesso!'
        })
        setTimeout(() => setSaveStatus({ type: null, message: null }), 4000)
      } else {
        setSaveStatus({
          type: 'error',
          message: `Erro ao salvar horários: ${res.error}`
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Toast / Alerta de Status */}
      {saveStatus.type && (
        <div
          className={cn(
            "p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-4",
            saveStatus.type === 'success'
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          )}
        >
          {saveStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="text-sm font-semibold">{saveStatus.type === 'success' ? 'Sucesso!' : 'Atenção'}</p>
            <p className="text-xs mt-0.5 opacity-90">{saveStatus.message}</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="geral" value={activeTab} onValueChange={(val) => {
        setActiveTab(val)
        setSaveStatus({ type: null, message: null })
      }} className="w-full">

        {/* Abas Superiores */}
        <div className="border-b border-slate-100 pb-1 mb-6">
          <TabsList className="bg-slate-100/80 p-1 rounded-xl">
            <TabsTrigger value="geral" className="px-5 py-2 text-xs font-semibold rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Building2 className="w-4 h-4 mr-2 text-indigo-500" />
              Geral & SDR
            </TabsTrigger>
            <TabsTrigger value="horarios" className="px-5 py-2 text-xs font-semibold rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Clock className="w-4 h-4 mr-2 text-indigo-500" />
              Horário de Atendimento
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Conteúdo da Aba Geral */}
        <TabsContent value="geral" className="space-y-6 outline-none">
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Bloco 1: Dados da Empresa e Agente */}
            <div className="md:col-span-2 space-y-6">
              <Card className="shadow-xs border-slate-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <CardTitle className="text-sm font-bold text-slate-800">Dados da Empresa & Agente</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-400">
                    Insira as informações gerais da sua empresa e o nome do seu robô de atendimento.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="company_name" className="text-xs font-bold text-slate-600">Nome da Empresa *</label>
                      <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        value={settings.company_name}
                        onChange={handleSettingsChange}
                        className="w-full text-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="Ex: Imobiliária Tupi Guarini"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="agent_name" className="text-xs font-bold text-slate-600">Nome do Agente SDR *</label>
                      <div className="relative">
                        <Bot className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          id="agent_name"
                          name="agent_name"
                          value={settings.agent_name}
                          onChange={handleSettingsChange}
                          className="w-full text-xs rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Ex: Robô SDR, Atendente IA"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-slate-600">WhatsApp / Telefone</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={settings.phone || ''}
                          onChange={handleSettingsChange}
                          className="w-full text-xs rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Ex: (11) 99999-9999"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-slate-600">E-mail de Contato</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={settings.email || ''}
                          onChange={handleSettingsChange}
                          className="w-full text-xs rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="contato@empresa.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="website" className="text-xs font-bold text-slate-600">Website</label>
                      <div className="relative">
                        <Globe2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          id="website"
                          name="website"
                          value={settings.website || ''}
                          onChange={handleSettingsChange}
                          className="w-full text-xs rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="https://www.seusite.com.br"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="instagram" className="text-xs font-bold text-slate-600">Instagram</label>
                      <div className="relative">
                        <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          id="instagram"
                          name="instagram"
                          value={settings.instagram || ''}
                          onChange={handleSettingsChange}
                          className="w-full text-xs rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Ex: https://www.instagram.com/usuario"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="creci" className="text-xs font-bold text-slate-600">CRECI</label>
                        <div className="relative">
                          <Award className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            id="creci"
                            name="creci"
                            value={settings.creci || ''}
                            onChange={handleSettingsChange}
                            className="w-full text-xs rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            placeholder="Ex: CRECI-PI 01234-J"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="address" className="text-xs font-bold text-slate-600">Endereço Físico</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={settings.address || ''}
                          onChange={handleSettingsChange}
                          className="w-full text-xs rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Rua Exemplo, 123, Bairro, Cidade - UF"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="timezone" className="text-xs font-bold text-slate-600">Fuso Horário Local</label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 z-10" />
                        <select
                          id="timezone"
                          name="timezone"
                          value={settings.timezone || 'America/Sao_Paulo'}
                          onChange={handleSettingsChange}
                          className="w-full text-xs rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
                        >
                          {TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bloco 2: Mensagens de Conversação
              <Card className="shadow-xs border-slate-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 py-4 px-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <CardTitle className="text-sm font-bold text-slate-800">Mensagens Automáticas do SDR</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-400">
                    Defina os scripts iniciais de atendimento para controle de fila do robô.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="welcome_message" className="text-xs font-bold text-slate-600">Mensagem de Boas-vindas (Dentro do Expediente)</label>
                    <textarea
                      id="welcome_message"
                      name="welcome_message"
                      rows={3}
                      value={settings.welcome_message || ''}
                      onChange={handleSettingsChange}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Mensagem disparada quando o lead inicia conversa dentro do horário..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="away_message" className="text-xs font-bold text-slate-600">Mensagem de Ausência (Fora do Expediente)</label>
                    <textarea
                      id="away_message"
                      name="away_message"
                      rows={3}
                      value={settings.away_message || ''}
                      onChange={handleSettingsChange}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Mensagem disparada automaticamente aos leads recebidos nos finais de semana ou à noite..."
                    />
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Coluna 2 (Direita): Resumo e Botão Salvar */}
            <div className="md:col-span-1 space-y-6">
              <Card className="shadow-xs border-slate-100 bg-slate-50/50 flex flex-col justify-between h-full min-h-[300px]">
                <div className="p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status do Agente SDR</h3>
                  <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3 shadow-3xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">Robô IA Ativo</span>
                    </div>
                    <div className="border-t border-slate-100 pt-2 space-y-1">
                      <p className="text-[10px] text-slate-400">Identificação:</p>
                      <p className="text-xs font-bold text-slate-800">{settings.agent_name || 'Robô SDR'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400">Timezone Ativo:</p>
                      <p className="text-xs font-semibold text-slate-600">{settings.timezone || 'America/Sao_Paulo'}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Ao salvar as configurações desta aba, as diretrizes de fuso horário e mensagens automáticas serão replicadas no assistente imediatamente.
                  </p>
                </div>

                <div className="p-6 border-t border-slate-100/60 bg-white">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {isPending ? 'Salvando...' : 'Salvar Configurações'}
                  </button>
                </div>
              </Card>
            </div>

          </form>
        </TabsContent>

        {/* Conteúdo da Aba Horários */}
        <TabsContent value="horarios" className="space-y-6 outline-none">
          <form onSubmit={handleSaveHours} className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Bloco principal: Grade de horários */}
            <div className="md:col-span-2 space-y-6">
              <Card className="shadow-xs border-slate-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <CardTitle className="text-sm font-bold text-slate-800">Grade de Funcionamento Semanal</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-400">
                    Ative os dias da semana de expediente e defina os horários de início e término das atividades.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 divide-y divide-slate-100">
                  {hours.map((hour) => {
                    const diaInfo = DIAS_SEMANA_MAP.find(d => d.value === hour.day_of_week)!
                    const diaNome = diaInfo.label

                    return (
                      <div
                        key={hour.day_of_week}
                        className={cn(
                          "py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors",
                          hour.is_active ? "bg-white" : "bg-slate-50/30 opacity-75"
                        )}
                      >
                        {/* Toggle de ativação do dia */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleHourToggle(hour.day_of_week)}
                            className={cn(
                              "w-10 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-hidden cursor-pointer",
                              hour.is_active ? "bg-indigo-600" : "bg-slate-300"
                            )}
                          >
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200",
                                hour.is_active ? "translate-x-4" : "translate-x-0"
                              )}
                            />
                          </button>

                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-slate-800">{diaNome}</span>
                            <span className="text-[10px] font-medium text-slate-400">
                              {hour.is_active ? (
                                <span className="text-indigo-600 flex items-center gap-1">
                                  <Unlock className="w-2.5 h-2.5" /> Expediente Ativo
                                </span>
                              ) : (
                                <span className="text-slate-400 flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" /> Fechado o dia todo
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Controles de Hora */}
                        <div className="flex items-center gap-2 shrink-0">
                          {hour.is_active ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-semibold text-slate-400 mr-1">Início:</span>
                                <input
                                  type="time"
                                  value={hour.start_time}
                                  onChange={(e) => handleHourTimeChange(hour.day_of_week, 'start_time', e.target.value)}
                                  className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs outline-hidden"
                                />
                              </div>
                              <span className="text-slate-300 text-xs">—</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-semibold text-slate-400 mr-1">Fim:</span>
                                <input
                                  type="time"
                                  value={hour.end_time}
                                  onChange={(e) => handleHourTimeChange(hour.day_of_week, 'end_time', e.target.value)}
                                  className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs outline-hidden"
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200/50 rounded-lg px-6 py-1.5 uppercase tracking-wider select-none">
                              Sem atendimento
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Coluna Lateral */}
            <div className="md:col-span-1 space-y-6">
              <Card className="shadow-xs border-slate-100 bg-slate-50/50 flex flex-col justify-between h-full min-h-[300px]">
                <div className="p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Regras de Validação</h3>
                  <div className="space-y-3">
                    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-3xs text-[11px] text-slate-500 space-y-2 leading-relaxed">
                      <p className="font-semibold text-slate-700">Intervalos de tempo:</p>
                      <p>O horário de encerramento deve ser maior que o de abertura do expediente.</p>
                      <div className="border-t border-slate-100 pt-2">
                        <p className="font-semibold text-slate-700">Fuso Horário Ativo:</p>
                        <p className="text-indigo-600 font-medium">{settings.timezone || 'America/Sao_Paulo'}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Ao salvar os horários, os leads recebidos fora dos intervalos de atividade configurados serão computados como estatísticas de &quot;Fora do Comercial&quot;.
                  </p>
                </div>

                <div className="p-6 border-t border-slate-100/60 bg-white">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {isPending ? 'Salvando...' : 'Salvar Grade de Horários'}
                  </button>
                </div>
              </Card>
            </div>

          </form>
        </TabsContent>

      </Tabs>
    </div>
  )
}
