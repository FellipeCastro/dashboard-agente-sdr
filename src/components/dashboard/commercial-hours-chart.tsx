'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { EstatisticasLeads } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface CommercialHoursChartProps {
  stats: EstatisticasLeads
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
        <p className="text-sm font-semibold text-slate-700">{data.name}</p>
        <p className="text-lg font-bold" style={{ color: data.color }}>
          {data.value} leads ({data.porcentagem}%)
        </p>
      </div>
    )
  }
  return null
}

export function CommercialHoursChart({ stats }: CommercialHoursChartProps) {
  const totalValidos = stats.dentroHorario + stats.foraHorario
  const pctDentro = totalValidos > 0 ? Math.round((stats.dentroHorario / totalValidos) * 100) : 0
  const pctFora = totalValidos > 0 ? Math.round((stats.foraHorario / totalValidos) * 100) : 0

  const dados = [
    {
      name: 'Comercial',
      value: stats.dentroHorario,
      porcentagem: pctDentro,
      color: '#6366f1', // Indigo
    },
    {
      name: 'Fora do Comercial',
      value: stats.foraHorario,
      porcentagem: pctFora,
      color: '#f43f5e', // Rose
    },
  ]

  return (
    <Card className="shadow-sm border-slate-100 flex flex-col h-[320px]">
      <CardHeader className="pb-1">
        <CardTitle className="text-base font-semibold text-slate-800">
          Distribuição por Horário 
        </CardTitle>
        <CardDescription className="text-sm text-slate-400">
          Atendimentos dentro vs fora do horário comercial
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center min-h-0 pt-0">
        <div className="h-[180px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dados}
                cx="55%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {dados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* {totalValidos > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-8">
              <span className="text-2xl font-bold text-slate-800">{totalValidos}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Leads</span>
            </div>
          )} */}
        </div>
        
        {/* Legenda Customizada */}
        <div className="flex items-center justify-center gap-6 mt-1 pr-8">
          {dados.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-medium text-slate-500 leading-none">{item.name}</span>
                <span className="text-xs font-bold text-slate-800 mt-1">
                  {item.value} ({item.porcentagem}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
