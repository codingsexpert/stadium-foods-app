'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Order, FoodItem } from './types'

interface CartContextType {
  items: CartItem[]
  orders: Order[]
  addToCart: (item: FoodItem, quantity?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalAmount: number
  placeOrder: (pickupLocation: string) => Order
  getOrderById: (orderId: string) => Order | undefined
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('stadium-cart')
    const savedOrders = localStorage.getItem('stadium-orders')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders, (key, value) => {
        if (key === 'orderTime') return new Date(value)
        return value
      }))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('stadium-cart', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('stadium-orders', JSON.stringify(orders))
  }, [orders])

  const addToCart = (item: FoodItem, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.item.id === item.id)
      if (existing) {
        return prev.map(i => 
          i.item.id === item.id 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { item, quantity }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(i => i.item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setItems(prev => prev.map(i => 
      i.item.id === itemId ? { ...i, quantity } : i
    ))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalAmount = items.reduce((sum, i) => sum + (i.item.price * i.quantity), 0)

  const placeOrder = (pickupLocation: string): Order => {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: [...items],
      totalAmount,
      status: 'confirmed',
      orderTime: new Date(),
      estimatedTime: Math.max(...items.map(i => {
        // Get wait time from stall
        return 10 // Default 10 mins
      })) + 5,
      pickupLocation
    }
    
    setOrders(prev => [order, ...prev])
    clearCart()
    
    // Simulate order status updates
    setTimeout(() => {
      setOrders(prev => prev.map(o => 
        o.id === order.id ? { ...o, status: 'preparing' } : o
      ))
    }, 5000)
    
    setTimeout(() => {
      setOrders(prev => prev.map(o => 
        o.id === order.id ? { ...o, status: 'ready' } : o
      ))
    }, 15000)
    
    return order
  }

  const getOrderById = (orderId: string) => orders.find(o => o.id === orderId)

  return (
    <CartContext.Provider value={{
      items,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
      placeOrder,
      getOrderById
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
