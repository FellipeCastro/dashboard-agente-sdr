'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { LeadsTable } from './leads-table'
import { Lead } from '@/types'

interface LeadsTableWrapperProps {
  leads: Lead[]
  total: number
  pagina: number
  totalPaginas: number
  tamanhoPagina: number
}

export function LeadsTableWrapper({
  leads,
  total,
  pagina,
  totalPaginas,
  tamanhoPagina,
}: LeadsTableWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const atualizarParam = (chave: string, valor: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(chave, valor)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <LeadsTable
      leads={leads}
      total={total}
      pagina={pagina}
      totalPaginas={totalPaginas}
      tamanhoPagina={tamanhoPagina}
      onPaginaChange={(p) => atualizarParam('pagina', String(p))}
      onTamanhoPaginaChange={(t) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('tamanho', String(t))
        params.set('pagina', '1') // reseta página ao mudar tamanho
        router.push(`${pathname}?${params.toString()}`)
      }}
    />
  )
}
