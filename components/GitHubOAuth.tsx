'use client'

import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export function GitHubOAuthButton() {
  const handleLogin = () => {
    window.location.href = '/api/auth/github'
  }

  return (
    <Button size='lg' onClick={handleLogin} className='gap-2'>
      <Github className='h-5 w-5' />
      Sign in with GitHub
    </Button>
  )
}
