'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { repositoriesApi } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GitBranch, Star, GitFork, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface GitHubRepo {
  name: string
  fullName: string
  owner: string
  url: string
  description: string
  language: string
  stars: number
  forks: number
}

interface SavedRepo {
  _id: string
  name: string
  fullName: string
  owner: string
  language: string
  stars: number
  forks: number
  description: string
}

export default function RepositoriesPage() {
  const { token } = useAuthStore()
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [savedRepos, setSavedRepos] = useState<SavedRepo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false)
  const [isLoadingSaved, setIsLoadingSaved] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'github' | 'saved'>('github')

  const loadGitHubRepos = async () => {
    if (!token) return
    setIsLoadingGitHub(true)
    try {
      const response = await repositoriesApi.getGitHubRepositories(token)
      if (response.success && response.data) {
        setGithubRepos((response.data as any).repositories || [])
      }
    } catch (error) {
      console.error('Error loading GitHub repos:', error)
    } finally {
      setIsLoadingGitHub(false)
    }
  }

  const loadSavedRepos = async () => {
    if (!token) return
    setIsLoadingSaved(true)
    try {
      const response = await repositoriesApi.getSavedRepositories(token, 1, 100)
      if (response.success && response.data) {
        setSavedRepos(Array.isArray(response.data) ? response.data : (response.data as any).data || [])
      }
    } catch (error) {
      console.error('Error loading saved repos:', error)
    } finally {
      setIsLoadingSaved(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadGitHubRepos()
      loadSavedRepos()
    }
  }, [token])

  const handleAddRepository = async (repo: GitHubRepo) => {
    if (!token) return
    setIsLoading(true)
    try {
      await repositoriesApi.addRepository(token, {
        name: repo.name,
        fullName: repo.fullName,
        owner: repo.owner,
        url: repo.url,
        description: repo.description,
        language: repo.language,
        stars: repo.stars,
        forks: repo.forks,
      })
      loadSavedRepos()
    } catch (error) {
      console.error('Error adding repository:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRepos = githubRepos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const githubTabClass = activeTab === 'github'
    ? 'px-4 py-2 font-medium text-sm text-primary border-b-2 border-primary'
    : 'px-4 py-2 font-medium text-sm text-muted-foreground hover:text-foreground'

  const savedTabClass = activeTab === 'saved'
    ? 'px-4 py-2 font-medium text-sm text-primary border-b-2 border-primary'
    : 'px-4 py-2 font-medium text-sm text-muted-foreground hover:text-foreground'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Repositories</h1>
        <p className="text-muted-foreground">Manage and analyze your GitHub repositories</p>
      </div>

      <div className="flex gap-4 border-b border-border">
        <button onClick={() => setActiveTab('github')} className={githubTabClass}>
          GitHub Repositories
        </button>
        <button onClick={() => setActiveTab('saved')} className={savedTabClass}>
          Saved Repositories ({savedRepos.length})
        </button>
      </div>

      {activeTab === 'github' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={loadGitHubRepos} disabled={isLoadingGitHub}>
              {isLoadingGitHub && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Refresh
            </Button>
          </div>

          {isLoadingGitHub ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
              Loading repositories...
            </div>
          ) : filteredRepos.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No repositories found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredRepos.map((repo) => (
                <Link href={'/dashboard/' + repo.name} key={repo.fullName} className="block">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <GitBranch className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <h3 className="font-semibold truncate">{repo.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{repo.owner}/{repo.name}</p>
                          {repo.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{repo.description}</p>
                          )}
                          <div className="flex gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                            {repo.language && <span className="bg-muted rounded px-2 py-1">{repo.language}</span>}
                            <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stars}</span>
                            <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.forks}</span>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => { e.preventDefault(); handleAddRepository(repo) }}
                          disabled={isLoading}
                          size="sm"
                          className="flex-shrink-0"
                        >
                          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="space-y-4">
          {isLoadingSaved ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
              Loading saved repositories...
            </div>
          ) : savedRepos.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No saved repositories yet. Add some from GitHub Repositories tab.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {savedRepos.map((repo) => (
                <Card key={repo._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{repo.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{repo.owner}/{repo.name}</p>
                    {repo.description && <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>}
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      {repo.language && <span className="bg-muted rounded px-2 py-1">{repo.language}</span>}
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stars}</span>
                      <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.forks}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
