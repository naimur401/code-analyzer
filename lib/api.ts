const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api"

const headers = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
})

export const repositoriesApi = {
  getGitHubRepositories: async (token: string) => {
    const res = await fetch(`${BASE_URL}/repositories/github`, { headers: headers(token) })
    return res.json()
  },
  getSavedRepositories: async (token: string, page = 1, limit = 100) => {
    const res = await fetch(`${BASE_URL}/repositories?page=${page}&limit=${limit}`, { headers: headers(token) })
    return res.json()
  },
  addRepository: async (token: string, data: object) => {
    const res = await fetch(`${BASE_URL}/repositories`, {
      method: "POST",
      headers: headers(token),
      body: JSON.stringify(data),
    })
    return res.json()
  },
  deleteRepository: async (token: string, id: string) => {
    const res = await fetch(`${BASE_URL}/repositories/${id}`, {
      method: "DELETE",
      headers: headers(token),
    })
    return res.json()
  },
}

export const analysisApi = {
  getAnalysis: async (token: string, repositoryId: string) => {
    const res = await fetch(`${BASE_URL}/analysis/${repositoryId}`, { headers: headers(token) })
    return res.json()
  },
  startAnalysis: async (token: string, repositoryId: string) => {
    const res = await fetch(`${BASE_URL}/analysis/${repositoryId}/start`, {
      method: "POST",
      headers: headers(token),
    })
    return res.json()
  },
  getJobStatus: async (token: string, jobId: string) => {
    const res = await fetch(`${BASE_URL}/analysis/job/${jobId}`, { headers: headers(token) })
    return res.json()
  },
  getAllAnalyses: async (token: string) => {
    const res = await fetch(`${BASE_URL}/analysis`, { headers: headers(token) })
    return res.json()
  },
}

export const authApi = {
  githubCallback: async (code: string) => {
    const res = await fetch(`${BASE_URL}/auth/github/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
    return res.json()
  },
  getMe: async (token: string) => {
    const res = await fetch(`${BASE_URL}/auth/me`, { headers: headers(token) })
    return res.json()
  },
  logout: async (token: string) => {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: headers(token),
    })
    return res.json()
  },
}
