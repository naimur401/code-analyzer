'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import { repositoriesApi } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Star, GitFork, Code } from 'lucide-react'

export default function RepositoryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuthStore()
  const [repo, setRepo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) router.push('/login')
    else {
      repositoriesApi.getGitHubRepositories(token).then(res => {
        if (res.success) {
          const found = (res.data as any).repositories.find((r: any) => r.name === params.repository)
          setRepo(found)
        }
        setLoading(false)
      })
    }
  }, [])

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!repo) return <div className="p-8 text-center">Repository not found</div>

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
      <h1 className="text-3xl font-bold">{repo.name}</h1>
      <p className="text-muted-foreground">{repo.owner}/{repo.name}</p>
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><Star className="inline mr-2" />{repo.stars}</CardContent></Card>
        <Card><CardContent className="pt-6"><GitFork className="inline mr-2" />{repo.forks}</CardContent></Card>
        <Card><CardContent className="pt-6"><Code className="inline mr-2" />{repo.language || 'N/A'}</CardContent></Card>
      </div>
      {repo.description && <Card><CardContent className="pt-6">{repo.description}</CardContent></Card>}
    </div>
  )
}