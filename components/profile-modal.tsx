'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@/lib/user-context'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, isProfileSetup, setupProfile, updateProfile } = useUser()
  const [name, setName] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.displayName)
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (isProfileSetup) {
      updateProfile({ displayName: name.trim() })
      setIsEditing(false)
    } else {
      setupProfile(name.trim())
      onClose()
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-3 bottom-20 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:w-full bg-card rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col md:max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold">
                {isProfileSetup ? 'Your Profile' : 'Set Up Profile'}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {!isProfileSetup ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center py-4">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      Create your profile to save favorites and track your ratings
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={!name.trim()}>
                    Create Profile
                  </Button>
                </form>
              ) : user && (
                <>
                  {/* Profile Card */}
                  <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                    <div className={`w-16 h-16 rounded-full ${user.avatarColor} flex items-center justify-center`}>
                      <span className="text-2xl font-bold text-white">{user.initials}</span>
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <form onSubmit={handleSubmit} className="flex gap-2">
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-8"
                            autoFocus
                          />
                          <Button type="submit" size="sm">Save</Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </form>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold">{user.displayName}</h3>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs text-muted-foreground"
                            onClick={() => setIsEditing(true)}
                          >
                            Edit name
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-xl text-center">
                      <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                      <div className="text-2xl font-bold">{user.ratingHistory.length}</div>
                      <div className="text-xs text-muted-foreground">Ratings</div>
                    </div>
                    <div className="p-4 bg-secondary rounded-xl text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <span className="text-2xl">❤️</span>
                      </motion.div>
                      <div className="text-2xl font-bold mt-1">{user.favorites.length}</div>
                      <div className="text-xs text-muted-foreground">Favorites</div>
                    </div>
                  </div>

                  {/* Rating History */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent Ratings
                    </h3>
                    {user.ratingHistory.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No ratings yet</p>
                        <p className="text-xs">Start rating your favorite stadium food!</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {user.ratingHistory.slice(0, 10).map((rating, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{rating.itemName}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {rating.stallName}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < rating.rating
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(rating.timestamp)}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
