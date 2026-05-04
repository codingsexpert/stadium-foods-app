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
      className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-3"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-card rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 md:gap-3"
        >
          <div className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-secondary flex items-center justify-center shrink-0 ${stat.color}`}>
            <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-sm sm:text-base md:text-lg font-bold truncate">{stat.value}</p>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground truncate">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
