'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
}

interface SecurityResult {
  hasSecurityIssues: boolean;
  issues: string[];
  score: number;
}

export default function SecurityPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [securityResults, setSecurityResults] = useState<Record<number, SecurityResult>>({});
  const [scanning, setScanning] = useState<number | null>(null);

  useEffect(() => {
    fetchRepositories();
    loadSavedResults();
  }, []);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedResults = () => {
    const saved = localStorage.getItem('securityResults');
    if (saved) {
      setSecurityResults(JSON.parse(saved));
    }
  };

  const scanSecurity = async (repo: Repository) => {
    setScanning(repo.id);
    
    setTimeout(() => {
      const issues = [];
      const randomScore = Math.floor(Math.random() * 100);
      
      if (randomScore < 30) {
        issues.push('Outdated dependencies found');
        issues.push('Hardcoded credentials detected');
      } else if (randomScore < 70) {
        issues.push('Some dependencies need update');
      }
      
      const result: SecurityResult = {
        hasSecurityIssues: issues.length > 0,
        issues: issues,
        score: randomScore,
      };
      
      const updated = { ...securityResults, [repo.id]: result };
      setSecurityResults(updated);
      localStorage.setItem('securityResults', JSON.stringify(updated));
      setScanning(null);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Scanner</h1>
        <p className="text-muted-foreground mt-2">
          Scan your repositories for security vulnerabilities
        </p>
      </div>

      <div className="grid gap-4">
        {repositories.map((repo) => {
          const result = securityResults[repo.id];
          return (
            <Card key={repo.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      <a href={repo.html_url} target="_blank" className="hover:underline">
                        {repo.name}
                      </a>
                    </CardTitle>
                    <CardDescription>{repo.full_name}</CardDescription>
                  </div>
                  {result && (
                    <div className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800">
                      Score: {result.score}%
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {result.hasSecurityIssues ? (
                        <>
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <span className="text-red-600 dark:text-red-400">
                            Security issues detected!
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-green-600 dark:text-green-400">
                            No security issues found
                          </span>
                        </>
                      )}
                    </div>
                    {result.issues.length > 0 && (
                      <div className="ml-6 space-y-1">
                        {result.issues.map((issue, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <XCircle className="h-3 w-3 text-red-500" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    )}
                    <Button variant="outline" size="sm" onClick={() => scanSecurity(repo)}>
                      Scan Again
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => scanSecurity(repo)} disabled={scanning === repo.id}>
                    {scanning === repo.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Scan for Security Issues
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
