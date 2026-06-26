'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { EstatisticasLeads } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface LeadsChartProps {
  stats: EstatisticasLeads
}

const DADOS_GRAFICO = (stats: EstatisticasLeads) => [
  { nome: '🟢 Quentes', valor: stats.quentes, cor: '#10b981' },
  { nome: '🔴 Frios', valor: stats.frios, cor: '#ef4444' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-lg font-bold" style={{ color: payload[0]?.fill }}>
          {payload[0]?.value} leads
        </p>
      </div>
    )
  }
  return null
}

export function LeadsChart({ stats }: LeadsChartProps) {
  const dados = DADOS_GRAFICO(stats)

  return (
    <Card className="shadow-sm border-slate-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-slate-800">
          Distribuição por Temperatura
        </CardTitle>
        <CardDescription className="text-sm text-slate-400">
          Classificação dos leads captados pelo agente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dados} barSize={48} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="nome"
              tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 8 }} />
            <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.cor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
