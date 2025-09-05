import React from 'react'
import { Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Navigation from './Navigation'

export default function AppShell({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Header */}
      <header className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">KnowYourRights</h1>
                <p className="text-xs text-white/80 hidden sm:block">Instant legal clarity</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <Navigation />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
            <div className="px-4 py-4">
              <Navigation mobile onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}