'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, Loader2 } from 'lucide-react'
import { togglePauseIaAction } from '@/app/dashboard/leads/actions'

interface PauseIaButtonProps {
  id: string
  initialPausarIa: boolean
}

export function PauseIaButton({ id, initialPausarIa }: PauseIaButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [pausarIa, setPausarIa] = useState(initialPausarIa)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = () => {
    setError(null)
    const originalStatus = pausarIa
    const nextStatus = !originalStatus
    
    // Atualização otimista
    setPausarIa(nextStatus)

    startTransition(async () => {
      const result = await togglePauseIaAction(id, originalStatus)
      if (!result.success) {
        // Se falhar, reverte o estado para o valor original e exibe o erro
        setPausarIa(originalStatus)
        setError(result.error || 'Erro ao atualizar status da IA')
      }
    })
  }

  return (
    <div className="flex flex-col flex-1">
      {pausarIa ? (
        <Button
          onClick={handleToggle}
          disabled={isPending}
          variant="default"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-1.5 text-xs h-9 transition-colors"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          Retomar IA
        </Button>
      ) : (
        <Button
          onClick={handleToggle}
          disabled={isPending}
          variant="outline"
          className="w-full border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 font-medium gap-1.5 text-xs h-9 transition-colors"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Pause className="w-3.5 h-3.5" />
          )}
          Pausar IA
        </Button>
      )}
      {error && (
        <span className="text-[10px] text-red-500 mt-1 block text-center font-medium">
          {error}
        </span>
      )}
    </div>
  )
}
