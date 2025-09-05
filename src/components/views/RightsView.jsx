import React, { useState } from 'react'
import { BookOpen, Copy, Share2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'

const rightsData = {
  'traffic-stop': {
    title: 'Traffic Stop Rights',
    icon: '🚗',
    essentials: [
      'You have the right to remain silent',
      'You must provide driver\'s license, registration, and insurance',
      'You do not have to consent to vehicle searches',
      'You have the right to ask if you are free to leave'
    ],
    scripts: {
      polite_compliance: 'Officer, I am exercising my right to remain silent. I do not consent to any searches. Am I free to leave?',
      search_refusal: 'I do not consent to a search of my vehicle. I am invoking my Fourth Amendment rights.',
      detention_inquiry: 'Officer, am I being detained or am I free to go?'
    },
    warnings: [
      'Keep hands visible at all times',
      'Do not argue or resist, even if you believe the stop is unlawful',
      'Remember officer badge numbers and patrol car numbers'
    ]
  },
  'pedestrian-stop': {
    title: 'Pedestrian Stop Rights',
    icon: '🚶',
    essentials: [
      'You have the right to remain silent',
      'You have the right to ask if you are being detained',
      'You generally do not have to show ID unless under arrest',
      'You do not have to consent to searches'
    ],
    scripts: {
      detention_inquiry: 'Officer, am I being detained or am I free to go?',
      search_refusal: 'I do not consent to any searches. I am exercising my Fourth Amendment rights.',
      silence_invocation: 'I am invoking my right to remain silent. I want to speak to a lawyer.'
    },
    warnings: [
      'Keep hands visible and move slowly',
      'Do not run or make sudden movements',
      'State laws vary on ID requirements'
    ]
  },
  'home-visit': {
    title: 'Home Visit Rights',
    icon: '🏠',
    essentials: [
      'Police need a warrant to enter your home',
      'You do not have to let them in without a warrant',
      'You have the right to see the warrant',
      'You can speak through the door'
    ],
    scripts: {
      warrant_request: 'Do you have a warrant? I do not consent to entry without a warrant.',
      door_communication: 'I prefer to speak through the door. Do you have a warrant?',
      warrant_inspection: 'May I see the warrant? I want to verify it covers this address.'
    },
    warnings: [
      'Exigent circumstances may allow warrantless entry',
      'Do not physically resist',
      'Document everything that happens'
    ]
  }
}

export default function RightsView() {
  const { state } = useApp()
  const [selectedCategory, setSelectedCategory] = useState('traffic-stop')
  const [expandedSections, setExpandedSections] = useState({})
  const [copiedScript, setCopiedScript] = useState('')

  const currentRights = rightsData[selectedCategory]

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const copyScript = async (script, scriptKey) => {
    try {
      await navigator.clipboard.writeText(script)
      setCopiedScript(scriptKey)
      setTimeout(() => setCopiedScript(''), 2000)
    } catch (err) {
      console.error('Failed to copy script:', err)
    }
  }

  const shareRights = () => {
    const text = `Know Your Rights - ${currentRights.title}\n\nKey Scripts:\n${Object.values(currentRights.scripts).join('\n')}\n\nGet the full app: KnowYourRights`
    
    if (navigator.share) {
      navigator.share({
        title: `${currentRights.title} - KnowYourRights`,
        text: text
      })
    } else {
      copyScript(text, 'share')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Know Your Rights</h1>
        <p className="text-white/80">State-specific guidance for {state.user.state}</p>
      </div>

      {/* Category Selector */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(rightsData).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCategory === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-2xl mb-2">{data.icon}</div>
              <div className="font-medium text-sm">{data.title}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Essential Rights */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Essential Rights</span>
          </h3>
          <Button variant="icon" onClick={shareRights}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {currentRights.essentials.map((right, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">{right}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Scripts Section */}
      <Card className="p-6">
        <button
          onClick={() => toggleSection('scripts')}
          className="w-full flex items-center justify-between mb-4"
        >
          <h3 className="font-semibold text-gray-900">What to Say - Ready Scripts</h3>
          {expandedSections.scripts ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        
        {expandedSections.scripts && (
          <div className="space-y-4">
            {Object.entries(currentRights.scripts).map(([key, script]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2 capitalize">
                      {key.replace('_', ' ')}
                    </h4>
                    <p className="text-gray-700 italic">"{script}"</p>
                  </div>
                  <Button 
                    variant="icon" 
                    onClick={() => copyScript(script, key)}
                    className={copiedScript === key ? 'text-accent' : ''}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Warnings */}
      <Card className="p-6 bg-orange-50 border border-orange-200">
        <button
          onClick={() => toggleSection('warnings')}
          className="w-full flex items-center justify-between mb-4"
        >
          <h3 className="font-semibold text-orange-900 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Important Warnings</span>
          </h3>
          {expandedSections.warnings ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        
        {expandedSections.warnings && (
          <div className="space-y-3">
            {currentRights.warnings.map((warning, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-orange-800">{warning}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Disclaimer */}
      <Card className="p-4 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          This information is for educational purposes only and does not constitute legal advice. 
          Laws vary by jurisdiction. Consult with a qualified attorney for specific legal guidance.
        </p>
      </Card>
    </div>
  )
}