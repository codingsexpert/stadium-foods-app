'use client'

import { motion } from 'framer-motion'
import { Home, Map, Trophy, ShoppingCart, Package } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

interface BottomNavProps {
  onOpenCart: () => void
  onOpenMap: () => void
  onOpenLeaderboard: () => void
  onOpenOrders: () => void
}

export function BottomNav({ onOpenCart, onOpenMap, onOpenLeaderboard, onOpenOrders }: BottomNavProps) {
  const { totalItems, orders } = useCart()
  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length

  const navItems = [
    { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'map', icon: <Map className="w-5 h-5" />, label: 'Map', onClick: onOpenMap },
    { id: 'leaderboard', icon: <Trophy className="w-5 h-5" />, label: 'Ranks', onClick: onOpenLeaderboard },
    { id: 'orders', icon: <Package className="w-5 h-5" />, label: 'Orders', onClick: onOpenOrders, badge: activeOrders },
    { id: 'cart', icon: <ShoppingCart className="w-5 h-5" />, label: 'Cart', onClick: onOpenCart, badge: totalItems },
  ]

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-background/95 backdrop-blur-sm border-t border-border"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={item.onClick}
            whileTap={{ scale: 0.9 }}
            className="relative flex flex-col items-center gap-1 p-2 rounded-xl transition-colors hover:bg-secondary"
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  )
}
