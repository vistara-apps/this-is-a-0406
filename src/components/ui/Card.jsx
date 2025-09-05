import React from 'react'

export default function Card({ children, className = '', variant = 'default', ...props }) {
  const baseClasses = 'bg-white rounded-lg shadow-card border border-gray-200'
  
  const variantClasses = {
    default: '',
    highlighted: 'border-primary/20 bg-primary/5'
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}