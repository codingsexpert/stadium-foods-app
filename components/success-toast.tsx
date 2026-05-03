'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Star, Sparkles } from 'lucide-react'

interface SuccessToastProps {
  show: boolean
  itemName: string
  rating: number
  onClose: () => void
}

export function SuccessToast({ show, itemName, rating, onClose }: SuccessToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
        >
          <motion.div
            initial={{ boxShadow: '0 0 0 0 rgba(var(--primary), 0.4)' }}
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(234, 88, 12, 0.4)',
                '0 0 0 20px rgba(234, 88, 12, 0)',
              ]
            }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-4 flex items-center gap-4 min-w-[300px]"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center"
            >
              <CheckCircle className="w-6 h-6 text-accent" />
            </motion.div>
            
            <div className="flex-1">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="font-semibold"
              >
                Rating Submitted!
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground"
              >
                You rated {itemName}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1 mt-1"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Star 
                      className={`w-4 h-4 ${
                        i < rating ? 'fill-primary text-primary' : 'text-muted'
                      }`}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-medium"
            >
              <Sparkles className="w-3 h-3" />
              +10 Points
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
