import React from 'react'

interface ChipProps {
  children: React.ReactNode
  className?: string
  dot?: boolean
  dotColor?: 'primary' | 'secondary' | 'tertiary' | 'teal'
}

export function Chip({ 
  children, 
  className = '', 
  dot = false, 
  dotColor = 'teal' 
}: ChipProps) {
  
  const dotColorClasses = {
    primary: 'bg-indigo-500 shadow-[0_0_10px_#6366f1]',
    secondary: 'bg-purple-500 shadow-[0_0_10px_#a855f7]',
    tertiary: 'bg-teal-500 shadow-[0_0_10px_#14b8a6]',
    teal: 'bg-teal-400 shadow-[0_0_10px_#2dd4bf]'
  }

  return (
    <div 
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider
        text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 dark:border-indigo-500/30 
        transition-all duration-300 hover:scale-105 hover:bg-indigo-500/15 dark:hover:bg-indigo-500/25
        ${className}
      `}
    >
      {dot && (
        <span 
          className={`w-2 h-2 rounded-full inline-block animate-[pulse_1.8s_infinite] ${dotColorClasses[dotColor]}`}
          style={{
            animation: 'pulse 1.8s infinite'
          }}
        ></span>
      )}
      <span>{children}</span>
    </div>
  )
}

export default Chip
