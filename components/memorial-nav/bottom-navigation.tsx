"use client"

import { Map, Search, MessageCircleQuestion, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { id: "maps", label: "Maps", icon: Map },
  { id: "search", label: "Search", icon: Search },
  { id: "inquire", label: "Inquire", icon: MessageCircleQuestion },
  { id: "settings", label: "Settings", icon: Settings },
]

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="bg-card border-t border-border px-2 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[64px]",
                isActive 
                  ? "text-[#1a472a] dark:text-[#4ade80]" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full transition-colors",
                  isActive && "bg-[#1a472a] text-white"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
