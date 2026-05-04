'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, X, Sparkles, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hey there! I'm your StadiumBite AI assistant. Ask me for food recommendations, what's trending, or help finding something specific!"
      }
    ]
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const quickPrompts = [
    "What's trending right now?",
    "Best vegetarian options?",
    "Something quick to grab",
    "Top rated items"
  ]

  return (
    <>
      {/* Floating Button - Positioned above mobile nav */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[72px] sm:bottom-20 md:bottom-6 right-3 sm:right-4 md:right-6 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center z-30 ${isOpen ? 'hidden' : ''}`}
      >
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed inset-2 sm:inset-3 bottom-[72px] sm:bottom-20 md:inset-auto md:bottom-6 md:right-6 md:w-[380px] md:max-h-[600px] glass-card rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col"
            >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-primary/5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm">StadiumBite AI</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Powered by Gemini</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="w-7 h-7 sm:w-8 sm:h-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[350px] sm:max-h-[400px]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-primary/20' 
                      : 'bg-accent/20'
                  }`}>
                    {message.role === 'user' 
                      ? <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      : <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                    }
                  </div>
                  <div className={`max-w-[80%] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-secondary rounded-tl-sm'
                  }`}>
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 sm:gap-3"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-accent/20 flex items-center justify-center">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-secondary rounded-tl-sm">
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-muted-foreground" />
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="px-3 sm:px-4 pb-2">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        handleInputChange({ target: { value: prompt } } as any)
                        setTimeout(() => {
                          const form = document.querySelector('form') as HTMLFormElement
                          form?.requestSubmit()
                        }, 100)
                      }}
                      className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about food..."
                  className="flex-1 bg-secondary border-border text-sm h-9 sm:h-10"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="w-9 h-9 sm:w-10 sm:h-10">
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
