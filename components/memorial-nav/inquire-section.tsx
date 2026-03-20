"use client"

import { useState } from "react"
import { Building2, Flower2, Home, ChevronLeft, MapPin, Check, Phone, Mail, MessageSquare } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

type LotType = "mausoleum" | "garden" | "apartment" | null
type ViewState = "select-type" | "browse-lots" | "lot-detail" | "contact-admin"

interface Lot {
  id: string
  name: string
  section: string
  block: string
  price: number
  status: "available" | "reserved"
}

interface LotTypeInfo {
  id: LotType
  icon: typeof Building2
  titleEn: string
  titleTl: string
  descriptionEn: string
  descriptionTl: string
  price: number
  downPayment?: number
  annualTax: number
  taxNoteEn?: string
  taxNoteTl?: string
  size: string
}

const lotTypes: LotTypeInfo[] = [
  {
    id: "mausoleum",
    icon: Building2,
    titleEn: "Mausoleum",
    titleTl: "Mausoleum",
    descriptionEn: "Above-ground burial structure",
    descriptionTl: "May building ang libing sa ibabaw ng lupa",
    price: 60000,
    downPayment: 15000,
    annualTax: 750,
    size: "1.21m x 2.22m"
  },
  {
    id: "garden",
    icon: Flower2,
    titleEn: "Garden",
    titleTl: "Garden",
    descriptionEn: "Traditional in-ground burial plot",
    descriptionTl: "Tradisyonal na lote ng libing sa ilalim ng lupa",
    price: 5000,
    annualTax: 250,
    size: "24 sqm (6m x 4m)"
  },
  {
    id: "apartment",
    icon: Home,
    titleEn: "Apartment",
    titleTl: "Apartment",
    descriptionEn: "Multi-level niche for remains",
    descriptionTl: "Nakapalapag para sa labi",
    price: 2250,
    annualTax: 250,
    taxNoteEn: "Tax starts after 5 years of burial",
    taxNoteTl: "Ang buwis ay nagsisimula pagkatapos ng 5 taon ng libing",
    size: "Standard niche"
  },
]

const lotsData: Record<string, Lot[]> = {
  mausoleum: [
    { id: "M001", name: "Mausoleum A - Unit 1", section: "A", block: "1", price: 60000, status: "available" },
    { id: "M002", name: "Mausoleum A - Unit 2", section: "A", block: "2", price: 60000, status: "reserved" },
    { id: "M003", name: "Mausoleum B - Unit 1", section: "B", block: "1", price: 60000, status: "available" },
    { id: "M004", name: "Mausoleum B - Unit 2", section: "B", block: "2", price: 60000, status: "available" },
    { id: "M005", name: "Mausoleum C - Unit 1", section: "C", block: "1", price: 60000, status: "reserved" },
    { id: "M006", name: "Mausoleum C - Unit 2", section: "C", block: "2", price: 60000, status: "available" },
  ],
  garden: [
    { id: "G001", name: "Garden of Peace - Lot 1", section: "Peace", block: "1", price: 5000, status: "available" },
    { id: "G002", name: "Garden of Peace - Lot 2", section: "Peace", block: "2", price: 5000, status: "available" },
    { id: "G003", name: "Garden of Serenity - Lot 1", section: "Serenity", block: "1", price: 5000, status: "reserved" },
    { id: "G004", name: "Garden of Serenity - Lot 2", section: "Serenity", block: "2", price: 5000, status: "available" },
    { id: "G005", name: "Garden of Hope - Lot 1", section: "Hope", block: "1", price: 5000, status: "available" },
    { id: "G006", name: "Garden of Hope - Lot 2", section: "Hope", block: "2", price: 5000, status: "reserved" },
  ],
  apartment: [
    { id: "A001", name: "Apartment Level 1 - Niche A1", section: "Level 1", block: "A", price: 2250, status: "available" },
    { id: "A002", name: "Apartment Level 1 - Niche A2", section: "Level 1", block: "A", price: 2250, status: "available" },
    { id: "A003", name: "Apartment Level 2 - Niche B1", section: "Level 2", block: "B", price: 2250, status: "reserved" },
    { id: "A004", name: "Apartment Level 2 - Niche B2", section: "Level 2", block: "B", price: 2250, status: "available" },
    { id: "A005", name: "Apartment Level 3 - Niche C1", section: "Level 3", block: "C", price: 2250, status: "available" },
    { id: "A006", name: "Apartment Level 3 - Niche C2", section: "Level 3", block: "C", price: 2250, status: "reserved" },
  ],
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(price)
}

