'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GitBranch, BarChart3, Shield, Zap, Code2, TrendingUp } from 'lucide-react'
import { GitHubOAuthButton } from '@/components/GitHubOAuth'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CodeAnalyzer</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="/" className="text-sm font-medium hover:text-primary">Dashboard</Link>
            <Link href="/dashboard/repositories" className="text-sm font-medium hover:text-primary">Repositories</Link>
            <Link href="/dashboard/analysis" className="text-sm font-medium hover:text-primary">Analytics</Link>
            <Link href="/dashboard/security" className="text-sm font-medium hover:text-primary">Security</Link>
          </nav>
          <Button>Sign In with GitHub</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-card via-background to-background py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-balance md:text-5xl mb-4">
            Analyze Your GitHub Code with AI
          </h1>
          <p className="text-lg text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Get instant insights on code quality, security vulnerabilities, performance metrics, and maintainability. Make data-driven decisions about your codebase.
          </p>
          <GitHubOAuthButton />
          <Button size="lg" variant="outline" className="ml-4">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Powerful Analysis Tools</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Code Quality Card */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Code Quality Analysis
                    </CardTitle>
                    <CardDescription>Measure complexity and maintainability</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Automated analysis of code complexity, maintainability metrics, and architectural patterns. Get actionable insights to improve code quality.
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-accent" />
                    Security Scanning
                  </CardTitle>
                  <CardDescription>Detect vulnerabilities instantly</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Identify security vulnerabilities, dependencies issues, and code patterns that could lead to exploits. Stay ahead of threats.
              </CardContent>
            </Card>

            {/* Performance Card */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-chart-4" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Optimize runtime efficiency</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Track performance metrics, benchmark against best practices, and identify optimization opportunities in your code.
              </CardContent>
            </Card>

            {/* Repository Comparison */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Compare Repositories
                  </CardTitle>
                  <CardDescription>Side-by-side analysis</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Compare metrics across multiple repositories to understand differences in quality, coverage, and architecture.
              </CardContent>
            </Card>

            {/* Real-time Insights */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-accent" />
                    Real-time Updates
                  </CardTitle>
                  <CardDescription>Live job progress tracking</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Watch analysis progress in real-time with WebSocket updates. Get notified when analysis completes.
              </CardContent>
            </Card>

            {/* AI-Powered Insights */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-chart-2" />
                    AI-Powered Insights
                  </CardTitle>
                  <CardDescription>Smart recommendations</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Get AI-generated insights and recommendations based on code patterns, using local LLM for privacy.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to analyze your code?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect your GitHub account and start analyzing your repositories in minutes. No credit card required.
          </p>
          <GitHubOAuthButton />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Docs</Link></li>
                <li><Link href="#" className="hover:text-foreground">API</Link></li>
                <li><Link href="#" className="hover:text-foreground">GitHub</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CodeAnalyzer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
