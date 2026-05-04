'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin, Clock, ChevronRight, Flame, Leaf, Heart, Pizza, Coffee, Salad, IceCream, Sandwich, Plus, ShoppingCart } from 'lucide-react'
import { FoodItem } from '@/lib/types'
import { foodItems, foodStalls } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/lib/user-context'
import { useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'

interface FoodGridProps {
  onSelectItem: (item: FoodItem) => void
  searchQuery?: string
}

type Category = 'all' | 'favorites' | 'burgers' | 'pizza' | 'snacks' | 'drinks' | 'desserts' | 'healthy'

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: null },
  { id: 'favorites', label: 'Favorites', icon: <Heart className="w-3.5 h-3.5" /> },
  { id: 'burgers', label: 'Burgers', icon: <Sandwich className="w-3.5 h-3.5" /> },
  { id: 'pizza', label: 'Pizza', icon: <Pizza className="w-3.5 h-3.5" /> },
  { id: 'snacks', label: 'Snacks', icon: <Flame className="w-3.5 h-3.5" /> },
  { id: 'drinks', label: 'Drinks', icon: <Coffee className="w-3.5 h-3.5" /> },
  { id: 'desserts', label: 'Desserts', icon: <IceCream className="w-3.5 h-3.5" /> },
  { id: 'healthy', label: 'Healthy', icon: <Salad className="w-3.5 h-3.5" /> },
]

export function FoodGrid({ onSelectItem, searchQuery = '' }: FoodGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [selectedStall, setSelectedStall] = useState<string | null>(null)
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})
  const { isFavorite, toggleFavorite, isProfileSetup } = useUser()
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = (e: React.MouseEvent, item: FoodItem) => {
    e.stopPropagation()
    addToCart(item, 1)
    setAddedItems(prev => ({ ...prev, [item.id]: true }))
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }))
    }, 1500)
  }

  const handleViewStall = (e: React.MouseEvent, stallId: string) => {
    e.stopPropagation()
    router.push(`/stall/${stallId}`)
  }

  const filteredItems = foodItems.filter(item => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = item.name.toLowerCase().includes(query)
      const matchesStall = item.stallName.toLowerCase().includes(query)
      const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(query))
      if (!matchesName && !matchesStall && !matchesTags) return false
    }

    // Stall filter
    if (selectedStall) return item.stallId === selectedStall

    // Category filter
    if (selectedCategory === 'favorites') {
      return isFavorite(item.id)
    }
    if (selectedCategory === 'burgers') {
      return item.tags.some(t => t.toLowerCase().includes('burger')) || 
             item.name.toLowerCase().includes('burger')
    }
    if (selectedCategory === 'pizza') {
      return item.name.toLowerCase().includes('pizza')
    }
    if (selectedCategory === 'snacks') {
      return item.tags.some(t => ['spicy', 'tangy', 'crispy'].includes(t.toLowerCase())) ||
             ['vada pav', 'pani puri', 'momos', 'tikka'].some(s => item.name.toLowerCase().includes(s))
    }
    if (selectedCategory === 'drinks') {
      return item.tags.some(t => t.toLowerCase().includes('drink')) ||
             ['lassi', 'chai', 'coffee', 'juice', 'soda'].some(s => item.name.toLowerCase().includes(s))
    }
    if (selectedCategory === 'desserts') {
      return item.tags.some(t => t.toLowerCase().includes('sweet')) ||
             ['ice cream', 'kulfi', 'gulab jamun', 'jalebi'].some(s => item.name.toLowerCase().includes(s))
    }
    if (selectedCategory === 'healthy') {
      return item.tags.some(t => ['vegetarian', 'grilled', 'steamed'].includes(t.toLowerCase()))
    }

    return true
  })

  return (
    <div className="space-y-4">
      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {CATEGORIES.map(category => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedCategory(category.id); setSelectedStall(null) }}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary hover:bg-secondary/80 active:bg-secondary/60'
            } ${category.id === 'favorites' && !isProfileSetup ? 'opacity-50' : ''}`}
            disabled={category.id === 'favorites' && !isProfileSetup}
          >
            {category.icon}
            <span>{category.label}</span>
            {category.id === 'favorites' && isProfileSetup && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {foodItems.filter(item => isFavorite(item.id)).length}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Stall Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {foodStalls.filter(s => s.isOpen).slice(0, 4).map(stall => (
          <motion.button
            key={stall.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedStall(selectedStall === stall.id ? null : stall.id)}
            className={`shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all active:scale-95 ${
              selectedStall === stall.id
                ? 'bg-primary/20 border-primary/50 text-primary'
                : 'bg-secondary/50 border-border hover:border-primary/30 active:bg-secondary/80'
            }`}
          >
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{stall.name}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{stall.section}</span>
                <Clock className="w-3 h-3 ml-1" />
                <span>{stall.waitTime}min</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      {/* Food Items Grid */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          {selectedCategory === 'favorites' ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4"
              >
                <Heart className="w-8 h-8 text-red-500" />
              </motion.div>
              <h3 className="font-semibold mb-1">No favorites yet</h3>
              <p className="text-sm text-muted-foreground">
                Tap the heart icon on food items to save them here
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No items found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </>
          )}
        </motion.div>
      ) : (
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => onSelectItem(item)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
            >
              <div className="relative h-36 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                
                {/* Favorite Button */}
                {isProfileSetup && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(item.id)
                    }}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        isFavorite(item.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                    />
                  </motion.button>
                )}

                {/* Price Tag */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm">
                  <span className="text-sm font-bold">Rs.{item.price}</span>
                </div>

                {/* Tags */}
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {item.tags.includes('Popular') && (
                    <Badge variant="secondary" className="bg-primary/90 text-primary-foreground text-[10px] gap-1">
                      <Flame className="w-3 h-3" /> Popular
                    </Badge>
                  )}
                  {item.tags.includes('Vegetarian') && (
                    <Badge variant="secondary" className="bg-accent/90 text-accent-foreground text-[10px] gap-1">
                      <Leaf className="w-3 h-3" /> Veg
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.stallName}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span className="text-sm font-bold">{item.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={(e) => handleViewStall(e, item.stallId)}
                  >
                    View Stall
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="text-xs gap-1"
                    onClick={(e) => handleAddToCart(e, item)}
                  >
                    {addedItems[item.id] ? (
                      <>
                        <ShoppingCart className="w-3 h-3" />
                        Added!
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      )}
    </div>
  )
}
