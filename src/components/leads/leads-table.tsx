import Link from 'next/link'
import { Lead } from '@/types'
import { formatarDataCurta, formatarTelefone, capitalizarNome, formatarRenda } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { OPCOES_PAGINA } from '@/constants'

interface LeadsTableProps {
  leads: Lead[]
  total: number
  pagina: number
  totalPaginas: number
  tamanhoPagina: number
  onPaginaChange: (pagina: number) => void
  onTamanhoPaginaChange: (tamanho: number) => void
}

export function LeadsTable({
  leads,
  total,
  pagina,
  totalPaginas,
  tamanhoPagina,
  onPaginaChange,
  onTamanhoPaginaChange,
}: LeadsTableProps) {
  return (
    <Card className="shadow-sm border-slate-100">
      <CardContent className="p-0">
        {/* Tabela */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Telefone</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Intenção</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Transação</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Tipo Imóvel</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Faixa Preço</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Visita</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Data</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16 text-slate-400 text-sm">
                    Nenhum lead encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="font-medium text-slate-800 py-3">
                      {capitalizarNome(lead.nome)}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm hidden md:table-cell">
                      {formatarTelefone(lead.telefone)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {lead.intencao ? (
                        <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                          {lead.intencao}
                        </Badge>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-slate-600">
                      {lead.transacao || '—'}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm hidden xl:table-cell">
                      <div>
                        <span>{lead.tipo_imovel ?? '—'}</span>
                        {lead.imovel_de_interesse && (
                          <span className="block text-[11px] text-slate-400 italic mt-0.5 max-w-[150px] truncate" title={lead.imovel_de_interesse}>
                            {lead.imovel_de_interesse}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm hidden lg:table-cell">
                      {formatarRenda(lead.faixa_de_preco)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {lead.status_visita || 'Não informado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs hidden sm:table-cell">
                      {formatarDataCurta(lead.created_at)}
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/leads/${lead.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Linhas por página:</span>
            <Select
              value={String(tamanhoPagina)}
              onValueChange={(v) => onTamanhoPaginaChange(Number(v))}
            >
              <SelectTrigger className="h-7 w-16 text-xs border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPCOES_PAGINA.map((op) => (
                  <SelectItem key={op} value={String(op)} className="text-xs">{op}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              {total === 0 ? '0' : `${(pagina - 1) * tamanhoPagina + 1}–${Math.min(pagina * tamanhoPagina, total)}`} de {total}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-slate-200"
                disabled={pagina <= 1}
                onClick={() => onPaginaChange(pagina - 1)}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-slate-200"
                disabled={pagina >= totalPaginas}
                onClick={() => onPaginaChange(pagina + 1)}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
