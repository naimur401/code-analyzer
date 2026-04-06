'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { repositoriesApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Loader2 } from 'lucide-react'

interface Repository {
  _id: string
  name: string
  owner: string
}

interface Vulnerability {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: string
  description: string
  file: string
  recommendation: string
}

export default function SecurityPage() {
  const { token } = useAuthStore()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load repositories
  useEffect(() => {
    if (!token) return

    const loadRepos = async () => {
      try {
        const response = await repositoriesApi.getSavedRepositories(token, 1, 10)
        if (response.success && response.data) {
          setRepositories(Array.isArray(response.data) ? response.data : (response.data as any).data || [])
        }
      } catch (error) {
        console.error('Error loading repositories:', error)
      }
    }

    loadRepos()
  }, [token])

  // Mock vulnerabilities for demo
  useEffect(() => {
    if (selectedRepo) {
      setVulnerabilities([
        {
          id: '1',
          severity: 'critical',
          type: 'SQL Injection',
          description: 'Potential SQL injection vulnerability in user input handling',
          file: 'src/utils/database.ts',
          recommendation: 'Use parameterized queries and input validation',
        },
        {
          id: '2',
          severity: 'high',
          type: 'Hardcoded Secrets',
          description: 'API keys found in configuration file',
          file: '.env.example',
          recommendation: 'Move secrets to environment variables',
        },
        {
          id: '3',
          severity: 'medium',
          type: 'Weak Dependencies',
          description: 'Outdated package with known vulnerabilities',
          file: 'package.json',
          recommendation: 'Update dependencies to latest secure version',
        },
        {
          id: '4',
          severity: 'low',
          type: 'Missing Headers',
          description: 'Missing security headers in responses',
          file: 'src/middleware/security.ts',
          recommendation: 'Add security headers middleware',
        },
      ])
    }
  }, [selectedRepo])

  const criticalCount = vulnerabilities.filter((v) => v.severity === 'critical').length
  const highCount = vulnerabilities.filter((v) => v.severity === 'high').length
  const mediumCount = vulnerabilities.filter((v) => v.severity === 'medium').length
  const lowCount = vulnerabilities.filter((v) => v.severity === 'low').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Security Scanning</h1>
        <p className="text-muted-foreground">Identify vulnerabilities and security issues</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Repository List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Repositories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {repositories.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No repositories added yet
                </p>
              ) : (
                repositories.map((repo) => (
                  <button
                    key={repo._id}
                    onClick={() => setSelectedRepo(repo)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      selectedRepo?._id === repo._id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium truncate">{repo.name}</div>
                    <div className="text-xs opacity-75 truncate">{repo.owner}/{repo.name}</div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Results */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedRepo ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Select a repository to view security scan results</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid gap-3 sm:grid-cols-4">
                <StatCard label="Critical" count={criticalCount} color="text-red-500" />
                <StatCard label="High" count={highCount} color="text-orange-500" />
                <StatCard label="Medium" count={mediumCount} color="text-yellow-500" />
                <StatCard label="Low" count={lowCount} color="text-blue-500" />
              </div>

              {/* Vulnerabilities List */}
              <div className="space-y-3">
                {vulnerabilities.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
                      <p className="font-semibold">No vulnerabilities detected</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This repository appears to be secure
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  vulnerabilities.map((vuln) => (
                    <Card key={vuln.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex gap-4">
                          {/* Severity Icon */}
                          <div className="flex-shrink-0">
                            {vuln.severity === 'critical' && (
                              <AlertTriangle className="h-6 w-6 text-red-500" />
                            )}
                            {vuln.severity === 'high' && (
                              <AlertCircle className="h-6 w-6 text-orange-500" />
                            )}
                            {vuln.severity === 'medium' && (
                              <AlertCircle className="h-6 w-6 text-yellow-500" />
                            )}
                            {vuln.severity === 'low' && (
                              <Info className="h-6 w-6 text-blue-500" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold">{vuln.type}</h3>
                              <Badge
                                variant={
                                  vuln.severity === 'critical'
                                    ? 'destructive'
                                    : vuln.severity === 'high'
                                      ? 'secondary'
                                      : 'outline'
                                }
                              >
                                {vuln.severity}
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">{vuln.description}</p>

                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground uppercase">File</p>
                                <p className="font-mono text-xs bg-muted px-2 py-1 rounded w-fit">
                                  {vuln.file}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-muted-foreground uppercase">Recommendation</p>
                                <p className="text-foreground">{vuln.recommendation}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  count,
  color,
}: {
  label: string
  count: number
  color: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{count}</p>
      </CardContent>
    </Card>
  )
}
