'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Star, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/user-context'
import { foodItems } from '@/lib/data'
import { FoodItem } from '@/lib/types'

interface FavoritesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectItem: (item: FoodItem) => void
}

export function FavoritesModal({ isOpen, onClose, onSelectItem }: FavoritesModalProps) {
  const { user, toggleFavorite } = useUser()

  const favoriteItems = foodItems.filter(item => 
    user?.favorites.includes(item.id)
  )

  const handleSelectItem = (item: FoodItem) => {
    onSelectItem(item)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-3 bottom-20 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-card rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col md:max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <h2 className="text-lg font-bold">My Favorites</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {favoriteItems.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <Heart className="w-8 h-8 text-red-500" />
                  </motion.div>
                  <h3 className="font-semibold mb-1">No favorites yet</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Tap the heart icon on any food item to add it to your favorites
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoriteItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-secondary rounded-xl group cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{item.stallName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-medium">{item.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Rs.{item.price}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                      >
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
