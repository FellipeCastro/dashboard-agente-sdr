import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getEstatisticasLeads, getUltimosLeads } from '@/services/leads.service'
import { StatsCards, StatsCardsSkeleton } from '@/components/dashboard/stats-cards'
import { LeadsChart } from '@/components/dashboard/leads-chart'
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

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-6">
        <div className="xl:col-span-2">
          <LeadsChart stats={stats} />
        </div>
        <div className="xl:col-span-3">
          <RecentLeadsTable leads={ultimosLeads} />
        </div>
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
