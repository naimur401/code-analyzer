import { Suspense } from 'react'
import { GitHubOAuthCallback } from '@/components/GitHubOAuth'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authenticating...',
  robots: { index: false, follow: false },
}

export default function CallbackPage() {
  return <Suspense fallback={<div>Loading...</div>}><GitHubOAuthCallback /></Suspense>
}
