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
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ scale: 1.02 }}
          className="glass-card rounded-xl p-4 flex items-center gap-3"
        >
          <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
