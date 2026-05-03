'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

export interface UserProfile {
  id: string
  displayName: string
  avatarColor: string
  initials: string
  favorites: string[] // food item IDs
  ratingHistory: RatingRecord[]
  createdAt: Date
}

export interface RatingRecord {
  itemId: string
  itemName: string
  stallName: string
  rating: number
  comment: string
  timestamp: Date
}

interface UserContextType {
  user: UserProfile | null
  isProfileSetup: boolean
  updateProfile: (profile: Partial<UserProfile>) => void
  toggleFavorite: (itemId: string) => void
  isFavorite: (itemId: string) => boolean
  addRating: (rating: Omit<RatingRecord, 'timestamp'>) => void
  logout: () => void
  setupProfile: (name: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const AVATAR_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getRandomColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isProfileSetup, setIsProfileSetup] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('stadiumBiteUser')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          ratingHistory: parsed.ratingHistory.map((r: RatingRecord & { timestamp: string }) => ({
            ...r,
            timestamp: new Date(r.timestamp)
          }))
        })
        setIsProfileSetup(true)
      } catch {
        localStorage.removeItem('stadiumBiteUser')
      }
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('stadiumBiteUser', JSON.stringify(user))
    }
  }, [user])

  const setupProfile = useCallback((name: string) => {
    const newUser: UserProfile = {
      id: generateUserId(),
      displayName: name,
      avatarColor: getRandomColor(),
      initials: getInitials(name),
      favorites: [],
      ratingHistory: [],
      createdAt: new Date()
    }
    setUser(newUser)
    setIsProfileSetup(true)
  }, [])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      if (updates.displayName) {
        updated.initials = getInitials(updates.displayName)
      }
      return updated
    })
  }, [])

  const toggleFavorite = useCallback((itemId: string) => {
    setUser(prev => {
      if (!prev) return prev
      const favorites = prev.favorites.includes(itemId)
        ? prev.favorites.filter(id => id !== itemId)
        : [...prev.favorites, itemId]
      return { ...prev, favorites }
    })
  }, [])

  const isFavorite = useCallback((itemId: string) => {
    return user?.favorites.includes(itemId) ?? false
  }, [user?.favorites])

  const addRating = useCallback((rating: Omit<RatingRecord, 'timestamp'>) => {
    setUser(prev => {
      if (!prev) return prev
      return {
        ...prev,
        ratingHistory: [
          { ...rating, timestamp: new Date() },
          ...prev.ratingHistory
        ]
      }
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('stadiumBiteUser')
    setUser(null)
    setIsProfileSetup(false)
  }, [])

  return (
    <UserContext.Provider value={{
      user,
      isProfileSetup,
      updateProfile,
      toggleFavorite,
      isFavorite,
      addRating,
      logout,
      setupProfile
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
