import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  disabled = false,
  type = 'button',
  className,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50',
    secondary: 'glass-effect text-white hover:bg-white/10',
    ghost: 'text-white hover:bg-white/5',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  )
}
