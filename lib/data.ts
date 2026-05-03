import { FoodItem, FoodStall, Review, TrendingItem, LeaderboardUser, StallPosition } from './types'

export const foodStalls: FoodStall[] = [
  {
    id: '1',
    name: 'Sharma Ji Chaat Corner',
    location: 'Gate A - Near Entry',
    section: 'North Stand',
    cuisine: 'Indian Street Food',
    image: '/stalls/chaat.jpg',
    isOpen: true,
    waitTime: 5,
    items: []
  },
  {
    id: '2',
    name: 'Dragon Wok',
    location: 'Gate B - Food Court',
    section: 'East Stand',
    cuisine: 'Chinese',
    image: '/stalls/chinese.jpg',
    isOpen: true,
    waitTime: 8,
    items: []
  },
  {
    id: '3',
    name: 'Pizza Point',
    location: 'Gate C - Level 2',
    section: 'South Stand',
    cuisine: 'Italian',
    image: '/stalls/pizza.jpg',
    isOpen: true,
    waitTime: 12,
    items: []
  },
  {
    id: '4',
    name: 'Desi Dhaba',
    location: 'Gate A - Main Area',
    section: 'North Stand',
    cuisine: 'North Indian',
    image: '/stalls/dhaba.jpg',
    isOpen: true,
    waitTime: 15,
    items: []
  },
  {
    id: '5',
    name: 'Burger Barn',
    location: 'Gate D - Corner',
    section: 'West Stand',
    cuisine: 'American',
    image: '/stalls/burger.jpg',
    isOpen: true,
    waitTime: 10,
    items: []
  },
  {
    id: '6',
    name: 'Fresh Sips',
    location: 'Gate A - Near Seats',
    section: 'North Stand',
    cuisine: 'Beverages',
    image: '/stalls/drinks.jpg',
    isOpen: true,
    waitTime: 3,
    items: []
  },
  {
    id: '7',
    name: 'Sweet Tooth',
    location: 'Gate B - Level 1',
    section: 'East Stand',
    cuisine: 'Desserts',
    image: '/stalls/desserts.jpg',
    isOpen: true,
    waitTime: 5,
    items: []
  },
  {
    id: '8',
    name: 'Green Bowl',
    location: 'Gate C - Health Zone',
    section: 'South Stand',
    cuisine: 'Healthy',
    image: '/stalls/healthy.jpg',
    isOpen: true,
    waitTime: 7,
    items: []
  }
]

