import React from 'react'

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg focus:ring-primary',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 px-4 py-2 rounded-lg focus:ring-gray-500',
    icon: 'p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus:ring-gray-500'
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  return (
    <button 
      className={classes} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}