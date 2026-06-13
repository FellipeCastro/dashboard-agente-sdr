'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import {
  CLASSIFICACOES,
  ACOES,
  OPCOES_RENDA,
  OPCOES_RESTRICAO,
  TIPOS_IMOVEL,
} from '@/constants'

export function LeadsFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const obterParam = (chave: string) => searchParams.get(chave) ?? ''

  const atualizarParam = useCallback(
    (chave: string, valor: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (valor && valor !== 'todos') {
        params.set(chave, valor)
      } else {
        params.delete(chave)
      }
      // Reset para página 1 sempre que filtros mudam
      params.set('pagina', '1')
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const limparFiltros = () => {
    router.push(pathname)
  }

  const temFiltros = searchParams.toString().replace(/pagina=\d+&?/, '').length > 0

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-4">
      {/* Linha 1: busca */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            id="busca-leads"
            placeholder="Buscar por nome ou telefone..."
            defaultValue={obterParam('busca')}
            onChange={(e) => atualizarParam('busca', e.target.value)}
            className="pl-9 h-9 border-slate-200 text-sm"
          />
        </div>
        {temFiltros && (
          <Button
            variant="ghost"
            size="sm"
            onClick={limparFiltros}
            className="text-slate-500 hover:text-slate-700 text-xs gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Linha 2: filtros em grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Classificação */}
        <Select
          value={obterParam('classificacao') || 'todos'}
          onValueChange={(v) => atualizarParam('classificacao', v)}
        >
          <SelectTrigger id="filtro-classificacao" className="h-9 text-xs border-slate-200">
            <SelectValue placeholder="Classificação" />
          </SelectTrigger>
          <SelectContent>
            {CLASSIFICACOES.map((item) => (
              <SelectItem key={item.value} value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Ação */}
        <Select
          value={obterParam('acao') || 'todos'}
          onValueChange={(v) => atualizarParam('acao', v)}
        >
          <SelectTrigger id="filtro-acao" className="h-9 text-xs border-slate-200">
            <SelectValue placeholder="Ação" />
          </SelectTrigger>
          <SelectContent>
            {ACOES.map((item) => (
              <SelectItem key={item.value} value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Renda */}
        <Select
          value={obterParam('renda') || 'todos'}
          onValueChange={(v) => atualizarParam('renda', v)}
        >
          <SelectTrigger id="filtro-renda" className="h-9 text-xs border-slate-200">
            <SelectValue placeholder="Renda" />
          </SelectTrigger>
          <SelectContent>
            {OPCOES_RENDA.map((item) => (
              <SelectItem key={item.value} value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Restrição */}
        <Select
          value={obterParam('restricao') || 'todos'}
          onValueChange={(v) => atualizarParam('restricao', v)}
        >
          <SelectTrigger id="filtro-restricao" className="h-9 text-xs border-slate-200">
            <SelectValue placeholder="Restrição" />
          </SelectTrigger>
          <SelectContent>
            {OPCOES_RESTRICAO.map((item) => (
              <SelectItem key={item.value} value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tipo de imóvel */}
        <Select
          value={obterParam('tipo_imovel') || 'todos'}
          onValueChange={(v) => atualizarParam('tipo_imovel', v === 'todos' ? '' : v)}
        >
          <SelectTrigger id="filtro-tipo-imovel" className="h-9 text-xs border-slate-200">
            <SelectValue placeholder="Tipo de Imóvel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos" className="text-xs">Todos os Tipos</SelectItem>
            {TIPOS_IMOVEL.map((tipo) => (
              <SelectItem key={tipo} value={tipo} className="text-xs">
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Período — data inicial */}
        <div className="flex items-center gap-1.5">
          <Input
            id="filtro-data-inicio"
            type="date"
            defaultValue={obterParam('data_inicio')}
            onChange={(e) => atualizarParam('data_inicio', e.target.value)}
            className="h-9 text-xs border-slate-200 w-full"
            title="Data inicial"
          />
        </div>
      </div>

      {/* Data fim em linha separada quando necessário */}
      {obterParam('data_inicio') && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">até</span>
          <Input
            id="filtro-data-fim"
            type="date"
            defaultValue={obterParam('data_fim')}
            onChange={(e) => atualizarParam('data_fim', e.target.value)}
            min={obterParam('data_inicio')}
            className="h-9 text-xs border-slate-200 w-44"
            title="Data final"
          />
        </div>
      )}
    </div>
  )
}