export const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Loaded Vada Pav',
    price: 80,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    description: 'Crispy vada with spicy chutneys and cheese',
    stallId: '1',
    stallName: 'Sharma Ji Chaat Corner',
    rating: 4.8,
    totalRatings: 234,
    tags: ['Vegetarian', 'Spicy', 'Popular']
  },
  {
    id: '2',
    name: 'Pani Puri Shots',
    price: 60,
    image: 'https://images.unsplash.com/photo-1626132647523-66d0502e7e28?w=400&h=300&fit=crop',
    description: 'Classic golgappe with tangy pani',
    stallId: '1',
    stallName: 'Sharma Ji Chaat Corner',
    rating: 4.6,
    totalRatings: 189,
    tags: ['Vegetarian', 'Tangy']
  },
  {
    id: '3',
    name: 'Chicken Momos',
    price: 120,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop',
    description: 'Steamed dumplings with fiery red chutney',
    stallId: '2',
    stallName: 'Dragon Wok',
    rating: 4.5,
    totalRatings: 156,
    tags: ['Non-Veg', 'Steamed']
  },
  {
    id: '4',
    name: 'Schezwan Noodles',
    price: 150,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    description: 'Spicy hakka noodles with veggies',
    stallId: '2',
    stallName: 'Dragon Wok',
    rating: 4.3,
    totalRatings: 98,
    tags: ['Vegetarian', 'Spicy']
  },
  {
    id: '5',
    name: 'Pepperoni Pizza Slice',
    price: 180,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
    description: 'Wood-fired pizza with pepperoni',
    stallId: '3',
    stallName: 'Pizza Point',
    rating: 4.4,
    totalRatings: 145,
    tags: ['Non-Veg', 'Cheesy']
  },
  {
    id: '6',
    name: 'Butter Chicken Bowl',
    price: 220,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    description: 'Creamy butter chicken with rice',
    stallId: '4',
    stallName: 'Desi Dhaba',
    rating: 4.7,
    totalRatings: 203,
    tags: ['Non-Veg', 'Creamy', 'Popular']
  },
  {
    id: '7',
    name: 'Paneer Tikka',
    price: 180,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
    description: 'Grilled cottage cheese with spices',
    stallId: '4',
    stallName: 'Desi Dhaba',
    rating: 4.5,
    totalRatings: 167,
    tags: ['Vegetarian', 'Grilled']
  },
  {
    id: '8',
    name: 'Classic Smash Burger',
    price: 250,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    description: 'Double patty with cheese and sauce',
    stallId: '5',
    stallName: 'Burger Barn',
    rating: 4.6,
    totalRatings: 178,
    tags: ['Non-Veg', 'Cheesy', 'Popular']
  },
  // Drinks
  {
    id: '9',
    name: 'Mango Lassi',
    price: 80,
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop',
    description: 'Creamy mango yogurt drink',
    stallId: '6',
    stallName: 'Fresh Sips',
    rating: 4.7,
    totalRatings: 142,
    tags: ['Vegetarian', 'Sweet', 'Refreshing']
  },
  {
    id: '10',
    name: 'Masala Chai',
    price: 40,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    description: 'Authentic spiced Indian tea',
    stallId: '6',
    stallName: 'Fresh Sips',
    rating: 4.8,
    totalRatings: 298,
    tags: ['Vegetarian', 'Hot', 'Popular']
  },
  {
    id: '11',
    name: 'Fresh Lime Soda',
    price: 50,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
    description: 'Refreshing lime with a hint of mint',
    stallId: '6',
    stallName: 'Fresh Sips',
    rating: 4.4,
    totalRatings: 167,
    tags: ['Vegetarian', 'Refreshing']
  },
  // Desserts
  {
    id: '12',
    name: 'Kulfi Falooda',
    price: 120,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=300&fit=crop',
    description: 'Traditional Indian ice cream with vermicelli',
    stallId: '7',
    stallName: 'Sweet Tooth',
    rating: 4.6,
    totalRatings: 134,
    tags: ['Vegetarian', 'Sweet', 'Cold']
  },
  {
    id: '13',
    name: 'Gulab Jamun',
    price: 60,
    image: 'https://images.unsplash.com/photo-1666190401411-6cbc98cbc26c?w=400&h=300&fit=crop',
    description: 'Soft milk dumplings in sugar syrup',
    stallId: '7',
    stallName: 'Sweet Tooth',
    rating: 4.5,
    totalRatings: 189,
    tags: ['Vegetarian', 'Sweet', 'Hot']
  },
  {
    id: '14',
    name: 'Chocolate Brownie',
    price: 90,
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop',
    description: 'Rich fudgy brownie with ice cream',
    stallId: '7',
    stallName: 'Sweet Tooth',
    rating: 4.7,
    totalRatings: 156,
    tags: ['Vegetarian', 'Sweet', 'Popular']
  },
  // Healthy
  {
    id: '15',
    name: 'Greek Salad Bowl',
    price: 180,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    description: 'Fresh veggies with feta and olives',
    stallId: '8',
    stallName: 'Green Bowl',
    rating: 4.3,
    totalRatings: 87,
    tags: ['Vegetarian', 'Healthy', 'Fresh']
  },
  {
    id: '16',
    name: 'Grilled Chicken Wrap',
    price: 200,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
    description: 'Protein-packed wrap with veggies',
    stallId: '8',
    stallName: 'Green Bowl',
    rating: 4.5,
    totalRatings: 112,
    tags: ['Non-Veg', 'Healthy', 'Grilled']
  },
  {
    id: '17',
    name: 'Fruit Bowl',
    price: 120,
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop',
    description: 'Seasonal fresh fruits with honey',
    stallId: '8',
    stallName: 'Green Bowl',
    rating: 4.6,
    totalRatings: 98,
    tags: ['Vegetarian', 'Healthy', 'Fresh']
  },
  // More snacks
  {
    id: '18',
    name: 'Cheese Burst Pizza',
    price: 220,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    description: 'Loaded cheese pizza with herbs',
    stallId: '3',
    stallName: 'Pizza Point',
    rating: 4.5,
    totalRatings: 167,
    tags: ['Vegetarian', 'Cheesy', 'Popular']
  },
  {
    id: '19',
    name: 'Crispy French Fries',
    price: 100,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    description: 'Golden fries with seasoning',
    stallId: '5',
    stallName: 'Burger Barn',
    rating: 4.4,
    totalRatings: 234,
    tags: ['Vegetarian', 'Crispy', 'Quick']
  },
  {
    id: '20',
    name: 'Tandoori Wings',
    price: 180,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop',
    description: 'Spicy grilled chicken wings',
    stallId: '4',
    stallName: 'Desi Dhaba',
    rating: 4.7,
    totalRatings: 189,
    tags: ['Non-Veg', 'Spicy', 'Grilled', 'Popular']
  }
]

