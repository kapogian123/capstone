"use client"

import { useState, useEffect } from "react"
import { Bell, Moon, Globe, Info, ChevronLeft, Check, Sun, Smartphone, User, Lock, LogOut, Camera, Save, Bookmark, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { useBookmarks } from "@/components/bookmark-provider"

type SettingsView = "main" | "notifications" | "appearance" | "language" | "about" | "account"

interface NotificationSettings {
  pushEnabled: boolean
  updates: boolean
  reminders: boolean
}

interface AccountSettings {
  name: string
  email: string
  avatar: string
}

export function SettingsSection() {
  const [currentView, setCurrentView] = useState<SettingsView>("main")
  const [notifications, setNotifications] = useState<NotificationSettings>({
    pushEnabled: true,
    updates: true,
    reminders: false,
  })
  const [account, setAccount] = useState<AccountSettings>({
    name: "Guest User",
    email: "guest@example.com",
    avatar: "",
  })
  const [editingProfile, setEditingProfile] = useState(false)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { bookmarks, removeBookmark } = useBookmarks()

  // Load settings from localStorage
  useEffect(() => {
    setMounted(true)
    const storedNotifications = localStorage.getItem("memorial-nav-notifications")
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications))
      } catch {
        // Use default settings if parse fails
      }
    }
    const storedAccount = localStorage.getItem("memorial-nav-account")
    if (storedAccount) {
      try {
        setAccount(JSON.parse(storedAccount))
      } catch {
        // Use default settings if parse fails
      }
    }
  }, [])

  // Save notification settings to localStorage
  const updateNotifications = (newSettings: NotificationSettings) => {
    setNotifications(newSettings)
    localStorage.setItem("memorial-nav-notifications", JSON.stringify(newSettings))
  }

  // Save account settings to localStorage
  const updateAccount = (newSettings: AccountSettings) => {
    setAccount(newSettings)
    localStorage.setItem("memorial-nav-account", JSON.stringify(newSettings))
  }

  // Start editing profile
  const startEditingProfile = () => {
    setEditName(account.name)
    setEditEmail(account.email)
    setEditingProfile(true)
  }

  // Save profile changes
  const saveProfile = () => {
    if (editName.trim() && editEmail.trim()) {
      updateAccount({ ...account, name: editName.trim(), email: editEmail.trim() })
      setEditingProfile(false)
    }
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingProfile(false)
    setEditName("")
    setEditEmail("")
  }

  // Handle password change
  const handlePasswordChange = () => {
    setPasswordError("")
    setPasswordSuccess(false)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t("Please fill in all fields", "Pakipunan ang lahat ng mga field"))
      return
    }

    if (newPassword.length < 6) {
      setPasswordError(t("Password must be at least 6 characters", "Ang password ay dapat hindi bababa sa 6 na karakter"))
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t("Passwords do not match", "Hindi tugma ang mga password"))
      return
    }

    // Simulate password change (in a real app, this would call an API)
    setPasswordSuccess(true)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => {
      setChangingPassword(false)
      setPasswordSuccess(false)
    }, 2000)
  }

  // Handle logout
  const handleLogout = () => {
    // Clear all stored settings
    localStorage.removeItem("memorial-nav-account")
    localStorage.removeItem("memorial-nav-notifications")
    // Reset to defaults
    setAccount({ name: "Guest User", email: "guest@example.com", avatar: "" })
    setNotifications({ pushEnabled: true, updates: true, reminders: false })
    setCurrentView("main")
  }

  const handleBack = () => {
    setCurrentView("main")
  }

  const getAppearanceDescription = () => {
    if (!mounted) return ""
    if (theme === "light") return "Light mode"
    if (theme === "dark") return "Dark mode"
    return "System default"
  }

  // Main Settings View
  if (currentView === "main") {
    const settingsOptions = [
      {
        icon: User,
        title: "Account",
        description: account.name,
        view: "account" as SettingsView
      },
      {
        icon: Bell,
        title: "Notifications",
        description: "Push notifications and alerts",
        view: "notifications" as SettingsView
      },
      {
        icon: Moon,
        title: "Appearance",
        description: getAppearanceDescription(),
        view: "appearance" as SettingsView
      },
      {
        icon: Globe,
        title: "Language",
        description: language === "en" ? "English" : "Tagalog",
        view: "language" as SettingsView
      },
      {
        icon: Info,
        title: "About",
        description: "App version and info",
        view: "about" as SettingsView
      },
    ]

    return (
      <div className="flex-1 flex flex-col bg-background p-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Customize your app experience
          </p>
        </div>

        {/* Settings Options */}
        <div className="space-y-2">
          {settingsOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <button
                key={index}
                onClick={() => setCurrentView(option.view)}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#1a472a]/30 transition-colors text-left"
              >
                <div className="relative w-10 h-10 flex items-center justify-center bg-[#e8f0e8] dark:bg-[#1a472a]/30 rounded-full">
                  <Icon className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />
                  {"badge" in option && option.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {option.badge > 9 ? "9+" : option.badge}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180" />
              </button>
            )
          })}
        </div>

        {/* App Version */}
        <div className="mt-auto pt-6 text-center">
          <p className="text-sm text-muted-foreground">MemorialNav v1.0.0</p>
        </div>
      </div>
    )
  }

  // Account View
  if (currentView === "account") {
    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <button onClick={handleBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{t("Back", "Bumalik")}</span>
          </button>
          <h2 className="text-xl font-bold">{t("Account", "Account")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-6 pt-2">
            <div className="relative mb-3">
              <div className="w-20 h-20 bg-[#1a472a] rounded-full flex items-center justify-center">
                {account.avatar ? (
                  <img src={account.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold">{account.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#1a472a] border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            {!editingProfile ? (
              <>
                <h3 className="text-lg font-semibold text-foreground">{account.name}</h3>
                <p className="text-sm text-muted-foreground">{account.email}</p>
              </>
            ) : null}
          </div>

          {/* Edit Profile Form */}
          {editingProfile ? (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("Name", "Pangalan")}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
                  placeholder={t("Enter your name", "Ilagay ang iyong pangalan")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("Email", "Email")}
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
                  placeholder={t("Enter your email", "Ilagay ang iyong email")}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cancelEditing}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-foreground rounded-xl font-medium"
                >
                  {t("Cancel", "Kanselahin")}
                </button>
                <button
                  onClick={saveProfile}
                  className="flex-1 py-3 px-4 bg-[#1a472a] text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {t("Save", "I-save")}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Account Options */}
              <div className="space-y-3">
                <button
                  onClick={startEditingProfile}
                  className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#1a472a]/30 transition-colors"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#e8f0e8] dark:bg-[#1a472a]/30 rounded-full">
                    <User className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{t("Edit Profile", "I-edit ang Profile")}</p>
                    <p className="text-sm text-muted-foreground">{t("Change name and email", "Baguhin ang pangalan at email")}</p>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180" />
                </button>

                <button
                  onClick={() => setChangingPassword(true)}
                  className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#1a472a]/30 transition-colors"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#e8f0e8] dark:bg-[#1a472a]/30 rounded-full">
                    <Lock className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{t("Change Password", "Palitan ang Password")}</p>
                    <p className="text-sm text-muted-foreground">{t("Update your password", "I-update ang iyong password")}</p>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180" />
                </button>
              </div>

              {/* Change Password Modal */}
              {changingPassword && (
                <div className="mt-4 p-4 bg-card rounded-xl border border-border">
                  <h4 className="font-medium text-foreground mb-4">{t("Change Password", "Palitan ang Password")}</h4>
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
                      placeholder={t("Current password", "Kasalukuyang password")}
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
                      placeholder={t("New password", "Bagong password")}
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
                      placeholder={t("Confirm new password", "Kumpirmahin ang bagong password")}
                    />
                    {passwordError && (
                      <p className="text-sm text-red-500">{passwordError}</p>
                    )}
                    {passwordSuccess && (
                      <p className="text-sm text-green-500">{t("Password changed successfully!", "Matagumpay na nabago ang password!")}</p>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          setChangingPassword(false)
                          setCurrentPassword("")
                          setNewPassword("")
                          setConfirmPassword("")
                          setPasswordError("")
                        }}
                        className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-foreground rounded-xl font-medium"
                      >
                        {t("Cancel", "Kanselahin")}
                      </button>
                      <button
                        onClick={handlePasswordChange}
                        className="flex-1 py-3 px-4 bg-[#1a472a] text-white rounded-xl font-medium"
                      >
                        {t("Update", "I-update")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <div className="mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">{t("Log Out", "Mag-log out")}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Notifications View
  if (currentView === "notifications") {
    const notificationOptions = [
      {
        key: "pushEnabled" as const,
        title: t("Push Notifications", "Push Notifications"),
        description: t("Receive push notifications", "Makatanggap ng push notifications"),
      },
      {
        key: "updates" as const,
        title: t("App Updates", "Mga Update ng App"),
        description: t("Get notified about new features", "Maabisuhan tungkol sa mga bagong feature"),
      },
      {
        key: "reminders" as const,
        title: t("Reminders", "Mga Paalala"),
        description: t("Memorial date reminders", "Mga paalala sa petsa ng memorial"),
      },
    ]

    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <button onClick={handleBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{t("Back", "Bumalik")}</span>
          </button>
          <h2 className="text-xl font-bold">{t("Notifications", "Mga Abiso")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Bookmarked Graves */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
              {t("Bookmarked Graves", "Mga Naka-bookmark na Libingan")}
              {bookmarks.length > 0 && (
                <span className="text-xs text-muted-foreground">({bookmarks.length})</span>
              )}
            </h3>
            {bookmarks.length === 0 ? (
              <div className="p-4 bg-card rounded-xl border border-border text-center">
                <Bookmark className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t("No bookmarked graves yet", "Wala pang naka-bookmark na libingan")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("Bookmark a grave to get notified of relocations", "Mag-bookmark ng libingan para maabisuhan sa paglipat")}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#e8f0e8] dark:bg-[#1a472a]/30 rounded-full">
                      <Bookmark className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{bookmark.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {bookmark.section} {bookmark.block}-{bookmark.row}-{bookmark.graveNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => removeBookmark(bookmark.name)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title={t("Remove bookmark", "Alisin ang bookmark")}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#1a472a] dark:text-[#4ade80]" />
              {t("Notification Settings", "Mga Setting ng Abiso")}
            </h3>
            <div className="space-y-3">
              {notificationOptions.map((option) => (
                <div key={option.key} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
                  <div>
                    <p className="font-medium text-foreground text-sm">{option.title}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  <button
                    onClick={() => updateNotifications({ ...notifications, [option.key]: !notifications[option.key] })}
                    className={`w-11 h-6 rounded-full transition-colors ${notifications[option.key] ? "bg-[#1a472a]" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform mx-1 ${notifications[option.key] ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Appearance View
  if (currentView === "appearance") {
    const appearanceOptions = [
      {
        mode: "light",
        icon: Sun,
        title: t("Light", "Light"),
        description: t("Light theme", "Light na tema")
      },
      {
        mode: "dark",
        icon: Moon,
        title: t("Dark", "Dark"),
        description: t("Dark theme", "Dark na tema")
      },
      {
        mode: "system",
        icon: Smartphone,
        title: t("System", "System"),
        description: t("Match device settings", "Sundin ang setting ng device")
      },
    ]

    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <button onClick={handleBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{t("Back", "Bumalik")}</span>
          </button>
          <h2 className="text-xl font-bold">{t("Appearance", "Hitsura")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-muted-foreground mb-4">
            {t("Choose your preferred theme", "Piliin ang iyong gustong tema")}
          </p>
          <div className="space-y-3">
            {appearanceOptions.map((option) => {
              const Icon = option.icon
              const isSelected = mounted && theme === option.mode
              return (
                <button
                  key={option.mode}
                  onClick={() => setTheme(option.mode)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${isSelected
                      ? "bg-[#1a472a]/10 dark:bg-[#1a472a]/30 border-[#1a472a]"
                      : "bg-card border-border hover:border-[#1a472a]/30"
                    }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${isSelected ? "bg-[#1a472a]" : "bg-[#e8f0e8] dark:bg-[#1a472a]/30"
                    }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#1a472a] dark:text-[#4ade80]"}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{option.title}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Language View
  if (currentView === "language") {
    const languageOptions = [
      {
        code: "en" as const,
        title: "English",
        nativeTitle: "English",
        description: "United States"
      },
      {
        code: "tl" as const,
        title: "Tagalog",
        nativeTitle: "Tagalog",
        description: "Pilipinas"
      },
    ]

    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <button onClick={handleBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{t("Back", "Bumalik")}</span>
          </button>
          <h2 className="text-xl font-bold">{t("Language", "Wika")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-muted-foreground mb-4">
            {t("Select your preferred language", "Piliin ang iyong gustong wika")}
          </p>
          <div className="space-y-3">
            {languageOptions.map((option) => {
              const isSelected = language === option.code
              return (
                <button
                  key={option.code}
                  onClick={() => setLanguage(option.code)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${isSelected
                      ? "bg-[#1a472a]/10 dark:bg-[#1a472a]/30 border-[#1a472a]"
                      : "bg-card border-border hover:border-[#1a472a]/30"
                    }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold ${isSelected ? "bg-[#1a472a] text-white" : "bg-[#e8f0e8] dark:bg-[#1a472a]/30 text-[#1a472a] dark:text-[#4ade80]"
                    }`}>
                    {option.code.toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{option.title}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[#1a472a] dark:text-[#4ade80]" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // About View
  if (currentView === "about") {
    return (
      <div className="flex-1 flex flex-col bg-background min-h-0">
        {/* Header */}
        <div className="bg-[#1a472a] text-white p-4">
          <button onClick={handleBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{t("Back", "Bumalik")}</span>
          </button>
          <h2 className="text-xl font-bold">{t("About", "Tungkol Sa")}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* App Logo and Name */}
          <div className="flex flex-col items-center mb-8 pt-4">
            <div className="w-20 h-20 bg-[#1a472a] rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white text-3xl font-bold">M</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">MemorialNav</h3>
            <p className="text-sm text-muted-foreground">
              {t("Find & Honor", "Hanapin at Parangalan")}
            </p>
          </div>

          {/* App Info */}
          <div className="space-y-3">
            <div className="flex justify-between p-4 bg-card rounded-xl border border-border">
              <span className="text-muted-foreground">
                {t("Version", "Bersyon")}
              </span>
              <span className="font-medium text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between p-4 bg-card rounded-xl border border-border">
              <span className="text-muted-foreground">
                {t("Build", "Build")}
              </span>
              <span className="font-medium text-foreground">2024.03.19</span>
            </div>
            <div className="flex justify-between p-4 bg-card rounded-xl border border-border">
              <span className="text-muted-foreground">
                {t("Developer", "Developer")}
              </span>
              <span className="font-medium text-foreground">Group 7</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 p-4 bg-[#1a472a]/5 dark:bg-[#1a472a]/20 rounded-xl">
            <p className="text-sm text-muted-foreground text-center">
              {t(
                "MemorialNav helps you navigate and find burial sites at Anahao Public Cemetery. Honor your loved ones with ease.",
                "Ang MemorialNav ay tumutulong sa iyo na mag-navigate at maghanap ng mga burial site sa Anahao Public Cemetery. Parangalan ang iyong mga mahal sa buhay nang madali."
              )}
            </p>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 Anahao Public Cemetery
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("All rights reserved", "Lahat ng karapatan ay nakalaan")}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
