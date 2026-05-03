'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { AppNotification } from './types'

interface NotificationContextType {
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  requestPermission: () => Promise<boolean>
  hasPermission: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const initialNotifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'deal',
    title: 'Flash Deal!',
    message: '20% off on all drinks at Fresh Sips for the next 30 mins!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false
  },
  {
    id: 'n2',
    type: 'info',
    title: 'New Stall Open',
    message: 'Green Bowl is now serving fresh salads near Gate C!',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false
  },
  {
    id: 'n3',
    type: 'review',
    title: 'Your Review is Live!',
    message: 'Thanks for reviewing Loaded Vada Pav. You earned 50 points!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: true
  }
]

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications)
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted')
    }

    // Load saved notifications
    const saved = localStorage.getItem('stadium-notifications')
    if (saved) {
      setNotifications(JSON.parse(saved, (key, value) => {
        if (key === 'timestamp') return new Date(value)
        return value
      }))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('stadium-notifications', JSON.stringify(notifications))
  }, [notifications])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false
    }

    const permission = await Notification.requestPermission()
    const granted = permission === 'granted'
    setHasPermission(granted)
    
    if (granted) {
      // Send a test notification
      new Notification('Stadium Bites', {
        body: 'Notifications enabled! You will now receive updates about deals and orders.',
        icon: '/favicon.ico'
      })
    }
    
    return granted
  }, [])

  const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: `n-${Date.now()}`,
      timestamp: new Date(),
      read: false
    }

    setNotifications(prev => [newNotification, ...prev])

    // Send browser notification if permitted
    if (hasPermission && 'Notification' in window) {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      })
    }
  }, [hasPermission])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      requestPermission,
      hasPermission
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
