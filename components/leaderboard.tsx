'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Medal, Crown, Star, TrendingUp, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { leaderboardUsers } from '@/lib/data'
import { useUser } from '@/lib/user-context'

interface LeaderboardProps {
  isOpen: boolean
  onClose: () => void
}

type TimeFilter = 'weekly' | 'monthly' | 'allTime'

const BADGE_COLORS = {
  Champion: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
  Legend: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  Critic: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  Foodie: 'bg-green-500/20 text-green-600 border-green-500/30'
}

const RANK_ICONS = {
  1: <Crown className="w-5 h-5 text-yellow-500" />,
  2: <Medal className="w-5 h-5 text-gray-400" />,
  3: <Medal className="w-5 h-5 text-amber-600" />
}

export function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('allTime')
  const { user, isProfileSetup } = useUser()

  const getSortedUsers = () => {
    return [...leaderboardUsers].sort((a, b) => {
      if (timeFilter === 'weekly') return b.weeklyPoints - a.weeklyPoints
      if (timeFilter === 'monthly') return b.monthlyPoints - a.monthlyPoints
      return b.points - a.points
    }).map((user, index) => ({ ...user, rank: index + 1 }))
  }

  const sortedUsers = getSortedUsers()

  const getPoints = (user: typeof leaderboardUsers[0]) => {
    if (timeFilter === 'weekly') return user.weeklyPoints
    if (timeFilter === 'monthly') return user.monthlyPoints
    return user.points
  }

  // Find current user's rank (mock)
  const userRank = isProfileSetup ? Math.floor(Math.random() * 50) + 15 : null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bottom-16 md:bottom-0 z-50 bg-background/95 backdrop-blur-sm overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold">Leaderboard</h2>
                <p className="text-sm text-muted-foreground">Top Food Critics</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-2 p-4 border-b border-border shrink-0 overflow-x-auto scrollbar-hide">
            {[
              { id: 'weekly', label: 'Week', fullLabel: 'This Week', icon: <Calendar className="w-3.5 h-3.5" /> },
              { id: 'monthly', label: 'Month', fullLabel: 'This Month', icon: <TrendingUp className="w-3.5 h-3.5" /> },
              { id: 'allTime', label: 'All Time', fullLabel: 'All Time', icon: <Trophy className="w-3.5 h-3.5" /> }
            ].map(filter => (
              <Button
                key={filter.id}
                variant={timeFilter === filter.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeFilter(filter.id as TimeFilter)}
                className="gap-1.5 shrink-0"
              >
                {filter.icon}
                <span className="hidden sm:inline">{filter.fullLabel}</span>
                <span className="sm:hidden">{filter.label}</span>
              </Button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <div className="flex items-end justify-center gap-4 py-6 px-4 shrink-0">
            {/* Second Place */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <img 
                  src={sortedUsers[1]?.avatar} 
                  alt={sortedUsers[1]?.name}
                  className="w-16 h-16 rounded-full border-4 border-gray-400"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <p className="text-sm font-medium mt-3 text-center">{sortedUsers[1]?.name.split(' ')[0]}</p>
              <p className="text-xs text-muted-foreground">{getPoints(sortedUsers[1])} pts</p>
            </motion.div>

            {/* First Place */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center -mt-4"
            >
              <Crown className="w-8 h-8 text-yellow-500 mb-1" />
              <div className="relative">
                <img 
                  src={sortedUsers[0]?.avatar} 
                  alt={sortedUsers[0]?.name}
                  className="w-20 h-20 rounded-full border-4 border-yellow-500"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <p className="text-sm font-semibold mt-3 text-center">{sortedUsers[0]?.name.split(' ')[0]}</p>
              <p className="text-xs text-primary font-medium">{getPoints(sortedUsers[0])} pts</p>
            </motion.div>

            {/* Third Place */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <img 
                  src={sortedUsers[2]?.avatar} 
                  alt={sortedUsers[2]?.name}
                  className="w-16 h-16 rounded-full border-4 border-amber-600"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <p className="text-sm font-medium mt-3 text-center">{sortedUsers[2]?.name.split(' ')[0]}</p>
              <p className="text-xs text-muted-foreground">{getPoints(sortedUsers[2])} pts</p>
            </motion.div>
          </div>

          {/* Rankings List */}
          <div className="flex-1 overflow-y-auto px-4 pb-24">
            <div className="space-y-2">
              {sortedUsers.slice(3).map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                    {user.rank}
                  </div>

                  <img 
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{user.name}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] ${BADGE_COLORS[user.badge]}`}
                      >
                        {user.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user.totalReviews} reviews
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">{getPoints(user)}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User's Rank Card */}
          {isProfileSetup && userRank && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8"
            >
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                  #{userRank}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Your Rank</p>
                  <p className="text-xs text-muted-foreground">Keep reviewing to climb up!</p>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <Star className="w-4 h-4 fill-primary" />
                  <span className="font-bold">150 pts</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