export function InquireSection() {
  const [viewState, setViewState] = useState<ViewState>("select-type")
  const [selectedType, setSelectedType] = useState<LotType>(null)
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null)
  const { language, t } = useLanguage()

  const handleSelectType = (type: LotType) => {
    setSelectedType(type)
    setViewState("browse-lots")
  }

  const handleSelectLot = (lot: Lot) => {
    setSelectedLot(lot)
    setViewState("lot-detail")
  }

  const handleBack = () => {
    if (viewState === "contact-admin") {
      setViewState("lot-detail")
    } else if (viewState === "lot-detail") {
      setViewState("browse-lots")
      setSelectedLot(null)
    } else if (viewState === "browse-lots") {
      setViewState("select-type")
      setSelectedType(null)
    }
  }

  const handleReserveLot = () => {
    setViewState("contact-admin")
  }

  const currentLotType = lotTypes.find(t => t.id === selectedType)
  const availableLots = selectedType ? lotsData[selectedType] : []

  // Select Lot Type View
  if (viewState === "select-type") {
    return (
      <div className="flex-1 flex flex-col bg-background p-4 min-h-0 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            {t("Inquire a Lot", "Magtanong Tungkol sa Lote")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("Choose the type of burial lot you are looking for", "Piliin ang uri ng lote ng libing na iyong hinahanap")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {lotTypes.map((type) => {
            const Icon = type.icon
            const title = language === "en" ? type.titleEn : type.titleTl
            const description = language === "en" ? type.descriptionEn : type.descriptionTl
            return (
              <button
                key={type.id}
                onClick={() => handleSelectType(type.id)}
                className="w-full flex items-start gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#1a472a]/50 hover:shadow-md transition-all text-left"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-[#1a472a] rounded-xl shrink-0">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground mb-2">{description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1a472a] dark:text-[#4ade80] font-bold">{formatPrice(type.price)}</span>
                    <span className="text-xs text-muted-foreground">• {type.size}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Browse Lots View
  if (viewState === "browse-lots" && selectedType && currentLotType) {
    const title = language === "en" ? currentLotType.titleEn : currentLotType.titleTl
    const availableCount = availableLots.filter(l => l.status === "available").length

    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header with Back */}
        <div className="p-4 border-b border-border">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#1a472a] dark:text-[#4ade80] mb-3"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">{t("Back", "Bumalik")}</span>
          </button>
          <h2 className="text-lg font-semibold text-foreground">
            {title} {t("Lots", "Lote")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {availableCount} {t("available lots", "mga available na lote")} • {formatPrice(currentLotType.price)} {t("each", "bawat isa")}
          </p>
        </div>

        {/* Lots List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-3">
            {availableLots.map((lot) => (
              <button
                key={lot.id}
                onClick={() => lot.status === "available" && handleSelectLot(lot)}
                disabled={lot.status === "reserved"}
                className={`w-full p-4 rounded-xl border text-left transition-all ${lot.status === "available"
                    ? "bg-card border-border hover:border-[#1a472a]/50 hover:shadow-md"
                    : "bg-muted border-border opacity-60 cursor-not-allowed"
                  }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
                    <span className="font-semibold text-foreground">{lot.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${lot.status === "available"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}>
                    {lot.status === "available" ? t("Available", "Available") : t("Reserved", "Nakareserba")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t("Section", "Seksyon")} {lot.section} • {t("Block", "Block")} {lot.block}
                  </p>
                  <p className="font-semibold text-[#1a472a] dark:text-[#4ade80]">{formatPrice(lot.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Lot Detail View
  if (viewState === "lot-detail" && selectedLot && currentLotType) {
    const title = language === "en" ? currentLotType.titleEn : currentLotType.titleTl
    const taxNote = language === "en" ? currentLotType.taxNoteEn : currentLotType.taxNoteTl

    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <p className="text-sm text-white/80 mb-1">{title}</p>
          <h2 className="text-xl font-bold">{selectedLot.name}</h2>
        </div>

        {/* Details */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Price Card */}
          <div className="bg-[#1a472a]/10 dark:bg-[#1a472a]/30 rounded-xl p-4 mb-4">
            <p className="text-sm text-muted-foreground mb-1">{t("Total Price", "Kabuuang Presyo")}</p>
            <p className="text-2xl font-bold text-[#1a472a] dark:text-[#4ade80]">{formatPrice(currentLotType.price)}</p>
            {currentLotType.downPayment && (
              <p className="text-sm text-[#1a472a] dark:text-[#4ade80] mt-1">
                {t("Down Payment (25%)", "Paunang Bayad (25%)")}: {formatPrice(currentLotType.downPayment)}
              </p>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-card rounded-xl border border-border p-4 mb-4">
            <h3 className="font-semibold text-foreground mb-3">{t("Payment Information", "Impormasyon sa Pagbabayad")}</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("Annual Tax", "Taunang Buwis")}</span>
                <span className="font-medium text-foreground">{formatPrice(currentLotType.annualTax)}/{t("year", "taon")}</span>
              </div>
              {taxNote && (
                <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg">
                  {taxNote}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("Lot Size", "Sukat ng Lote")}</span>
                <span className="font-medium text-foreground">{currentLotType.size}</span>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-card rounded-xl border border-border p-4 mb-4">
            <h3 className="font-semibold text-foreground mb-3">{t("Location Details", "Mga Detalye ng Lokasyon")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("Section", "Seksyon")}</p>
                <p className="font-medium text-foreground">{selectedLot.section}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("Block", "Block")}</p>
                <p className="font-medium text-foreground">{selectedLot.block}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("Lot ID", "Lot ID")}</p>
                <p className="font-medium text-foreground">{selectedLot.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("Status", "Status")}</p>
                <p className="font-medium text-green-600 dark:text-green-400">{t("Available", "Available")}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">{t("Includes", "Kasama")}</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
                <span className="text-sm text-foreground">{t("Deed of sale", "Deed of sale")}</span>
              </div>
              {selectedType === "mausoleum" ? (
                <>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
                    <span className="text-sm text-foreground">{t("Perpetual ownership", "Walang hanggang pagmamay-ari")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
                    <span className="text-sm text-foreground">{t("Certificate of ownership", "Sertipiko ng pagmamay-ari")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
                    <span className="text-sm text-foreground">{t("Maintenance access", "Access sa maintenance")}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
                    <span className="text-sm text-foreground">{t("Certificate of burial", "Sertipiko ng libing")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
                    <span className="text-sm text-foreground">{t("Option to request burial type change", "Opsyon na humiling ng pagbabago sa uri ng libing")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
                    <span className="text-sm text-foreground">{t("Maintenance access", "Access sa maintenance")}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="p-4 border-t border-border flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 py-3 px-4 rounded-xl border border-[#1a472a] dark:border-[#4ade80] text-[#1a472a] dark:text-[#4ade80] font-semibold hover:bg-[#1a472a]/5 transition-colors"
          >
            {t("Back", "Bumalik")}
          </button>
          <button
            onClick={handleReserveLot}
            className="flex-1 py-3 px-4 rounded-xl bg-[#1a472a] text-white font-semibold hover:bg-[#1a472a]/90 transition-colors"
          >
            {t("Reserve Lot", "Mag-reserve ng Lote")}
          </button>
        </div>
      </div>
    )
  }

  // Contact Administrator View
  if (viewState === "contact-admin" && selectedLot && currentLotType) {
    const phoneNumber = "+63 912 345 6789"
    const email = "admin@anahaocemetery.com"
    const title = language === "en" ? currentLotType.titleEn : currentLotType.titleTl

    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <p className="text-sm text-white/80 mb-1">{t("Reserve Lot", "Mag-reserve ng Lote")}</p>
          <h2 className="text-xl font-bold">{t("Contact Administrator", "Makipag-ugnayan sa Administrator")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Selected Lot Summary */}
          <div className="bg-[#1a472a]/10 dark:bg-[#1a472a]/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">{t("Selected Lot", "Napiling Lote")}</p>
            <p className="font-bold text-[#1a472a] dark:text-[#4ade80]">{selectedLot.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {title} • {formatPrice(currentLotType.price)}
            </p>
          </div>

          <p className="text-sm text-muted-foreground mb-6 text-center">
            {t(
              "Contact the cemetery administrator to complete your lot reservation",
              "Makipag-ugnayan sa administrator ng sementeryo upang makumpleto ang iyong reserbasyon ng lote"
            )}
          </p>

          {/* Contact Options */}
          <div className="flex flex-col gap-4">
            {/* Call */}
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#1a472a]/50 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-[#1a472a] rounded-xl shrink-0">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{t("Call Administrator", "Tawagan ang Administrator")}</p>
                <p className="text-sm text-muted-foreground">{t("Speak directly with us", "Makipag-usap direkta sa amin")}</p>
                <p className="text-sm text-[#1a472a] dark:text-[#4ade80] font-medium mt-1">{phoneNumber}</p>
              </div>
            </a>

            {/* SMS */}
            <a
              href={`sms:${phoneNumber.replace(/\s/g, '')}?body=Hi, I would like to inquire about reserving ${selectedLot.name} (${title}) at Anahao Public Cemetery.`}
              className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#1a472a]/50 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-[#1a472a] rounded-xl shrink-0">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{t("Send SMS", "Magpadala ng SMS")}</p>
                <p className="text-sm text-muted-foreground">{t("Text us your inquiry", "I-text sa amin ang iyong katanungan")}</p>
                <p className="text-sm text-[#1a472a] dark:text-[#4ade80] font-medium mt-1">{phoneNumber}</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}?subject=Lot Reservation Inquiry - ${selectedLot.name}&body=Hello,%0D%0A%0D%0AI would like to inquire about reserving the following lot:%0D%0A%0D%0ALot: ${selectedLot.name}%0D%0AType: ${title}%0D%0APrice: ${formatPrice(currentLotType.price)}%0D%0A%0D%0APlease contact me regarding the reservation process.%0D%0A%0D%0AThank you.`}
              className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#1a472a]/50 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-[#1a472a] rounded-xl shrink-0">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{t("Send Email", "Magpadala ng Email")}</p>
                <p className="text-sm text-muted-foreground">{t("Email your inquiry", "I-email ang iyong katanungan")}</p>
                <p className="text-sm text-[#1a472a] dark:text-[#4ade80] font-medium mt-1">{email}</p>
              </div>
            </a>
          </div>

          {/* Office Hours */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{t("Office Hours", "Oras ng Opisina")}</p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">{t("Monday - Friday", "Lunes - Biyernes")}: 8:00 AM - 5:00 PM</p>
            <p className="text-sm text-amber-700 dark:text-amber-400">{t("Saturday", "Sabado")}: 8:00 AM - 12:00 PM</p>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleBack}
            className="w-full py-3 px-4 rounded-xl border border-[#1a472a] dark:border-[#4ade80] text-[#1a472a] dark:text-[#4ade80] font-semibold hover:bg-[#1a472a]/5 transition-colors"
          >
            {t("Back to Lot Details", "Bumalik sa Mga Detalye ng Lote")}
          </button>
        </div>
      </div>
    )
  }

  return null
}
