'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, GitFork, Loader2, RefreshCw, Save, Trash2, CheckCircle, Bookmark } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

interface SavedRepository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  savedAt: string;
}

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [savedRepos, setSavedRepos] = useState<SavedRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'github' | 'saved'>('github');

  useEffect(() => {
    fetchRepositories();
    loadSavedRepos();
  }, []);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.github.com/user/repos?per_page=100', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error('Error fetching repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedRepos = () => {
    const saved = localStorage.getItem('savedRepositories');
    if (saved) {
      setSavedRepos(JSON.parse(saved));
    }
  };

  const saveRepository = (repo: Repository) => {
    setSaving(repo.id);
    
    const newSaved: SavedRepository = {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '',
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || 'Unknown',
      savedAt: new Date().toISOString(),
    };

    const existing = savedRepos.find(r => r.id === repo.id);
    if (!existing) {
      const updated = [...savedRepos, newSaved];
      setSavedRepos(updated);
      localStorage.setItem('savedRepositories', JSON.stringify(updated));
    }
    setSaving(null);
  };

  const removeSavedRepo = (id: number) => {
    const updated = savedRepos.filter(r => r.id !== id);
    setSavedRepos(updated);
    localStorage.setItem('savedRepositories', JSON.stringify(updated));
  };

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSavedRepos = savedRepos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Repositories</h1>
          <p className="text-muted-foreground mt-2">
            GitHub: {repositories.length} repos | Saved: {savedRepos.length} repos
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setActiveTab('github')} 
            variant={activeTab === 'github' ? 'default' : 'outline'}
          >
            GitHub Repos
          </Button>
          <Button 
            onClick={() => setActiveTab('saved')} 
            variant={activeTab === 'saved' ? 'default' : 'outline'}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Saved Repos ({savedRepos.length})
          </Button>
          <Button onClick={fetchRepositories} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Input
        placeholder="Search repositories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {activeTab === 'github' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepos.map((repo) => {
            const isSaved = savedRepos.some(r => r.id === repo.id);
            return (
              <Card key={repo.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {repo.name}
                    </a>
                  </CardTitle>
                  <CardDescription>
                    {repo.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        {repo.forks_count}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={isSaved ? "secondary" : "default"}
                      onClick={() => saveRepository(repo)}
                      disabled={isSaved || saving === repo.id}
                    >
                      {saving === repo.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isSaved ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSavedRepos.map((repo) => (
            <Card key={repo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {repo.name}
                  </a>
                </CardTitle>
                <CardDescription>
                  {repo.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      {repo.forks}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeSavedRepo(repo.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Saved: {new Date(repo.savedAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'github' && filteredRepos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No repositories found
        </div>
      )}

      {activeTab === 'saved' && filteredSavedRepos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No saved repositories. Go to GitHub Repos tab and save some!
        </div>
      )}
    </div>
  );
}
