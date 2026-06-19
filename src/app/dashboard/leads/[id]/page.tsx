import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getLeadById } from '@/services/leads.service'
import { ClassificationBadge } from '@/components/leads/classification-badge'
import { PauseIaButton } from '@/components/leads/pause-ia-button'
import { formatarDataLonga, formatarTelefone, capitalizarNome, formatarRenda } from '@/lib/utils'
import { LABELS_ACAO } from '@/constants'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Calendar,
  Phone,
  User,
  CheckCircle2,
  XCircle,
  Building,
  HelpCircle,
  MessageSquare,
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  Activity,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Detalhes do Lead',
  description: 'Informações detalhadas e qualificação do lead do SDR IA',
}

interface PageProps {
  params: Promise<{ id: string }>
}

async function LeadDetails({ id }: { id: string }) {
  const lead = await getLeadById(id)

  if (!lead) {
    notFound()
  }

  // Abreviação das iniciais para o avatar
  const obterIniciais = (nomeCompleto: string | null) => {
    if (!nomeCompleto) return 'LE'
    const partes = nomeCompleto.trim().split(/\s+/)
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase()
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
  }

  // Link para iniciar conversa no WhatsApp
  const linkWhats = lead.numero_telefone
    ? `https://wa.me/${lead.numero_telefone.replace(/\D/g, '')}`
    : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna 1: Perfil Rápido */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-sm border-slate-100 overflow-hidden">
          {/* Topo colorido indicando temperatura com gradiente sutil */}
          <div className={`h-2.5 w-full ${
            lead.classificacao === 'quente'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
              : lead.classificacao === 'Em atendimento'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
              : 'bg-gradient-to-r from-rose-500 to-red-500'
          }`} />
          <CardContent className="pt-6 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-inner ${
              lead.classificacao === 'quente'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : lead.classificacao === 'Em atendimento'
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {obterIniciais(lead.nome)}
            </div>

            <h2 className="text-xl font-bold text-slate-800 break-words w-full px-2">
              {capitalizarNome(lead.nome)}
            </h2>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5 justify-center">
              <Calendar className="w-3.5 h-3.5" />
              Cadastrado em {formatarDataLonga(lead.created_at)}
            </p>

            <div className="mt-4">
              <ClassificationBadge classificacao={lead.classificacao} size="lg" />
            </div>

            <div className="w-full h-px bg-slate-100 my-6" />

            <div className="w-full space-y-3">
              {lead.numero_telefone && (
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-left">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Telefone</span>
                    <span className="text-sm font-medium break-all">{formatarTelefone(lead.numero_telefone)}</span>
                  </div>
                </div>
              )}

              {lead.imovel_de_interesse && (
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-left">
                  <Building className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Imóvel de Preferência</span>
                    <span className="text-sm font-medium text-slate-800 break-words">{lead.imovel_de_interesse}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-left">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">ID do Lead</span>
                  <span className="text-xs font-mono break-all text-slate-500">{lead.id}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full mt-6">
              {linkWhats && (
                <a
                  href={linkWhats}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5 text-xs h-9">
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </Button>
                </a>
              )}
              <PauseIaButton id={lead.id} initialPausarIa={!!lead.pausar_ia} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coluna 2 e 3: Qualificação e Interesse */}
      <div className="lg:col-span-2 space-y-6">
        {/* Painel de Qualificação */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="pb-4 border-b border-slate-100/60">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-500" />
              <div>
                <CardTitle className="text-md font-bold text-slate-800">Resultado da Triagem</CardTitle>
                <CardDescription className="text-xs">
                  Dados analisados pela IA com base no perfil financeiro e restrições
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Renda */}
              <div className={`p-4 rounded-xl border flex gap-4 items-start ${
                lead.renda !== null && lead.renda !== undefined
                  ? lead.renda >= 2500
                    ? 'bg-emerald-50/20 border-emerald-100'
                    : 'bg-red-50/10 border-red-100'
                  : 'bg-slate-50 border-slate-100'
              }`}>
                <div className={`p-2 rounded-lg shrink-0 ${
                  lead.renda !== null && lead.renda !== undefined
                    ? lead.renda >= 2500
                      ? 'bg-emerald-100/60 text-emerald-700'
                      : 'bg-red-100/50 text-red-600'
                    : 'bg-slate-200/50 text-slate-500'
                }`}>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Renda Declarada</h4>
                  <div className="flex items-center gap-1.5">
                    {lead.renda !== null && lead.renda !== undefined ? (
                      <>
                        {lead.renda >= 2500 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                        <span className="text-sm font-semibold text-slate-800">
                          {formatarRenda(lead.renda)}
                        </span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-500">Não informado</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {lead.renda !== null && lead.renda !== undefined
                      ? lead.renda >= 2500
                        ? 'Atende ao critério mínimo de renda sugerido para financiamentos e locações.'
                        : 'Renda inferior ao limite mínimo sugerido para as opções comerciais.'
                      : 'O cliente não declarou ou finalizou o fluxo antes de declarar a renda.'}
                  </p>
                </div>
              </div>

              {/* Restrição */}
              <div className={`p-4 rounded-xl border flex gap-4 items-start ${
                lead.restricao === false
                  ? 'bg-emerald-50/20 border-emerald-100'
                  : lead.restricao
                  ? 'bg-red-50/10 border-red-100'
                  : 'bg-slate-50 border-slate-100'
              }`}>
                <div className={`p-2 rounded-lg shrink-0 ${
                  lead.restricao === false
                    ? 'bg-emerald-100/60 text-emerald-700'
                    : lead.restricao
                    ? 'bg-red-100/50 text-red-600'
                    : 'bg-slate-200/50 text-slate-500'
                }`}>
                  {lead.restricao ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Restrição de Crédito</h4>
                  <div className="flex items-center gap-1.5">
                    {lead.restricao === false ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-sm font-semibold text-slate-800">Nome Limpo (Sem Restrição)</span>
                      </>
                    ) : lead.restricao ? (
                      <>
                        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-sm font-semibold text-slate-800">Possui Restrições</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-500">Não informado</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {lead.restricao === false
                      ? 'Nenhuma restrição de crédito detectada ou informada.'
                      : lead.restricao
                      ? 'Declarou possuir restrição no CPF, o que pode impactar a aprovação bancária.'
                      : 'O cliente não declarou ou finalizou o fluxo antes de responder sobre restrições.'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Painel de Interesse */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="pb-4 border-b border-slate-100/60">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              <div>
                <CardTitle className="text-md font-bold text-slate-800">Objetivo e Interesse</CardTitle>
                <CardDescription className="text-xs">
                  O que o cliente busca e qual ação ele deseja realizar
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Ação Desejada</span>
                <span className="inline-flex px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                  {lead.acao ? (LABELS_ACAO[lead.acao] ?? lead.acao) : 'Não definida'}
                </span>
                <p className="text-xs text-slate-400 mt-2">
                  {lead.acao === 'visita'
                    ? 'O cliente tem interesse direto em agendar uma visita presencial ao imóvel.'
                    : lead.acao === 'simulacao'
                    ? 'O cliente deseja fazer uma simulação de financiamento bancário primeiro.'
                    : 'A ação principal pretendida não foi identificada no fluxo de atendimento.'}
                </p>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tipo de Imóvel</span>
                <span className="text-sm font-semibold text-slate-800 block mt-1">
                  {lead.tipo_imovel || 'Não informado'}
                </span>
                <p className="text-xs text-slate-400 mt-2">
                  Preferência de tipologia (Ex: Apartamento, Casa) informada à IA.
                </p>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Imóvel de Interesse</span>
                <span className="text-sm font-semibold text-slate-800 block mt-1">
                  {lead.imovel_de_interesse || 'Não informado'}
                </span>
                <p className="text-xs text-slate-400 mt-2">
                  O imóvel ou empreendimento específico de interesse do cliente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LeadDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-slate-100 p-6 flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full animate-pulse" />
          <div className="h-6 w-40 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
          <div className="h-7 w-24 bg-slate-100 rounded-full animate-pulse" />
          <div className="w-full h-px bg-slate-100 my-4" />
          <div className="w-full space-y-3">
            <div className="h-12 bg-slate-50 border border-slate-100 rounded-lg animate-pulse" />
            <div className="h-12 bg-slate-50 border border-slate-100 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
          <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
            <div className="h-32 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
          <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-20 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
            <div className="h-20 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function LeadPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      {/* Botão de Voltar */}
      <div>
        <Link href="/dashboard/leads">
          <Button variant="ghost" size="sm" className="-ml-3 text-slate-500 hover:text-slate-700 gap-1 text-xs font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para a Lista
          </Button>
        </Link>
      </div>

      <Suspense fallback={<LeadDetailsSkeleton />}>
        <LeadDetails id={id} />
      </Suspense>
    </div>
  )
}
