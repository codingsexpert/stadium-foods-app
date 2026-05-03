'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { User, Heart, Star, LogOut, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/lib/user-context'
import { useState } from 'react'

interface UserAvatarProps {
  onOpenProfile: () => void
  onOpenFavorites: () => void
}

export function UserAvatar({ onOpenProfile, onOpenFavorites }: UserAvatarProps) {
  const { user, isProfileSetup, logout } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  if (!isProfileSetup || !user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onOpenProfile}
        className="rounded-full gap-2"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Set Up Profile</span>
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <div className={`w-7 h-7 rounded-full ${user.avatarColor} flex items-center justify-center`}>
            <span className="text-xs font-bold text-white">{user.initials}</span>
          </div>
          <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
            {user.displayName}
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center`}>
              <span className="text-sm font-bold text-white">{user.initials}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{user.displayName}</span>
              <span className="text-xs text-muted-foreground">
                {user.ratingHistory.length} ratings
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onOpenFavorites} className="cursor-pointer">
          <Heart className="w-4 h-4 mr-2 text-red-500" />
          <span>My Favorites</span>
          {user.favorites.length > 0 && (
            <span className="ml-auto text-xs bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full">
              {user.favorites.length}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenProfile} className="cursor-pointer">
          <Star className="w-4 h-4 mr-2 text-yellow-500" />
          <span>Rating History</span>
          {user.ratingHistory.length > 0 && (
            <span className="ml-auto text-xs bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded-full">
              {user.ratingHistory.length}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenProfile} className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          <span>Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
