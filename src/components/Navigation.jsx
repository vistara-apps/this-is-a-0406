import React from 'react'
import { Home, BookOpen, Mic, Share2, Settings } from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'rights', label: 'Know My Rights', icon: BookOpen },
  { id: 'record', label: 'Record', icon: Mic },
  { id: 'share', label: 'Share', icon: Share2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Navigation({ mobile = false, onNavigate }) {
  const { state, dispatch } = useApp()

  const handleNavClick = (viewId) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: viewId })
    if (onNavigate) onNavigate()
  }

  if (mobile) {
    return (
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = state.currentView === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = state.currentView === item.id
        
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-white/20 text-white' 
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden lg:block font-medium">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}