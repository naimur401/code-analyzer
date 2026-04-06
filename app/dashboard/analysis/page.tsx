'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { repositoriesApi, analysisApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, AlertCircle, CheckCircle2, Zap, Loader2 } from 'lucide-react'

interface Repository {
  _id: string
  name: string
  fullName: string
  owner: string
}

interface Analysis {
  _id: string
  status: 'pending' | 'analyzing' | 'completed' | 'failed'
  analysis: {
    overallScore: number
    complexity: {
      average: number
      high: number
      critical: number
    }
    maintainability: number
    testCoverage: number
    documentation: {
      score: number
      missingDocs: number
    }
  }
  insights: string[]
  recommendations: string[]
  analyzedAt: string
}

export default function AnalysisPage() {
  const { token } = useAuthStore()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

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

  // Load analysis for selected repository
  useEffect(() => {
    if (!token || !selectedRepo) {
      setAnalysis(null)
      return
    }

    const loadAnalysis = async () => {
      setIsLoading(true)
      try {
        const response = await analysisApi.getAnalysis(token, selectedRepo._id)
        if (response.success && response.data) {
          setAnalysis((response.data as any).analysis || null)
        }
      } catch (error) {
        console.error('Error loading analysis:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalysis()
  }, [token, selectedRepo])

  const handleStartAnalysis = async () => {
    if (!token || !selectedRepo) return

    setIsAnalyzing(true)
    try {
      const response = await analysisApi.startAnalysis(token, selectedRepo._id)
      if (response.success && response.data) {
        const jobId = (response.data as any).analysis.jobId
        setAnalysis({
          _id: selectedRepo._id,
          status: 'pending',
          analysis: {
            overallScore: 0,
            complexity: { average: 0, high: 0, critical: 0 },
            maintainability: 0,
            testCoverage: 0,
            documentation: { score: 0, missingDocs: 0 },
          },
          insights: [],
          recommendations: [],
          analyzedAt: new Date().toISOString(),
        })

        // Poll for job status
        const pollInterval = setInterval(async () => {
          const statusResponse = await analysisApi.getJobStatus(token, jobId)
          if (statusResponse.success) {
            const job = (statusResponse.data as any).job
            if (job.state === 'completed' || job.state === 'failed') {
              clearInterval(pollInterval)
              // Reload analysis
              const analysisResponse = await analysisApi.getAnalysis(token, selectedRepo._id)
              if (analysisResponse.success && analysisResponse.data) {
                setAnalysis((analysisResponse.data as any).analysis || null)
              }
              setIsAnalyzing(false)
            } else if (analysis) {
              setAnalysis({ ...analysis, status: job.state })
            }
          }
        }, 2000)
      }
    } catch (error) {
      console.error('Error starting analysis:', error)
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Code Analysis</h1>
        <p className="text-muted-foreground">Analyze repository code quality and metrics</p>
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

        {/* Analysis Results */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedRepo ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Select a repository to view analysis</p>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                Loading analysis...
              </CardContent>
            </Card>
          ) : analysis ? (
            <>
              {/* Metrics Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard
                  title="Overall Score"
                  value={`${analysis.analysis.overallScore}%`}
                  icon={TrendingUp}
                  status={analysis.analysis.overallScore >= 70 ? 'good' : 'warning'}
                />
                <MetricCard
                  title="Maintainability"
                  value={`${analysis.analysis.maintainability}%`}
                  icon={CheckCircle2}
                  status={analysis.analysis.maintainability >= 70 ? 'good' : 'warning'}
                />
                <MetricCard
                  title="Test Coverage"
                  value={`${analysis.analysis.testCoverage}%`}
                  icon={Zap}
                  status={analysis.analysis.testCoverage >= 80 ? 'good' : 'warning'}
                />
                <MetricCard
                  title="Documentation"
                  value={`${analysis.analysis.documentation.score}%`}
                  icon={AlertCircle}
                  status={analysis.analysis.documentation.score >= 70 ? 'good' : 'warning'}
                />
              </div>

              {/* Complexity Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Code Complexity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Average Complexity</span>
                      <span className="font-semibold">{analysis.analysis.complexity.average.toFixed(1)}</span>
                    </div>
                    <Progress value={Math.min(100, (analysis.analysis.complexity.average / 10) * 100)} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">High Complexity Files</p>
                      <p className="text-lg font-semibold">{analysis.analysis.complexity.high}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Critical Issues</p>
                      <p className="text-lg font-semibold">{analysis.analysis.complexity.critical}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              {analysis.insights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.insights.map((insight, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2 list-decimal list-inside">
                      {analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm">{rec}</li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">No analysis available for this repository</p>
                  <Button onClick={handleStartAnalysis} disabled={isAnalyzing}>
                    {isAnalyzing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Start Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  status,
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  status: 'good' | 'warning'
}) {
  return (
    <Card className={status === 'good' ? '' : 'border-amber-500/50'}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <Icon className={`h-5 w-5 ${status === 'good' ? 'text-green-500' : 'text-amber-500'}`} />
        </div>
      </CardContent>
    </Card>
  )
}
