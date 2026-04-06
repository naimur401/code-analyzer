'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Code2, BarChart3, Shield, Settings } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { token, user, logout, loadFromStorage, isLoading } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    loadFromStorage()
    setMounted(true)
  }, [loadFromStorage])

  useEffect(() => {
    if (mounted && !token) {
      router.push('/')
    }
  }, [token, mounted, router])

  if (!mounted || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">CodeAnalyzer</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink href="/dashboard" icon={BarChart3} label="Dashboard" />
          <NavLink href="/dashboard/repositories" icon={Code2} label="Repositories" />
          <NavLink href="/dashboard/analysis" icon={BarChart3} label="Analysis" />
          <NavLink href="/dashboard/security" icon={Shield} label="Security" />
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="text-sm">
            <p className="text-muted-foreground text-xs uppercase">User</p>
            <p className="font-medium truncate">{user?.username}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              logout()
              router.push('/')
            }}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div></div>
            <Link href="/dashboard/settings" className="p-2 hover:bg-muted rounded-lg">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  )
}
