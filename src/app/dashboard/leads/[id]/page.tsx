import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getLeadById } from '@/services/leads.service'
import { formatarDataLonga, formatarTelefone, capitalizarNome, formatarRenda } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Calendar,
  Phone,
  User,
  Building,
  MessageSquare,
  MapPin,
  BedDouble,
  DollarSign,
  CalendarClock,
  Clock,
  ClipboardList,
  Mail,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Detalhes do Lead',
  description: 'Informações detalhadas e acompanhamento do lead',
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
  const linkWhats = lead.telefone
    ? `https://wa.me/${lead.telefone.replace(/\D/g, '')}`
    : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna 1: Perfil Rápido */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-sm border-slate-100 overflow-hidden">
          <div className="h-2.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-inner bg-blue-50 text-blue-700 border border-blue-100">
              {obterIniciais(lead.nome)}
            </div>

            <h2 className="text-xl font-bold text-slate-800 break-words w-full px-2">
              {capitalizarNome(lead.nome)}
            </h2>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5 justify-center">
              <Calendar className="w-3.5 h-3.5" />
              Cadastrado em {formatarDataLonga(lead.created_at)}
            </p>

            <div className="mt-4 flex gap-2 flex-wrap justify-center">
              {lead.intencao && (
                <Badge variant="outline" className="text-xs bg-slate-50">
                  {lead.intencao}
                </Badge>
              )}
              {lead.transacao && (
                <Badge variant="outline" className="text-xs bg-slate-50">
                  {lead.transacao}
                </Badge>
              )}
            </div>

            <div className="w-full h-px bg-slate-100 my-6" />

            <div className="w-full space-y-3">
              {lead.email && (
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-left">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Email</span>
                    <span className="text-sm font-medium break-all">{lead.email}</span>
                  </div>
                </div>
              )}

              {lead.telefone && (
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-left">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Telefone</span>
                    <span className="text-sm font-medium break-all">{formatarTelefone(lead.telefone)}</span>
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coluna 2 e 3: Informações */}
      <div className="lg:col-span-2 space-y-6">
        {/* Detalhes da Visita e Próximo Passo */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="pb-4 border-b border-slate-100/60">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-slate-500" />
              <div>
                <CardTitle className="text-md font-bold text-slate-800">Agendamento & Acompanhamento</CardTitle>
                <CardDescription className="text-xs">
                  Status atual da visita e próximo passo recomendado
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border bg-slate-50/50 border-slate-100 flex gap-4 items-start">
                <div className="p-2 rounded-lg shrink-0 bg-blue-100/50 text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Status da Visita</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {lead.status_visita || 'Não informado'}
                    </span>
                  </div>
                  {lead.data_visita && (
                    <p className="text-xs text-slate-500 mt-1 font-medium bg-white px-2 py-1 rounded inline-block border border-slate-100">
                      {lead.data_visita}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-emerald-50/30 border-emerald-100 flex gap-4 items-start">
                <div className="p-2 rounded-lg shrink-0 bg-emerald-100/50 text-emerald-600">
                  <ChevronRight className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Próximo Passo</h4>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {lead.proximo_passo || 'Aguardando próxima interação.'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes da Propriedade */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="pb-4 border-b border-slate-100/60">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              <div>
                <CardTitle className="text-md font-bold text-slate-800">Perfil do Imóvel Buscado</CardTitle>
                <CardDescription className="text-xs">
                  Características de preferência do cliente
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3" /> Tipo
                </span>
                <span className="text-sm font-semibold text-slate-800 block mt-1">
                  {lead.tipo_imovel || 'Não informado'}
                </span>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Região
                </span>
                <span className="text-sm font-semibold text-slate-800 block mt-1">
                  {lead.bairro_ou_regiao || 'Não informada'}
                </span>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <BedDouble className="w-3 h-3" /> Quartos
                </span>
                <span className="text-sm font-semibold text-slate-800 block mt-1">
                  {lead.quartos ? `${lead.quartos} quarto(s)` : 'Não informado'}
                </span>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Preço
                </span>
                <span className="text-sm font-semibold text-slate-800 block mt-1">
                  {formatarRenda(lead.faixa_de_preco)}
                </span>
              </div>
            </div>

            {lead.imovel_de_interesse && (
              <div className="pt-4 border-t border-slate-50">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Imóvel de Interesse Específico
                </span>
                <div className="bg-indigo-50/50 text-indigo-800 text-sm p-3 rounded-lg border border-indigo-100">
                  {lead.imovel_de_interesse}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Histórico Completo */}
        {lead.historico && (
          <Card className="shadow-sm border-slate-100">
            <CardHeader className="pb-4 border-b border-slate-100/60">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-slate-500" />
                <div>
                  <CardTitle className="text-md font-bold text-slate-800">Histórico de Atendimento</CardTitle>
                  <CardDescription className="text-xs">
                    Resumo das interações extraído pela IA
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {lead.historico}
              </div>
            </CardContent>
          </Card>
        )}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-16 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
            <div className="h-16 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
            <div className="h-16 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
            <div className="h-16 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
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
