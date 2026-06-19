import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LeadsFilters } from '@/components/leads/leads-filters'
import { LeadsTableWrapper } from '@/components/leads/leads-table-wrapper'
import { getLeads } from '@/services/leads.service'
import { FiltrosLeads } from '@/types'

export const metadata: Metadata = {
  title: 'Gestão de Leads',
  description: 'Visualização, filtragem e qualificação de leads do SDR IA',
}

interface PageProps {
  searchParams: Promise<{
    busca?: string
    classificacao?: string
    acao?: string
    renda?: string
    restricao?: string
    tipo_imovel?: string
    data_inicio?: string
    data_fim?: string
    pagina?: string
    tamanho?: string
  }>
}

async function LeadsContent({ searchParams }: { searchParams: PageProps['searchParams'] }) {
  const sParams = await searchParams
  
  const pagina = Number(sParams.pagina || '1')
  const tamanhoPagina = Number(sParams.tamanho || '10')

  const filtros: Partial<FiltrosLeads> = {
    busca: sParams.busca || '',
    classificacao: (sParams.classificacao as any) || 'todos',
    acao: (sParams.acao as any) || 'todos',
    renda: (sParams.renda as any) || 'todos',
    restricao: (sParams.restricao as any) || 'todos',
    tipo_imovel: sParams.tipo_imovel || '',
    data_inicio: sParams.data_inicio || '',
    data_fim: sParams.data_fim || '',
  }

  const { data: leads, total, totalPaginas } = await getLeads(filtros, pagina, tamanhoPagina)

  return (
    <LeadsTableWrapper
      leads={leads}
      total={total}
      pagina={pagina}
      totalPaginas={totalPaginas}
      tamanhoPagina={tamanhoPagina}
    />
  )
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="h-6 w-32 bg-slate-100 rounded animate-pulse" />
        <div className="h-6 w-24 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <div className="flex gap-4 items-center">
              <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse hidden md:block" />
            </div>
            <div className="flex gap-2 items-center">
              <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
              <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LeadsPage({ searchParams }: PageProps) {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Gestão de Leads</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Acompanhe todos os contatos captados pela inteligência artificial no WhatsApp
        </p>
      </div>

      {/* Painel de Filtros */}
      <Suspense fallback={<div className="h-28 bg-white border border-slate-100 rounded-xl animate-pulse" />}>
        <LeadsFilters />
      </Suspense>

      {/* Tabela de Leads */}
      <Suspense fallback={<TableSkeleton />}>
        <LeadsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
