'use client'

import { motion } from 'framer-motion'
import { Home, Map, Trophy, ShoppingCart, Package } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

interface BottomNavProps {
  onOpenCart: () => void
  onOpenMap: () => void
  onOpenLeaderboard: () => void
  onOpenOrders: () => void
}

export function BottomNav({ onOpenCart, onOpenMap, onOpenLeaderboard, onOpenOrders }: BottomNavProps) {
  const { totalItems, orders } = useCart()
  const [activeTab, setActiveTab] = useState('home')
  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: () => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
    { id: 'map', icon: Map, label: 'Map', onClick: () => { setActiveTab('map'); onOpenMap() } },
    { id: 'leaderboard', icon: Trophy, label: 'Ranks', onClick: () => { setActiveTab('leaderboard'); onOpenLeaderboard() } },
    { id: 'orders', icon: Package, label: 'Orders', onClick: () => { setActiveTab('orders'); onOpenOrders() }, badge: activeOrders },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', onClick: () => { setActiveTab('cart'); onOpenCart() }, badge: totalItems },
  ]

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom"
    >
      <div className="flex items-center justify-around px-0.5 py-1 pb-[max(env(safe-area-inset-bottom,4px),4px)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <motion.button
              key={item.id}
              onClick={item.onClick}
              whileTap={{ scale: 0.9 }}
              className={`relative flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all min-w-[48px] sm:min-w-[56px] ${
                isActive ? 'bg-primary/10' : 'hover:bg-secondary'
              }`}
            >
              <div className="relative">
                <Icon className={`w-[18px] h-[18px] sm:w-5 sm:h-5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {item.badge && item.badge > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1.5 sm:-top-1.5 sm:-right-2 min-w-[14px] sm:min-w-[18px] h-[14px] sm:h-[18px] px-0.5 sm:px-1 rounded-full bg-primary text-primary-foreground text-[8px] sm:text-[10px] flex items-center justify-center font-bold"
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </motion.span>
                )}
              </div>
              <span className={`text-[9px] sm:text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
  )
}
