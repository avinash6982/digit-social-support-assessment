import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
}

export function Card({ children, className = '', hoverable = true }: CardProps) {
  return (
    <div 
      className={`
        relative w-full max-w-[580px] p-8 md:p-12 rounded-[32px] text-center overflow-hidden z-10
        border border-white/10 dark:border-white/5 
        bg-white/70 dark:bg-[#111329]/50 backdrop-blur-3xl 
        shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7),0_0_50px_-10px_rgba(99,102,241,0.25)]
        transition-all duration-500 ease-out neon-border
        ${hoverable ? 'hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.3)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card
