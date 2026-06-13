import { ClassificacaoLead } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ClassificationBadgeProps {
  classificacao: ClassificacaoLead
  size?: 'sm' | 'md' | 'lg'
}

const config: Record<
  ClassificacaoLead,
  { label: string; emoji: string; classes: string }
> = {
  quente: {
    label: 'Quente',
    emoji: '🟢',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  },
  morno: {
    label: 'Morno',
    emoji: '🟡',
    classes: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  },
  frio: {
    label: 'Frio',
    emoji: '🔴',
    classes: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
  },
}

export function ClassificationBadge({
  classificacao,
  size = 'sm',
}: ClassificationBadgeProps) {
  const { label, emoji, classes } = config[classificacao]

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border transition-colors duration-150',
        classes,
        size === 'lg' && 'text-sm px-3 py-1',
        size === 'md' && 'text-xs px-2.5 py-0.5',
        size === 'sm' && 'text-xs px-2 py-0.5'
      )}
    >
      <span className="mr-1">{emoji}</span>
      {label}
    </Badge>
  )
}
