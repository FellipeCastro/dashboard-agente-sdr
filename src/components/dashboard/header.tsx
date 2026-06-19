import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, ChevronDown } from 'lucide-react'

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const email = user?.email ?? ''
  const iniciais = email
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0">
      {/* Slot para título da página — preenchido pelas páginas via layout */}
      <div id="page-title-slot" />

      {/* Área do usuário */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2.5 h-10 px-3 hover:bg-slate-50 rounded-xl"
          >
            <Avatar className="w-7 h-7">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                {iniciais}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-40 truncate">
              {email}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <p className="text-xs text-slate-500">Conectado como</p>
            <p className="text-sm font-medium text-slate-800 truncate">{email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <form action={signOut}>
            <DropdownMenuItem asChild>
              <button
                type="submit"
                className="w-full flex items-center gap-2 text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
