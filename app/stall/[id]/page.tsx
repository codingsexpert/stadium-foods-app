'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Star, Plus, Minus, ChevronRight, Flame, Leaf, ShoppingCart, Heart, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { foodStalls, foodItems, recentReviews } from '@/lib/data'
import { useCart } from '@/lib/cart-context'
import { useUser } from '@/lib/user-context'
import { useState, useMemo } from 'react'
import { FoodItem } from '@/lib/types'

export default function StallPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart, updateQuantity, items } = useCart()
  const { isFavorite, toggleFavorite, isProfileSetup } = useUser()
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})

  const stall = foodStalls.find(s => s.id === params.id)
  const stallItems = foodItems.filter(item => item.stallId === params.id)
  const stallReviews = recentReviews.filter(r => stallItems.some(item => item.id === r.itemId))

  const averageRating = useMemo(() => {
    if (stallItems.length === 0) return 0
    return (stallItems.reduce((sum, item) => sum + item.rating, 0) / stallItems.length).toFixed(1)
  }, [stallItems])

  const totalRatings = useMemo(() => {
    return stallItems.reduce((sum, item) => sum + item.totalRatings, 0)
  }, [stallItems])

  if (!stall) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Stall Not Found</h1>
          <Button onClick={() => router.push('/')}>Go Back Home</Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = (item: FoodItem) => {
    addToCart(item, 1)
    setAddedItems(prev => ({ ...prev, [item.id]: true }))
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }))
    }, 1500)
  }

  const getCartQuantity = (itemId: string) => {
    const cartItem = items.find(i => i.item.id === itemId)
    return cartItem?.quantity || 0
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="relative z-10 p-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 backdrop-blur-sm"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex items-end justify-between">
            <div>
              <Badge variant={stall.isOpen ? 'default' : 'secondary'} className="mb-2">
                {stall.isOpen ? 'Open Now' : 'Closed'}
              </Badge>
              <h1 className="text-2xl font-bold">{stall.name}</h1>
              <p className="text-sm text-muted-foreground">{stall.cuisine}</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-bold">{averageRating}</span>
              <span className="text-xs text-muted-foreground">({totalRatings})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex items-center gap-4 p-4 border-b border-border">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{stall.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-primary" />
          <span>{stall.waitTime} min wait</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Menu ({stallItems.length} items)</h2>
        
        <div className="space-y-4">
          <AnimatePresence>
            {stallItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-2xl bg-secondary/30 border border-border"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {isProfileSetup && (
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-1 left-1 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center"
                    >
                      <Heart className={`w-3 h-3 ${isFavorite(item.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                    </button>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {item.tags.includes('Vegetarian') && (
                      <Badge variant="secondary" className="text-[10px] gap-1 bg-green-500/10 text-green-600">
                        <Leaf className="w-3 h-3" /> Veg
                      </Badge>
                    )}
                    {item.tags.includes('Popular') && (
                      <Badge variant="secondary" className="text-[10px] gap-1 bg-orange-500/10 text-orange-600">
                        <Flame className="w-3 h-3" /> Popular
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-lg">Rs.{item.price}</span>
                    
                    {getCartQuantity(item.id) > 0 ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8"
                          onClick={() => {
                            const qty = getCartQuantity(item.id)
                            updateQuantity(item.id, qty - 1)
                          }}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-6 text-center font-semibold">{getCartQuantity(item.id)}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8"
                          onClick={() => addToCart(item, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <motion.div
                        animate={addedItems[item.id] ? { scale: [1, 1.2, 1] } : {}}
                      >
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          className="gap-1"
                        >
                          {addedItems[item.id] ? (
                            <>Added!</>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" /> Add
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Reviews Section */}
      {stallReviews.length > 0 && (
        <div className="p-4 border-t border-border">
          <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
          <div className="space-y-3">
            {stallReviews.slice(0, 3).map(review => (
              <div key={review.id} className="p-3 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={review.userAvatar} 
                    alt={review.userName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">{review.userName}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-20 md:bottom-4 left-4 right-4 z-40"
        >
          <Button
            className="w-full h-12 md:h-14 rounded-2xl shadow-lg gap-2"
            onClick={() => router.push('/?cart=open')}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm md:text-base">View Cart ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        </motion.div>
      )}

      {/* Simple Bottom Nav for stall page */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 md:hidden z-30 bg-background/95 backdrop-blur-md border-t border-border"
      >
        <div className="flex items-center justify-around px-4 py-2 pb-[env(safe-area-inset-bottom,8px)]">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-0.5 h-auto py-2"
            onClick={() => router.push('/')}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-0.5 h-auto py-2"
            onClick={() => router.push('/?cart=open')}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </div>
            <span className="text-[10px]">Cart</span>
          </Button>
        </div>
      </motion.nav>
    </div>
  )
}
