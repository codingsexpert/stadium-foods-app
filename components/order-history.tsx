'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, Clock, CheckCircle, ChefHat, Truck, MapPin, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/cart-context'
import { Order } from '@/lib/types'

interface OrderHistoryProps {
  isOpen: boolean
  onClose: () => void
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-500/20 text-yellow-600',
    icon: <Clock className="w-4 h-4" />
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-500/20 text-blue-600',
    icon: <CheckCircle className="w-4 h-4" />
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-orange-500/20 text-orange-600',
    icon: <ChefHat className="w-4 h-4" />
  },
  ready: {
    label: 'Ready',
    color: 'bg-green-500/20 text-green-600',
    icon: <Package className="w-4 h-4" />
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-gray-500/20 text-gray-600',
    icon: <Truck className="w-4 h-4" />
  }
}

function OrderCard({ order }: { order: Order }) {
  const statusConfig = STATUS_CONFIG[order.status]
  const orderDate = new Date(order.orderTime)
  const timeAgo = getTimeAgo(orderDate)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-secondary/30 border border-border"
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div>
          <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">{order.id}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
        </div>
        <Badge className={`${statusConfig.color} gap-0.5 sm:gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2`}>
          {React.cloneElement(statusConfig.icon as React.ReactElement, { className: 'w-3 h-3 sm:w-4 sm:h-4' })}
          {statusConfig.label}
        </Badge>
      </div>

      <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
        {order.items.slice(0, 2).map(item => (
          <div key={item.item.id} className="flex items-center gap-2">
            <img
              src={item.item.image}
              alt={item.item.name}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg object-cover object-center shrink-0 bg-muted"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium truncate">{item.item.name}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">x{item.quantity}</p>
            </div>
            <span className="text-xs sm:text-sm">Rs.{item.item.price * item.quantity}</span>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            +{order.items.length - 2} more
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
          <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span className="truncate max-w-[100px] sm:max-w-[150px]">{order.pickupLocation}</span>
        </div>
        <span className="font-semibold text-xs sm:text-sm">Rs.{order.totalAmount}</span>
      </div>

      {order.status === 'ready' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 sm:mt-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-green-500/10 border border-green-500/20"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-green-600">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">Ready for pickup!</span>
          </div>
        </motion.div>
      )}

      {order.status === 'preparing' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 sm:mt-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-orange-500/10 border border-orange-500/20"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="animate-spin">
              <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
            </div>
            <span className="text-xs sm:text-sm">Being prepared...</span>
          </div>
        </motion.div>
      )}
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bottom-16 md:bottom-0 z-50 bg-background/95 backdrop-blur-sm overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold">Orders</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{orders.length} total</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 sm:w-9 sm:h-9">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-1">No orders yet</h3>
                <p className="text-sm text-muted-foreground">Your order history will appear here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeOrders.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Active Orders
                    </h3>
                    <div className="space-y-3">
                      {activeOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                )}

                {pastOrders.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-muted-foreground">Past Orders</h3>
                    <div className="space-y-3">
                      {pastOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
