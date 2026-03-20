"use client"

import { useState } from "react"
import { Search, MapPin, Clock } from "lucide-react"
import { DeceasedDetail } from "./deceased-detail"
import { useLanguage } from "@/components/language-provider"

interface DeceasedInfo {
  name: string
  section: string
  birthDate: string
  deathDate: string
  burialDate: string
  age: number
  graveNumber: string
  row: string
  block: string
}

const recentSearches: DeceasedInfo[] = [
  {
    name: "Juan Dela Cruz",
    section: "Museleo",
    birthDate: "March 15, 1945",
    deathDate: "January 8, 2020",
    burialDate: "January 12, 2020",
    age: 74,
    graveNumber: "G-125",
    row: "5",
    block: "A"
  },
  {
    name: "Maria Santos",
    section: "Garden",
    birthDate: "July 22, 1952",
    deathDate: "May 3, 2021",
    burialDate: "May 7, 2021",
    age: 68,
    graveNumber: "G-089",
    row: "12",
    block: "B"
  },
  {
    name: "Pedro Garcia",
    section: "Apartment",
    birthDate: "November 10, 1938",
    deathDate: "August 19, 2019",
    burialDate: "August 23, 2019",
    age: 80,
    graveNumber: "G-201",
    row: "3",
    block: "C"
  },
]

interface SearchSectionProps {
  onNavigateToMap?: () => void
}

export function SearchSection({ onNavigateToMap }: SearchSectionProps) {
  const [selectedDeceased, setSelectedDeceased] = useState<DeceasedInfo | null>(null)
  const { t } = useLanguage()

  const handleDirections = () => {
    if (onNavigateToMap) {
      onNavigateToMap()
    }
    setSelectedDeceased(null)
  }

  if (selectedDeceased) {
    return (
      <DeceasedDetail
        deceased={selectedDeceased}
        onBack={() => setSelectedDeceased(null)}
        onDirections={handleDirections}
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background p-4 min-h-0 overflow-auto">
      {/* Search Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          {t("Find a Memorial", "Maghanap ng Memorial")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("Search by name of the deceased", "Maghanap gamit ang pangalan ng namatay")}
        </p>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#e8f0e8] dark:bg-[#1a472a]/30 rounded-xl mb-6">
        <Search className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />
        <input
          type="text"
          placeholder={t("Enter name...", "Ilagay ang pangalan...")}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Recent Searches */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("Recent Searches", "Recent Searches")}
          </h3>
        </div>

        <div className="space-y-2">
          {recentSearches.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedDeceased(item)}
              className="w-full flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:border-[#1a472a]/30 transition-colors text-left"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#e8f0e8] dark:bg-[#1a472a]/30 rounded-full">
                <MapPin className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />
              </div>
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.section}, {t("Row", "Row")} {item.row}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
