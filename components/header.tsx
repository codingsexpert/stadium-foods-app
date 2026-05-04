'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Utensils, Trophy, Zap, Menu, X, ShoppingCart, Bell, Map, Package } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { UserAvatar } from './user-avatar'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { useNotifications } from '@/lib/notification-context'

interface HeaderProps {
  onOpenProfile: () => void
  onOpenFavorites: () => void
  onOpenCart: () => void
  onOpenNotifications: () => void
  onOpenMap: () => void
  onOpenLeaderboard: () => void
  onOpenOrders: () => void
}

export function Header({ 
  onOpenProfile, 
  onOpenFavorites, 
  onOpenCart, 
  onOpenNotifications,
  onOpenMap,
  onOpenLeaderboard,
  onOpenOrders
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { unreadCount } = useNotifications()

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass-card"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </motion.div>
            <div>
              <h1 className="font-bold text-base sm:text-lg tracking-tight">StadiumBite</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block">Live Food Ratings</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-xs font-medium text-accent">LIVE</span>
            </div>
            
            <motion.button 
              onClick={onOpenLeaderboard}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium">Leaderboard</span>
            </motion.button>

            <motion.button 
              onClick={onOpenMap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Map className="w-4 h-4 text-chart-4" />
              <span className="text-xs">Map</span>
            </motion.button>

            <motion.button 
              onClick={onOpenOrders}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Package className="w-4 h-4" />
              <span className="text-xs">Orders</span>
            </motion.button>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Notification Bell */}
            <motion.button
              onClick={onOpenNotifications}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>

            {/* Cart */}
            <motion.button
              onClick={onOpenCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </motion.button>

            <ThemeToggle />
            <UserAvatar onOpenProfile={onOpenProfile} onOpenFavorites={onOpenFavorites} />
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-0">
            {/* Mobile Notification */}
            <motion.button
              onClick={onOpenNotifications}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full hover:bg-secondary active:bg-secondary/80 transition-colors"
            >
              <Bell className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-destructive text-destructive-foreground text-[9px] flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>

            {/* Mobile Cart */}
            <motion.button
              onClick={onOpenCart}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full hover:bg-secondary active:bg-secondary/80 transition-colors"
            >
              <ShoppingCart className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </motion.button>

            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full ml-0 w-8 h-8 sm:w-9 sm:h-9"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
                    <span className="text-xs font-medium text-accent">LIVE</span>
                  </div>
                  <UserAvatar onOpenProfile={onOpenProfile} onOpenFavorites={onOpenFavorites} />
                </div>

                <button 
                  onClick={() => { onOpenLeaderboard(); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 active:bg-secondary/60 transition-colors text-left"
                >
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Leaderboard</span>
                </button>

                <button 
                  onClick={() => { onOpenMap(); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 active:bg-secondary/60 transition-colors text-left"
                >
                  <Map className="w-5 h-5 text-chart-4" />
                  <span className="text-sm font-medium">Stadium Map</span>
                </button>

                <button 
                  onClick={() => { onOpenOrders(); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 active:bg-secondary/60 transition-colors text-left"
                >
                  <Package className="w-5 h-5" />
                  <span className="text-sm font-medium">My Orders</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
