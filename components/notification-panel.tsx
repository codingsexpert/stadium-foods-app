'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, BellOff, Tag, Package, Star, Info, CheckCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from '@/lib/notification-context'
import { AppNotification } from '@/lib/types'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

const TYPE_CONFIG = {
  deal: {
    icon: <Tag className="w-4 h-4" />,
    color: 'bg-green-500/20 text-green-600',
    bgColor: 'bg-green-500/10'
  },
  order: {
    icon: <Package className="w-4 h-4" />,
    color: 'bg-blue-500/20 text-blue-600',
    bgColor: 'bg-blue-500/10'
  },
  review: {
    icon: <Star className="w-4 h-4" />,
    color: 'bg-yellow-500/20 text-yellow-600',
    bgColor: 'bg-yellow-500/10'
  },
  info: {
    icon: <Info className="w-4 h-4" />,
    color: 'bg-purple-500/20 text-purple-600',
    bgColor: 'bg-purple-500/10'
  }
}

function NotificationCard({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: AppNotification
  onMarkAsRead: (id: string) => void 
}) {
  const config = TYPE_CONFIG[notification.type]
  const timeAgo = getTimeAgo(new Date(notification.timestamp))

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-colors ${
        notification.read 
          ? 'bg-secondary/20 border-border' 
          : `${config.bgColor} border-transparent`
      }`}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="flex gap-2.5 sm:gap-3">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
          {React.cloneElement(config.icon as React.ReactElement, { className: 'w-3.5 h-3.5 sm:w-4 sm:h-4' })}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 sm:gap-2">
            <p className={`font-medium text-sm sm:text-base ${notification.read ? 'text-muted-foreground' : ''}`}>
              {notification.title}
            </p>
            {!notification.read && (
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary shrink-0 mt-1.5 sm:mt-2" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{notification.message}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">{timeAgo}</p>
        </div>
      </div>
    </motion.div>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    requestPermission,
    hasPermission
  } = useNotifications()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md z-50 bg-background flex flex-col pb-16 md:pb-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">Notifications</h2>
                  {unreadCount > 0 && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{unreadCount} unread</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8 px-2 sm:px-3">
                    <CheckCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">Mark all</span>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 sm:w-9 sm:h-9">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Permission Banner */}
            {!hasPermission && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="m-4 p-4 rounded-xl bg-primary/10 border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  <BellOff className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Enable Push Notifications</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get instant updates about deals, order status, and more!
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-3"
                      onClick={requestPermission}
                    >
                      Enable Notifications
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-1">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re all caught up!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {notifications.map(notification => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full text-destructive"
                  onClick={clearNotifications}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Notifications
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
