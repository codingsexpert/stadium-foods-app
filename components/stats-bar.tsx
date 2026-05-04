'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Star, Utensils } from 'lucide-react'

const stats = [
  { icon: TrendingUp, label: 'Trending', value: '4 items', color: 'text-primary' },
  { icon: Users, label: 'Active Users', value: '2,341', color: 'text-accent' },
  { icon: Star, label: 'Avg Rating', value: '4.5', color: 'text-chart-4' },
  { icon: Utensils, label: 'Stalls Open', value: '12/15', color: 'text-chart-2' },
]

export function StatsBar() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-card rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
        >
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 ${stat.color}`}>
            <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-bold truncate">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
