export interface FoodStall {
  id: string
  name: string
  location: string
  section: string
  cuisine: string
  image: string
  isOpen: boolean
  waitTime: number
  items: FoodItem[]
}

export interface FoodItem {
  id: string
  name: string
  price: number
  image: string
  description: string
  stallId: string
  stallName: string
  rating: number
  totalRatings: number
  tags: string[]
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  itemId: string
  itemName: string
  stallName: string
  rating: number
  comment: string
  image?: string
  timestamp: Date
  sentiment?: 'positive' | 'negative' | 'neutral'
  aiSummary?: string
}

export interface TrendingItem {
  item: FoodItem
  trendScore: number
  recentRatings: number
  sentiment: 'rising' | 'hot' | 'stable'
}

export interface UserStats {
  totalReviews: number
  badge: 'Foodie' | 'Critic' | 'Legend'
  points: number
}

// Cart & Order Types
export interface CartItem {
  item: FoodItem
  quantity: number
  specialInstructions?: string
}

export interface Order {
  id: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered'
  orderTime: Date
  estimatedTime: number
  pickupLocation: string
}

// Leaderboard Types
export interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  points: number
  totalReviews: number
  badge: 'Foodie' | 'Critic' | 'Legend' | 'Champion'
  rank: number
  weeklyPoints: number
  monthlyPoints: number
}

// Stadium Map Types
export interface StallPosition {
  stallId: string
  x: number
  y: number
  section: 'north' | 'south' | 'east' | 'west'
}

// Notification Types
export interface AppNotification {
  id: string
  type: 'review' | 'order' | 'deal' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}
