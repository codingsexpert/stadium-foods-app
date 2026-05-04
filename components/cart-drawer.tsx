'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, MapPin, Clock, ChevronRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { foodStalls } from '@/lib/data'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type CheckoutStep = 'cart' | 'pickup' | 'confirm' | 'success'

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount, totalItems, placeOrder } = useCart()
  const [step, setStep] = useState<CheckoutStep>('cart')
  const [selectedPickup, setSelectedPickup] = useState<string | null>(null)
  const [currentOrder, setCurrentOrder] = useState<{ id: string; estimatedTime: number } | null>(null)

  const handleCheckout = () => {
    if (items.length === 0) return
    setStep('pickup')
  }

  const handleSelectPickup = (location: string) => {
    setSelectedPickup(location)
    setStep('confirm')
  }

  const handlePlaceOrder = () => {
    if (!selectedPickup) return
    const order = placeOrder(selectedPickup)
    setCurrentOrder({ id: order.id, estimatedTime: order.estimatedTime })
    setStep('success')
  }

  const handleClose = () => {
    setStep('cart')
    setSelectedPickup(null)
    setCurrentOrder(null)
    onClose()
  }

  const pickupLocations = [
    { id: '1', name: 'Gate A - Main Entrance', time: '2 min walk' },
    { id: '2', name: 'Gate B - East Side', time: '4 min walk' },
    { id: '3', name: 'Gate C - South Stand', time: '3 min walk' },
    { id: '4', name: 'Near Your Seat', time: '5 min walk' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md z-50 bg-background flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">
                  {step === 'cart' && `Your Cart (${totalItems})`}
                  {step === 'pickup' && 'Select Pickup'}
                  {step === 'confirm' && 'Confirm Order'}
                  {step === 'success' && 'Order Placed!'}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Cart Items */}
                {step === 'cart' && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 space-y-4"
                  >
                    {items.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-1">Your cart is empty</h3>
                        <p className="text-sm text-muted-foreground">Add some delicious items!</p>
                      </div>
                    ) : (
                      <>
                        {items.map((cartItem, index) => (
                          <motion.div
                            key={cartItem.item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex gap-3 p-3 rounded-xl bg-secondary/30 border border-border"
                          >
                            <img
                              src={cartItem.item.image}
                              alt={cartItem.item.name}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{cartItem.item.name}</h4>
                              <p className="text-xs text-muted-foreground">{cartItem.item.stallName}</p>
                              <p className="font-semibold mt-1">Rs.{cartItem.item.price}</p>

                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="w-7 h-7"
                                    onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-6 text-center font-medium">{cartItem.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="w-7 h-7"
                                    onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-7 h-7 text-destructive"
                                  onClick={() => removeFromCart(cartItem.item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {items.length > 0 && (
                          <Button
                            variant="ghost"
                            className="w-full text-destructive"
                            onClick={clearCart}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Cart
                          </Button>
                        )}
                      </>
                    )}
                  </motion.div>
                )}

                {/* Pickup Selection */}
                {step === 'pickup' && (
                  <motion.div
                    key="pickup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 space-y-3"
                  >
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose where you want to pick up your order
                    </p>
                    {pickupLocations.map((location, index) => (
                      <motion.button
                        key={location.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelectPickup(location.name)}
                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{location.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{location.time}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* Order Confirmation */}
                {step === 'confirm' && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4"
                  >
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border mb-4">
                      <h4 className="font-semibold mb-3">Order Summary</h4>
                      <div className="space-y-2">
                        {items.map(item => (
                          <div key={item.item.id} className="flex justify-between text-sm">
                            <span>{item.item.name} x{item.quantity}</span>
                            <span>Rs.{item.item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>Rs.{totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">Pickup Location</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedPickup}</p>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-secondary/30">
                      <p className="text-sm text-muted-foreground">
                        Estimated preparation time: <span className="font-medium text-foreground">10-15 mins</span>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Success */}
                {step === 'success' && currentOrder && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">Order Confirmed!</h3>
                    <p className="text-muted-foreground mb-4">
                      Order ID: <span className="font-mono">{currentOrder.id}</span>
                    </p>
                    <div className="p-4 rounded-xl bg-secondary/30 inline-block">
                      <div className="flex items-center gap-2 text-primary">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">Ready in ~{currentOrder.estimatedTime} mins</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      We&apos;ll notify you when your order is ready!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {step !== 'success' && items.length > 0 && (
              <div className="p-4 border-t border-border bg-background">
                {step === 'cart' && (
                  <>
                    <div className="flex justify-between mb-3">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">Rs.{totalAmount}</span>
                    </div>
                    <Button className="w-full h-12" onClick={handleCheckout}>
                      Proceed to Checkout
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}

                {step === 'pickup' && (
                  <Button variant="outline" className="w-full" onClick={() => setStep('cart')}>
                    Back to Cart
                  </Button>
                )}

                {step === 'confirm' && (
                  <div className="space-y-2">
                    <Button className="w-full h-12" onClick={handlePlaceOrder}>
                      Place Order - Rs.{totalAmount}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setStep('pickup')}>
                      Change Pickup
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step === 'success' && (
              <div className="p-4 border-t border-border">
                <Button className="w-full" onClick={handleClose}>
                  Done
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
