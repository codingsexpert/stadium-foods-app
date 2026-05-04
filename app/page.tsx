'use client'

import { useState, useCallback, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { StatsBar } from '@/components/stats-bar'
import { LiveFeed } from '@/components/live-feed'
import { FoodGrid } from '@/components/food-grid'
import { RatingModal } from '@/components/rating-modal'
import { AIChat } from '@/components/ai-chat'
import { SuccessToast } from '@/components/success-toast'
import { ProfileModal } from '@/components/profile-modal'
import { FavoritesModal } from '@/components/favorites-modal'
import { CartDrawer } from '@/components/cart-drawer'
import { NotificationPanel } from '@/components/notification-panel'
import { StadiumMap } from '@/components/stadium-map'
import { Leaderboard } from '@/components/leaderboard'
import { OrderHistory } from '@/components/order-history'
import { BottomNav } from '@/components/bottom-nav'
import { FoodItem } from '@/lib/types'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useUser } from '@/lib/user-context'

// Component that handles URL search params - needs to be wrapped in Suspense
function CartParamHandler({ onOpenCart }: { onOpenCart: () => void }) {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    if (searchParams.get('cart') === 'open') {
      onOpenCart()
    }
  }, [searchParams, onOpenCart])
  
  return null
}

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastRating, setLastRating] = useState({ itemName: '', rating: 0 })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showFavoritesModal, setShowFavoritesModal] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { addRating } = useUser()

  const handleOpenCart = useCallback(() => setShowCart(true), [])

  const handleSubmitRating = useCallback(async (rating: number, review: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (selectedItem) {
      addRating({
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        stallName: selectedItem.stallName,
        rating,
        comment: review
      })
    }
    
    setLastRating({ itemName: selectedItem?.name || '', rating })
    setSelectedItem(null)
    setShowSuccess(true)
    
    setTimeout(() => setShowSuccess(false), 4000)
  }, [selectedItem, addRating])

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Handle URL search params for cart */}
      <Suspense fallback={null}>
        <CartParamHandler onOpenCart={handleOpenCart} />
      </Suspense>
      
      <Header 
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenFavorites={() => setShowFavoritesModal(true)}
        onOpenCart={() => setShowCart(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenMap={() => setShowMap(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenOrders={() => setShowOrders(true)}
      />
      
      <main className="max-w-7xl mx-auto px-2.5 sm:px-4 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-2 sm:py-4 md:py-6"
        >
          <motion.h1 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1.5 sm:mb-2 px-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="gradient-text">Rate Stadium Food</span>{' '}
            <span className="text-foreground">in Real-Time</span>
          </motion.h1>
          <motion.p 
            className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-lg mx-auto px-2 sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Discover what fans are loving. AI-powered recommendations for you.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            className="max-w-md mx-auto mt-3 sm:mt-4 md:mt-6 px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <Input 
                placeholder="Search food, stalls..."
                className="pl-9 sm:pl-12 h-10 sm:h-12 md:h-14 bg-secondary border-border rounded-full text-xs sm:text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Stats */}
        <StatsBar />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Food Grid - Takes 2 columns */}
          <motion.section 
            className="lg:col-span-2 space-y-3 sm:space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg md:text-xl font-bold">Explore Menu</h2>
              <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">20 items</span>
            </div>
            <FoodGrid onSelectItem={setSelectedItem} searchQuery={searchQuery} />
          </motion.section>

          {/* Live Feed Sidebar */}
          <motion.section 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <LiveFeed />
          </motion.section>
        </div>
      </main>

      {/* Rating Modal */}
      <RatingModal 
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSubmit={handleSubmitRating}
      />

      {/* AI Chat Widget */}
      <AIChat />

      {/* Success Toast */}
      <SuccessToast 
        show={showSuccess}
        itemName={lastRating.itemName}
        rating={lastRating.rating}
        onClose={() => setShowSuccess(false)}
      />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Favorites Modal */}
      <FavoritesModal 
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        onSelectItem={setSelectedItem}
      />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Stadium Map */}
      <StadiumMap 
        isOpen={showMap}
        onClose={() => setShowMap(false)}
      />

      {/* Leaderboard */}
      <Leaderboard 
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />

      {/* Order History */}
      <OrderHistory 
        isOpen={showOrders}
        onClose={() => setShowOrders(false)}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        onOpenCart={() => setShowCart(true)}
        onOpenMap={() => setShowMap(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenOrders={() => setShowOrders(true)}
      />
    </div>
  )
}
