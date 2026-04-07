import { create } from "zustand"

interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  loadFromStorage: () => {
    if (typeof window === "undefined") return
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        set({ token, user, isAuthenticated: true })
      } catch {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
  },
  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
    }
    set({ user, token, isAuthenticated: true })
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
