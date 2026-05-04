'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, MapPin, Clock, ChevronRight, CheckCircle, Sparkles, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'

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
    { id: '1', name: 'Gate A - Main Entrance', time: '2 min walk', popular: true },
    { id: '2', name: 'Gate B - East Side', time: '4 min walk', popular: false },
    { id: '3', name: 'Gate C - South Stand', time: '3 min walk', popular: false },
    { id: '4', name: 'Near Your Seat', time: '5 min walk', popular: false }
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-[420px] z-50 bg-background shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="relative px-4 py-4 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {step !== 'cart' && step !== 'success' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setStep(step === 'confirm' ? 'pickup' : 'cart')}
                      className="w-8 h-8 -ml-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                    <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      {step === 'cart' && 'Your Cart'}
                      {step === 'pickup' && 'Pickup Point'}
                      {step === 'confirm' && 'Confirm Order'}
                      {step === 'success' && 'Order Placed'}
                    </h2>
                    {step === 'cart' && totalItems > 0 && (
                      <p className="text-xs text-muted-foreground">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleClose} 
                  className="w-9 h-9 rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Progress Steps */}
              {step !== 'success' && items.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  {['cart', 'pickup', 'confirm'].map((s, i) => (
                    <div key={s} className="flex items-center flex-1">
                      <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                        i < ['cart', 'pickup', 'confirm'].indexOf(step) + 1 
                          ? 'bg-primary' 
                          : 'bg-muted'
                      }`} />
                    </div>
                  ))}
                </div>
              )}
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
                    className="p-4"
                  >
                    {items.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                          <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">Cart is Empty</h3>
                        <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                          Add some delicious stadium food to get started!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {items.map((cartItem, index) => (
                          <motion.div
                            key={cartItem.item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="flex gap-3 p-3">
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                <img
                                  src={cartItem.item.image}
                                  alt={cartItem.item.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                              </div>
                              <div className="flex-1 min-w-0 py-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-semibold text-sm leading-tight">{cartItem.item.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">{cartItem.item.stallName}</p>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="w-7 h-7 -mr-1 -mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeFromCart(cartItem.item.id)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="w-7 h-7 rounded-md hover:bg-background"
                                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-8 text-center font-semibold text-sm">{cartItem.quantity}</span>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="w-7 h-7 rounded-md hover:bg-background"
                                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <p className="font-bold text-primary">Rs.{cartItem.item.price * cartItem.quantity}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-muted-foreground hover:text-destructive"
                          onClick={clearCart}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All Items
                        </Button>
                      </div>
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
                    className="p-4"
                  >
                    <p className="text-sm text-muted-foreground mb-4">
                      Select where you&apos;d like to collect your order
                    </p>
                    <div className="space-y-2">
                      {pickupLocations.map((location, index) => (
                        <motion.button
                          key={location.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSelectPickup(location.name)}
                          className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{location.name}</p>
                              {location.popular && (
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-accent/20 text-accent">
                                  Popular
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Clock className="w-3 h-3" />
                              <span>{location.time}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Order Confirmation */}
                {step === 'confirm' && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 space-y-4"
                  >
                    {/* Order Items */}
                    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                        <h4 className="font-semibold text-sm">Order Summary</h4>
                      </div>
                      <div className="p-4 space-y-3">
                        {items.map(item => (
                          <div key={item.item.id} className="flex items-center gap-3">
                            <img 
                              src={item.item.image} 
                              alt={item.item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold">Rs.{item.item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="pt-3 border-t border-border/50 flex justify-between items-center">
                          <span className="font-medium">Total</span>
                          <span className="text-lg font-bold text-primary">Rs.{totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pickup Location */}
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 border border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Pickup at</p>
                          <p className="font-semibold text-sm">{selectedPickup}</p>
                        </div>
                      </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Estimated ready in</p>
                        <p className="font-semibold">10-15 minutes</p>
                      </div>
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
                      className="relative w-24 h-24 mx-auto mb-6"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/30 to-accent/30 animate-pulse" />
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-500 to-accent flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold mb-2">Order Confirmed!</h3>
                      <p className="text-muted-foreground mb-6">
                        Your food is being prepared
                      </p>
                      
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm">
                        <span className="text-muted-foreground">Order ID:</span>
                        <span className="font-mono font-semibold">{currentOrder.id}</span>
                      </div>

                      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 inline-block">
                        <div className="flex items-center gap-3 text-primary">
                          <Sparkles className="w-5 h-5" />
                          <span className="font-bold text-lg">Ready in ~{currentOrder.estimatedTime} mins</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-6">
                        We&apos;ll notify you when it&apos;s ready!
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {step !== 'success' && items.length > 0 && (
              <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm safe-area-bottom">
                {step === 'cart' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-xl font-bold">Rs.{totalAmount}</span>
                    </div>
                    <Button 
                      className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20" 
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                  </div>
                )}

                {step === 'confirm' && (
                  <Button 
                    className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent shadow-lg shadow-accent/20" 
                    onClick={handlePlaceOrder}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Place Order - Rs.{totalAmount}
                  </Button>
                )}
              </div>
            )}

            {step === 'success' && (
              <div className="p-4 border-t border-border/50 safe-area-bottom">
                <Button 
                  className="w-full h-12 text-base font-semibold rounded-xl" 
                  onClick={handleClose}
                >
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