export const recentReviews: Review[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Rahul M.',
    userAvatar: 'https://i.pravatar.cc/100?img=1',
    itemId: '1',
    itemName: 'Loaded Vada Pav',
    stallName: 'Sharma Ji Chaat Corner',
    rating: 5,
    comment: 'Best vada pav in the stadium! The cheese adds an amazing twist. Must try!',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    sentiment: 'positive'
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Priya S.',
    userAvatar: 'https://i.pravatar.cc/100?img=5',
    itemId: '3',
    itemName: 'Chicken Momos',
    stallName: 'Dragon Wok',
    rating: 4,
    comment: 'Good momos but the wait time was too long. Chutney is fire though!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    sentiment: 'positive'
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Amit K.',
    userAvatar: 'https://i.pravatar.cc/100?img=3',
    itemId: '6',
    itemName: 'Butter Chicken Bowl',
    stallName: 'Desi Dhaba',
    rating: 5,
    comment: 'Unbelievable flavor! Creamy, rich, and perfectly spiced. Worth every rupee.',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    sentiment: 'positive'
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'Sneha R.',
    userAvatar: 'https://i.pravatar.cc/100?img=9',
    itemId: '5',
    itemName: 'Pepperoni Pizza',
    stallName: 'Pizza Point',
    rating: 3,
    comment: 'Pizza was okay, slightly cold. Expected better for the price.',
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    sentiment: 'neutral'
  },
  {
    id: '5',
    userId: 'u5',
    userName: 'Vikram T.',
    userAvatar: 'https://i.pravatar.cc/100?img=8',
    itemId: '2',
    itemName: 'Pani Puri Shots',
    stallName: 'Sharma Ji Chaat Corner',
    rating: 5,
    comment: 'Perfect during the match break! Fresh and tangy. 10/10 recommend!',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    sentiment: 'positive'
  }
]

export const trendingItems: TrendingItem[] = [
  {
    item: foodItems[0],
    trendScore: 98,
    recentRatings: 45,
    sentiment: 'hot'
  },
  {
    item: foodItems[5],
    trendScore: 92,
    recentRatings: 38,
    sentiment: 'hot'
  },
  {
    item: foodItems[9], // Masala Chai
    trendScore: 90,
    recentRatings: 42,
    sentiment: 'hot'
  },
  {
    item: foodItems[7], // Classic Smash Burger
    trendScore: 85,
    recentRatings: 28,
    sentiment: 'rising'
  },
  {
    item: foodItems[13], // Chocolate Brownie
    trendScore: 82,
    recentRatings: 25,
    sentiment: 'rising'
  },
  {
    item: foodItems[19], // Tandoori Wings
    trendScore: 78,
    recentRatings: 22,
    sentiment: 'rising'
  }
]

