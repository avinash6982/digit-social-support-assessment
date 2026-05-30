import React from 'react'

type TextVariant = 'h1' | 'h2' | 'body' | 'label' | 'value'

interface TextProps {
  variant?: TextVariant
  children: React.ReactNode
  className?: string
}

export function Text({ variant = 'body', children, className = '' }: TextProps) {
  switch (variant) {
    case 'h1':
      return (
        <h1 
          className={`
            text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4
            bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-400 bg-clip-text text-transparent
            ${className}
          `}
        >
          {children}
        </h1>
      )
    case 'h2':
      return (
        <h2 
          className={`
            text-xl md:text-2xl font-bold tracking-tight mb-2
            text-slate-800 dark:text-slate-200
            ${className}
          `}
        >
          {children}
        </h2>
      )
    case 'body':
      return (
        <p 
          className={`
            text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-[480px] mx-auto mb-8
            ${className}
          `}
        >
          {children}
        </p>
      )
    case 'label':
      return (
        <span 
          className={`
            text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500
            ${className}
          `}
        >
          {children}
        </span>
      )
    case 'value':
      return (
        <span 
          className={`
            text-sm md:text-base font-bold text-slate-800 dark:text-white
            ${className}
          `}
        >
          {children}
        </span>
      )
    default:
      return <span className={className}>{children}</span>
  }
}

export default Text
