import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getEstatisticasLeads, getUltimosLeads } from '@/services/leads.service'
import { StatsCards, StatsCardsSkeleton } from '@/components/dashboard/stats-cards'
import { LeadsChart } from '@/components/dashboard/leads-chart'
import { CommercialHoursChart } from '@/components/dashboard/commercial-hours-chart'
import { RecentLeadsTable, RecentLeadsTableSkeleton } from '@/components/dashboard/recent-leads-table'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Visão geral dos leads captados pelo agente SDR IA',
}

async function DashboardContent() {
  const [stats, ultimosLeads] = await Promise.all([
    getEstatisticasLeads(),
    getUltimosLeads(10),
  ])

  return (
    <>
      <StatsCards stats={stats} />

      {/* Gráficos em Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LeadsChart stats={stats} />
        <CommercialHoursChart stats={stats} />
      </div>

      {/* Leads Recentes em largura total */}
      <div className="mt-6">
        <RecentLeadsTable leads={ultimosLeads} />
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-2">
      {/* Cabeçalho da página */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Visão geral dos leads captados pelo agente SDR IA
        </p>
      </div>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
