'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, GitBranch, Shield, Code2, AlertTriangle, CheckCircle } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

export default function AnalysisPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState<number | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<number, any>>({});

  useEffect(() => {
    fetchRepositories();
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
      
      // Load saved analysis from localStorage
      const saved = localStorage.getItem('analysisResults');
      if (saved) {
        setAnalysisResults(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeRepository = async (repo: Repository) => {
    setAnalyzing(repo.id);
    
    // Simulate analysis
    setTimeout(() => {
      const result = {
        score: Math.floor(Math.random() * 100),
        issues: Math.floor(Math.random() * 20),
        security: Math.floor(Math.random() * 100),
        complexity: Math.floor(Math.random() * 100),
        lastAnalyzed: new Date().toISOString(),
      };
      
      const updated = { ...analysisResults, [repo.id]: result };
      setAnalysisResults(updated);
      localStorage.setItem('analysisResults', JSON.stringify(updated));
      setAnalyzing(null);
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
        <h1 className="text-3xl font-bold">Code Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Analyze your repositories for code quality and security issues
        </p>
      </div>

      <div className="grid gap-4">
        {repositories.map((repo) => {
          const analysis = analysisResults[repo.id];
          return (
            <Card key={repo.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      <a href={repo.html_url} target="_blank" className="hover:underline">
                        {repo.name}
                      </a>
                    </CardTitle>
                    <CardDescription>{repo.description || 'No description'}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-sm">
                      <GitBranch className="h-4 w-4" />
                      {repo.forks_count}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      ⭐ {repo.stargazers_count}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{analysis.score}%</div>
                        <div className="text-sm text-muted-foreground">Quality Score</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{analysis.security}%</div>
                        <div className="text-sm text-muted-foreground">Security</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{analysis.complexity}%</div>
                        <div className="text-sm text-muted-foreground">Complexity</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {analysis.issues > 10 ? (
                          <span className="flex items-center gap-1 text-red-500">
                            <AlertTriangle className="h-4 w-4" />
                            {analysis.issues} issues found
                          </span>
                        ) : analysis.issues > 0 ? (
                          <span className="flex items-center gap-1 text-yellow-500">
                            <AlertTriangle className="h-4 w-4" />
                            {analysis.issues} issues found
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="h-4 w-4" />
                            No issues found
                          </span>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => analyzeRepository(repo)}>
                        Re-analyze
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button onClick={() => analyzeRepository(repo)} disabled={analyzing === repo.id}>
                      {analyzing === repo.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Code2 className="h-4 w-4 mr-2" />
                          Analyze Code
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
