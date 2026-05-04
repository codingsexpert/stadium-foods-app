'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Sparkles, Send, Loader2, Camera } from 'lucide-react'
import { FoodItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface RatingModalProps {
  item: FoodItem | null
  onClose: () => void
  onSubmit: (rating: number, review: string) => Promise<void>
}

export function RatingModal({ item, onClose, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<{
    sentiment: string
    summary: string
    highlights: string[]
  } | null>(null)

  const handleSubmit = async () => {
    if (rating === 0) return
    
    setIsSubmitting(true)
    
    // Get AI analysis if review exists
    if (review.trim()) {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ review, itemName: item?.name })
        })
        const analysis = await res.json()
        setAiAnalysis(analysis)
      } catch (error) {
        console.error('AI analysis failed:', error)
      }
    }
    
    await onSubmit(rating, review)
    setIsSubmitting(false)
  }

  const displayRating = hoveredRating || rating

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bottom-16 md:bottom-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg glass-card rounded-t-2xl sm:rounded-t-3xl md:rounded-3xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
          >
            {/* Header Image */}
            <div className="relative h-32 sm:h-40">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                <h2 className="text-lg sm:text-xl font-bold">{item.name}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.stallName}</p>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Star Rating */}
              <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">How was your experience?</p>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="p-0.5 sm:p-1"
                    >
                      <Star 
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                          star <= displayRating 
                            ? 'fill-primary text-primary' 
                            : 'text-muted hover:text-muted-foreground'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                {displayRating > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs sm:text-sm font-medium mt-1.5 sm:mt-2"
                  >
                    {displayRating === 5 ? 'Amazing!' : 
                     displayRating === 4 ? 'Great!' :
                     displayRating === 3 ? 'Good' :
                     displayRating === 2 ? 'Could be better' : 'Not satisfied'}
                  </motion.p>
                )}
              </div>

              {/* Review Input */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium">Review (optional)</label>
                  <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-muted-foreground">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                    AI analysis
                  </div>
                </div>
                <Textarea 
                  placeholder="Share your thoughts..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={2}
                  className="resize-none bg-secondary border-border text-sm"
                />
              </div>

              {/* Photo Upload Button */}
              <Button variant="outline" className="w-full gap-1.5 sm:gap-2 border-dashed h-9 sm:h-10 text-xs sm:text-sm">
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Add Photo
              </Button>

              {/* AI Analysis Result */}
              <AnimatePresence>
                {aiAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-primary/10 border border-primary/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">AI Analysis</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{aiAnalysis.summary}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        aiAnalysis.sentiment === 'positive' 
                          ? 'bg-accent/20 text-accent'
                          : aiAnalysis.sentiment === 'negative'
                          ? 'bg-destructive/20 text-destructive'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {aiAnalysis.sentiment}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button 
                className="w-full gap-1.5 sm:gap-2 h-10 sm:h-11 text-sm" 
                disabled={rating === 0 || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                    <span className="hidden sm:inline">Analyzing with AI...</span>
                    <span className="sm:hidden">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Submit Rating
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
