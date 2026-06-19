import { EstatisticasLeads } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Flame, MessageSquare, Snowflake } from 'lucide-react'

const cards = [
  {
    key: 'total' as keyof EstatisticasLeads,
    label: 'Total de Leads',
    icon: Users,
    cor: 'text-indigo-600',
    bg: 'bg-indigo-50',
    borda: 'border-indigo-100',
  },
  {
    key: 'emAtendimento' as keyof EstatisticasLeads,
    label: 'Em Atendimento',
    icon: MessageSquare,
    cor: 'text-blue-600',
    bg: 'bg-blue-50',
    borda: 'border-blue-100',
  },
  {
    key: 'quentes' as keyof EstatisticasLeads,
    label: 'Leads Quentes',
    icon: Flame,
    cor: 'text-emerald-600',
    bg: 'bg-emerald-50',
    borda: 'border-emerald-100',
  },
  {
    key: 'frios' as keyof EstatisticasLeads,
    label: 'Leads Frios',
    icon: Snowflake,
    cor: 'text-red-500',
    bg: 'bg-red-50',
    borda: 'border-red-100',
  },
]

interface StatsCardsProps {
  stats: EstatisticasLeads
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, cor, bg, borda }) => (
        <Card
          key={key}
          className={`border ${borda} shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {stats[key].toLocaleString('pt-BR')}
                </p>
              </div>
              <div className={`${bg} p-2.5 rounded-xl`}>
                <Icon className={`w-5 h-5 ${cor}`} />
              </div>
            </div>

            {/* Barra de progresso proporcional */}
            {key !== 'total' && stats.total > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">do total</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {Math.round((stats[key] / stats.total) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${key === 'quentes'
                        ? 'bg-emerald-500'
                        : key === 'emAtendimento'
                          ? 'bg-blue-500'
                          : 'bg-red-400'
                      } transition-all duration-500`}
                    style={{ width: `${Math.round((stats[key] / stats.total) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
