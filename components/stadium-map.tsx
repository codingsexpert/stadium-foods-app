'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Clock, Star, ChevronRight, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { foodStalls, stallPositions, foodItems } from '@/lib/data'
import { useRouter } from 'next/navigation'

interface StadiumMapProps {
  isOpen: boolean
  onClose: () => void
}

const SECTION_COLORS = {
  north: '#22c55e',
  south: '#3b82f6',
  east: '#f59e0b',
  west: '#ec4899'
}

const SECTION_LABELS = {
  north: 'North Stand',
  south: 'South Stand',
  east: 'East Stand',
  west: 'West Stand'
}

export function StadiumMap({ isOpen, onClose }: StadiumMapProps) {
  const router = useRouter()
  const [selectedStall, setSelectedStall] = useState<string | null>(null)
  const [hoveredStall, setHoveredStall] = useState<string | null>(null)

  const stall = selectedStall ? foodStalls.find(s => s.id === selectedStall) : null
  const stallItemCount = selectedStall 
    ? foodItems.filter(item => item.stallId === selectedStall).length 
    : 0

  const handleStallClick = (stallId: string) => {
    setSelectedStall(stallId)
  }

  const handleNavigate = () => {
    if (selectedStall) {
      router.push(`/stall/${selectedStall}`)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bottom-16 md:bottom-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Stadium Map</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Tap a stall for details</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 sm:w-9 sm:h-9">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-3 border-b border-border overflow-x-auto scrollbar-hide">
            {Object.entries(SECTION_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs shrink-0">
                <div 
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" 
                  style={{ backgroundColor: SECTION_COLORS[key as keyof typeof SECTION_COLORS] }}
                />
                <span className="hidden xs:inline">{label}</span>
                <span className="xs:hidden">{label.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* Map Container */}
          <div className="flex-1 p-4 overflow-hidden">
            <div className="relative w-full max-w-md mx-auto aspect-square">
              {/* Stadium Shape - Oval */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Outer ring */}
                <ellipse
                  cx="50"
                  cy="50"
                  rx="48"
                  ry="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border"
                />
                
                {/* Inner field */}
                <ellipse
                  cx="50"
                  cy="50"
                  rx="30"
                  ry="25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className="text-primary/30"
                />
                <ellipse
                  cx="50"
                  cy="50"
                  rx="30"
                  ry="25"
                  fill="currentColor"
                  className="text-primary/5"
                />

                {/* Section labels */}
                <text x="50" y="8" textAnchor="middle" className="fill-muted-foreground text-[4px]">NORTH</text>
                <text x="50" y="96" textAnchor="middle" className="fill-muted-foreground text-[4px]">SOUTH</text>
                <text x="5" y="52" textAnchor="middle" className="fill-muted-foreground text-[4px]" transform="rotate(-90 5 52)">WEST</text>
                <text x="95" y="52" textAnchor="middle" className="fill-muted-foreground text-[4px]" transform="rotate(90 95 52)">EAST</text>

                {/* Gates */}
                <text x="50" y="15" textAnchor="middle" className="fill-muted-foreground text-[3px]">Gate A</text>
                <text x="85" y="52" textAnchor="middle" className="fill-muted-foreground text-[3px]">Gate B</text>
                <text x="50" y="90" textAnchor="middle" className="fill-muted-foreground text-[3px]">Gate C</text>
                <text x="15" y="52" textAnchor="middle" className="fill-muted-foreground text-[3px]">Gate D</text>
              </svg>

              {/* Stall Markers */}
              {stallPositions.map(pos => {
                const stallData = foodStalls.find(s => s.id === pos.stallId)
                if (!stallData) return null

                const isSelected = selectedStall === pos.stallId
                const isHovered = hoveredStall === pos.stallId

                return (
                  <motion.button
                    key={pos.stallId}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: isSelected ? 1.3 : isHovered ? 1.15 : 1,
                      zIndex: isSelected || isHovered ? 10 : 1
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStallClick(pos.stallId)}
                    onMouseEnter={() => setHoveredStall(pos.stallId)}
                    onMouseLeave={() => setHoveredStall(null)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                  >
                    <div 
                      className={`relative flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-lg transition-all ${
                        isSelected ? 'ring-2 ring-offset-1 sm:ring-offset-2 ring-primary' : ''
                      }`}
                      style={{ backgroundColor: SECTION_COLORS[pos.section] }}
                    >
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      {stallData.isOpen && (
                        <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full border sm:border-2 border-background" />
                      )}
                    </div>
                    
                    {/* Tooltip */}
                    <AnimatePresence>
                      {(isHovered || isSelected) && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute top-full mt-0.5 sm:mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-popover text-popover-foreground text-[10px] sm:text-xs shadow-lg border border-border"
                        >
                          {stallData.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Selected Stall Details */}
          <AnimatePresence>
            {stall && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-background border-t border-border mb-16 md:mb-0"
              >
                <div className="flex items-start gap-2.5 sm:gap-4">
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: SECTION_COLORS[stallPositions.find(p => p.stallId === stall.id)?.section || 'north'] + '20' }}
                  >
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: SECTION_COLORS[stallPositions.find(p => p.stallId === stall.id)?.section || 'north'] }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <h3 className="font-semibold truncate text-sm sm:text-base">{stall.name}</h3>
                      <Badge variant={stall.isOpen ? 'default' : 'secondary'} className="text-[9px] sm:text-[10px] px-1 sm:px-1.5">
                        {stall.isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stall.cuisine}</p>
                    
                    <div className="flex items-center gap-2 sm:gap-4 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{stall.location}</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{stall.waitTime}m</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-primary text-primary" />
                        <span>{stallItemCount} items</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleNavigate} className="gap-0.5 sm:gap-1 shrink-0 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3">
                    <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">View</span>
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
