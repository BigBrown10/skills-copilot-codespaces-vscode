import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={clsx(
        'glass-card transition-all duration-300',
        hover && 'hover:shadow-2xl hover:shadow-blue-500/20',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
