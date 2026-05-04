'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Clock, TrendingUp, Flame } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Review, TrendingItem } from '@/lib/types'
import { recentReviews, trendingItems } from '@/lib/data'
import { formatDistanceToNow } from 'date-fns'

export function LiveFeed() {
  const [reviews, setReviews] = useState<Review[]>(recentReviews)
  const [activeTab, setActiveTab] = useState<'live' | 'trending'>('live')
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setReviews(prev => {
        const updated = [...prev]
        // Randomly update a review timestamp to simulate live activity
        const idx = Math.floor(Math.random() * updated.length)
        updated[idx] = { ...updated[idx], timestamp: new Date() }
        return updated
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'live' 
              ? 'text-accent border-b-2 border-accent bg-accent/5' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Live Feed
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'trending' 
              ? 'text-primary border-b-2 border-primary bg-primary/5' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Trending
        </button>
      </div>

      <div className="p-3 sm:p-4 max-h-[350px] sm:max-h-[450px] lg:max-h-[500px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'live' ? (
            <motion.div
              key="live"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {reviews.map((review, index) => (
                <LiveReviewCard key={review.id} review={review} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="trending"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {trendingItems.map((item, index) => (
                <TrendingCard key={item.item.id} trending={item} rank={index + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Separate component to handle client-side time formatting
function TimeAgo({ timestamp }: { timestamp: Date }) {
  const [timeAgo, setTimeAgo] = useState<string>('')

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(timestamp, { addSuffix: true }))
    
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(timestamp, { addSuffix: true }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [timestamp])

  if (!timeAgo) return <span>just now</span>
  return <span>{timeAgo}</span>
}

function LiveReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors"
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-9 h-9 border-2 border-primary/20">
          <AvatarImage src={review.userAvatar} />
          <AvatarFallback>{review.userName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm truncate">{review.userName}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <TimeAgo timestamp={review.timestamp} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">{review.itemName}</span>
            <span className="text-xs text-muted-foreground/50">at</span>
            <span className="text-xs text-primary">{review.stallName}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < review.rating ? 'fill-primary text-primary' : 'text-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{review.comment}</p>
          {review.sentiment && (
            <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
              review.sentiment === 'positive' 
                ? 'bg-accent/20 text-accent' 
                : review.sentiment === 'negative'
                ? 'bg-destructive/20 text-destructive'
                : 'bg-muted text-muted-foreground'
            }`}>
              {review.sentiment}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function TrendingCard({ trending, rank }: { trending: TrendingItem; rank: number }) {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)]/30'
      case 2: return 'bg-[var(--silver)]/20 text-[var(--silver)] border-[var(--silver)]/30'
      case 3: return 'bg-[var(--bronze)]/20 text-[var(--bronze)] border-[var(--bronze)]/30'
      default: return 'bg-secondary text-muted-foreground border-border'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: rank * 0.1 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-all cursor-pointer group"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border ${getRankStyle(rank)}`}>
        #{rank}
      </div>
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
        <img 
          src={trending.item.image} 
          alt={trending.item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{trending.item.name}</h4>
        <p className="text-xs text-muted-foreground">{trending.item.stallName}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-xs font-medium">{trending.item.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">Rs.{trending.item.price}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        {trending.sentiment === 'hot' ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary animate-pulse-live">
            <Flame className="w-3 h-3" />
            <span className="text-xs font-medium">HOT</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-medium">Rising</span>
          </div>
        )}
        <span className="text-xs text-muted-foreground">{trending.recentRatings} ratings/hr</span>
      </div>
    </motion.div>
  )
}
