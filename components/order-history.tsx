'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, Clock, CheckCircle, ChefHat, Truck, MapPin, Sparkles, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { Order } from '@/lib/types'

interface OrderHistoryProps {
  isOpen: boolean
  onClose: () => void
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-600',
    icon: Clock
  },
  confirmed: {
    label: 'Confirmed',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600',
    icon: CheckCircle
  },
  preparing: {
    label: 'Preparing',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-600',
    icon: ChefHat
  },
  ready: {
    label: 'Ready!',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600',
    icon: Package
  },
  delivered: {
    label: 'Delivered',
    color: 'from-gray-500 to-slate-500',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-500',
    icon: Truck
  }
}

function OrderCard({ order, isActive }: { order: Order; isActive: boolean }) {
  const statusConfig = STATUS_CONFIG[order.status]
  const StatusIcon = statusConfig.icon
  const orderDate = new Date(order.orderTime)
  const timeAgo = getTimeAgo(orderDate)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-card rounded-2xl border overflow-hidden transition-all ${
        isActive ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-border/50'
      }`}
    >
      {/* Status Bar */}
      <div className={`h-1 bg-gradient-to-r ${statusConfig.color}`} />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {order.id}
              </span>
              {isActive && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
          
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${statusConfig.bgColor}`}>
            <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.textColor}`} />
            <span className={`text-xs font-semibold ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-3">
          {order.items.slice(0, 2).map(item => (
            <div key={item.item.id} className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <img
                  src={item.item.image}
                  alt={item.item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md">
                  x{item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.item.name}</p>
                <p className="text-xs text-muted-foreground">{item.item.stallName}</p>
              </div>
              <span className="text-sm font-semibold">Rs.{item.item.price * item.quantity}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-xs text-muted-foreground pl-15">
              +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[140px]">{order.pickupLocation}</span>
          </div>
          <span className="font-bold text-primary">Rs.{order.totalAmount}</span>
        </div>

        {/* Status Alerts */}
        {order.status === 'ready' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">Ready for pickup!</p>
                <p className="text-xs text-green-600/80">Head to the counter now</p>
              </div>
            </div>
          </motion.div>
        )}

        {order.status === 'preparing' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center animate-pulse">
                <ChefHat className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Being prepared</p>
                <p className="text-xs text-orange-600/80">Your food is cooking...</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}

export function OrderHistory({ isOpen, onClose }: OrderHistoryProps) {
  const { orders } = useCart()

  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status))
  const pastOrders = orders.filter(o => o.status === 'delivered')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-[420px] z-50 bg-background shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="relative px-4 py-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/20">
                    <Receipt className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">My Orders</h2>
                    <p className="text-xs text-muted-foreground">
                      {orders.length} order{orders.length !== 1 ? 's' : ''} total
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="w-9 h-9 rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">No Orders Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                    Your order history will appear here after your first purchase
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeOrders.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <h3 className="font-semibold text-sm">Active Orders</h3>
                        <span className="text-xs text-muted-foreground">({activeOrders.length})</span>
                      </div>
                      <div className="space-y-3">
                        {activeOrders.map(order => (
                          <OrderCard key={order.id} order={order} isActive={true} />
                        ))}
                      </div>
                    </div>
                  )}

                  {pastOrders.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                        Past Orders ({pastOrders.length})
                      </h3>
                      <div className="space-y-3">
                        {pastOrders.map(order => (
                          <OrderCard key={order.id} order={order} isActive={false} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Safe Area */}
            <div className="safe-area-bottom" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