export const leaderboardUsers: LeaderboardUser[] = [
  {
    id: 'l1',
    name: 'Arjun Sharma',
    avatar: 'https://i.pravatar.cc/100?img=11',
    points: 2850,
    totalReviews: 89,
    badge: 'Champion',
    rank: 1,
    weeklyPoints: 420,
    monthlyPoints: 1250
  },
  {
    id: 'l2',
    name: 'Priya Patel',
    avatar: 'https://i.pravatar.cc/100?img=5',
    points: 2340,
    totalReviews: 72,
    badge: 'Legend',
    rank: 2,
    weeklyPoints: 380,
    monthlyPoints: 980
  },
  {
    id: 'l3',
    name: 'Vikram Singh',
    avatar: 'https://i.pravatar.cc/100?img=8',
    points: 1980,
    totalReviews: 61,
    badge: 'Legend',
    rank: 3,
    weeklyPoints: 290,
    monthlyPoints: 820
  },
  {
    id: 'l4',
    name: 'Sneha Gupta',
    avatar: 'https://i.pravatar.cc/100?img=9',
    points: 1650,
    totalReviews: 48,
    badge: 'Critic',
    rank: 4,
    weeklyPoints: 220,
    monthlyPoints: 680
  },
  {
    id: 'l5',
    name: 'Rahul Mehra',
    avatar: 'https://i.pravatar.cc/100?img=1',
    points: 1420,
    totalReviews: 42,
    badge: 'Critic',
    rank: 5,
    weeklyPoints: 185,
    monthlyPoints: 520
  },
  {
    id: 'l6',
    name: 'Anjali Reddy',
    avatar: 'https://i.pravatar.cc/100?img=23',
    points: 1180,
    totalReviews: 35,
    badge: 'Critic',
    rank: 6,
    weeklyPoints: 150,
    monthlyPoints: 420
  },
  {
    id: 'l7',
    name: 'Karan Kapoor',
    avatar: 'https://i.pravatar.cc/100?img=12',
    points: 890,
    totalReviews: 28,
    badge: 'Foodie',
    rank: 7,
    weeklyPoints: 120,
    monthlyPoints: 340
  },
  {
    id: 'l8',
    name: 'Neha Sharma',
    avatar: 'https://i.pravatar.cc/100?img=25',
    points: 720,
    totalReviews: 22,
    badge: 'Foodie',
    rank: 8,
    weeklyPoints: 95,
    monthlyPoints: 280
  },
  {
    id: 'l9',
    name: 'Amit Kumar',
    avatar: 'https://i.pravatar.cc/100?img=3',
    points: 580,
    totalReviews: 18,
    badge: 'Foodie',
    rank: 9,
    weeklyPoints: 75,
    monthlyPoints: 210
  },
  {
    id: 'l10',
    name: 'Divya Nair',
    avatar: 'https://i.pravatar.cc/100?img=26',
    points: 420,
    totalReviews: 14,
    badge: 'Foodie',
    rank: 10,
    weeklyPoints: 60,
    monthlyPoints: 150
  }
]

export const stallPositions: StallPosition[] = [
  { stallId: '1', x: 20, y: 15, section: 'north' },
  { stallId: '2', x: 80, y: 30, section: 'east' },
  { stallId: '3', x: 75, y: 70, section: 'south' },
  { stallId: '4', x: 25, y: 25, section: 'north' },
  { stallId: '5', x: 15, y: 60, section: 'west' },
  { stallId: '6', x: 30, y: 10, section: 'north' },
  { stallId: '7', x: 85, y: 45, section: 'east' },
  { stallId: '8', x: 70, y: 85, section: 'south' }
]
