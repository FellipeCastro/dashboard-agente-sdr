import Link from 'next/link'
import { Lead } from '@/types'
import { formatarDataCurta, formatarTelefone, capitalizarNome } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

interface RecentLeadsTableProps {
  leads: Lead[]
}

export function RecentLeadsTable({ leads }: RecentLeadsTableProps) {
  return (
    <Card className="shadow-sm border-slate-100">
      <CardHeader className="pb-4 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-slate-800">
            Últimos Leads Recebidos
          </CardTitle>
          <CardDescription className="text-sm text-slate-400">
            Os 10 leads mais recentes captados pelo agente
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/dashboard/leads">
            Ver todos
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <p className="text-sm">Nenhum lead captado ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">
                    Telefone
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">
                    Status Visita
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">
                    Data
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50 transition-colors duration-100"
                  >
                    <td className="px-6 py-3.5 font-medium text-slate-800">
                      {capitalizarNome(lead.nome)}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 hidden md:table-cell">
                      {formatarTelefone(lead.telefone)}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="secondary" className="text-xs">
                        {lead.status_visita || 'Não informado'}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 text-xs hidden sm:table-cell">
                      {formatarDataCurta(lead.created_at)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RecentLeadsTableSkeleton() {
  return (
    <Card className="shadow-sm border-slate-100">
      <CardHeader className="pb-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-72 mt-1" />
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </CardContent>
    </Card>
  )
}
