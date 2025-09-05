import React, { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

export default function StateSelector({ states, selectedState, onStateSelect, variant = 'dropdown' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStates = states.filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStateClick = (state) => {
    onStateSelect(state)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-left hover:bg-white/20 transition-colors"
      >
        <span className={selectedState ? 'text-white' : 'text-white/60'}>
          {selectedState || 'Select your state...'}
        </span>
        <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* States List */}
          <div className="max-h-40 overflow-y-auto">
            {filteredStates.map((state) => (
              <button
                key={state}
                onClick={() => handleStateClick(state)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-900 border-b border-gray-100 last:border-b-0"
              >
                {state}
              </button>
            ))}
          </div>

          {filteredStates.length === 0 && (
            <div className="px-4 py-3 text-gray-500 text-center">
              No states found
            </div>
          )}
        </div>
      )}
    </div>
  )
}