import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  icon?: React.ReactNode
}

export function Button({ 
  children, 
  variant = 'primary', 
  icon, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center gap-2.5 font-semibold py-3.5 px-9 rounded-2xl cursor-pointer overflow-hidden z-10 transition-all duration-300 ease-out active:translate-y-0.5'
  
  const variantClasses = {
    primary: 'text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-[0_10px_20px_-10px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 hover:shadow-[0_15px_25px_-8px_rgba(99,102,241,0.5),0_0_30px_-5px_rgba(168,85,247,0.4)]',
    secondary: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 dark:border-indigo-500/30 hover:-translate-y-0.5'
  }

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </button>
  )
}

export default Button
