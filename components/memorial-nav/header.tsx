"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, MapPin, CheckCircle, X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useBookmarks, type AppNotification } from "@/components/bookmark-provider"

export function Header() {
  const { t } = useLanguage()
  const { notifications, markNotificationAsRead, clearAllNotifications, unreadCount } = useBookmarks()
  const [showNotifications, setShowNotifications] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showNotifications])

  return (
    <header className="bg-[#1a472a] text-white px-4 py-3 relative z-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">MemorialNav</h1>
          <p className="text-xs text-white/80">{t("Find & Honor", "Hanapin at Parangalan")}</p>
        </div>
        <div className="relative" ref={panelRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <span className="sr-only">{t("Notifications", "Mga Abiso")}</span>
          </button>

          {/* Notification Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card text-foreground rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="bg-[#1a472a] text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-sm">{t("Notifications", "Mga Abiso")}</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      clearAllNotifications()
                      setShowNotifications(false)
                    }}
                    className="text-xs text-white/70 hover:text-white"
                  >
                    {t("Clear all", "Burahin lahat")}
                  </button>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t("No notifications", "Walang mga abiso")}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification: AppNotification) => {
                      if (notification.type === "grave_moved") {
                        return (
                          <div 
                            key={notification.id} 
                            className={`p-3 hover:bg-muted/50 transition-colors ${!notification.read ? "bg-[#e8f0e8] dark:bg-[#1a472a]/20" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full ${notification.read ? "bg-gray-200 dark:bg-gray-700" : "bg-[#1a472a]"}`}>
                                <MapPin className={`w-4 h-4 ${notification.read ? "text-gray-500" : "text-white"}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground text-sm">{notification.deceasedName}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {t("Grave has been relocated", "Inilipat ang libingan")}
                                </p>
                                <p className="text-xs text-[#1a472a] dark:text-[#4ade80] font-medium mt-0.5">
                                  {notification.newLocation.section} {notification.newLocation.block}-{notification.newLocation.row}-{notification.newLocation.graveNumber}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notification.movedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => markNotificationAsRead(notification.id)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex-shrink-0"
                              >
                                <X className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                        )
                      } else if (notification.type === "reservation_approved") {
                        return (
                          <div 
                            key={notification.id} 
                            className={`p-3 hover:bg-muted/50 transition-colors ${!notification.read ? "bg-green-50 dark:bg-green-900/20" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full ${notification.read ? "bg-gray-200 dark:bg-gray-700" : "bg-green-500"}`}>
                                <CheckCircle className={`w-4 h-4 ${notification.read ? "text-gray-500" : "text-white"}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground text-sm">
                                  {t("Reservation Approved", "Naaprobahan ang Reserbasyon")}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {t("Your lot reservation has been approved", "Naaprobahan ang iyong reserbasyon")}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                                  {notification.section} {notification.block}-{notification.row}-{notification.lotNumber}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notification.approvedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => markNotificationAsRead(notification.id)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex-shrink-0"
                              >
                                <X className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
