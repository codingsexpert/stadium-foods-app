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
            className="w-full max-w-lg glass-card rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header Image */}
            <div className="relative h-40">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-bold">{item.name}</h2>
                <p className="text-sm text-muted-foreground">{item.stallName}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Star Rating */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">How was your experience?</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star 
                        className={`w-10 h-10 transition-colors ${
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
                    className="text-sm font-medium mt-2"
                  >
                    {displayRating === 5 ? 'Amazing!' : 
                     displayRating === 4 ? 'Great!' :
                     displayRating === 3 ? 'Good' :
                     displayRating === 2 ? 'Could be better' : 'Not satisfied'}
                  </motion.p>
                )}
              </div>

              {/* Review Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Write a review (optional)</label>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3 text-primary" />
                    AI-powered analysis
                  </div>
                </div>
                <Textarea 
                  placeholder="Share your thoughts about this food..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={3}
                  className="resize-none bg-secondary border-border"
                />
              </div>

              {/* Photo Upload Button */}
              <Button variant="outline" className="w-full gap-2 border-dashed">
                <Camera className="w-4 h-4" />
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
                className="w-full gap-2" 
                size="lg"
                disabled={rating === 0 || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
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
