import React, { useState } from 'react'
import { MapPin, Globe, Bell, Shield, CreditCard, User, ChevronRight, Check } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import StateSelector from '../StateSelector'
import LanguageSwitcher from '../LanguageSwitcher'
import { useApp } from '../../context/AppContext'

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]

export default function SettingsView() {
  const { state, dispatch } = useApp()
  const [activeSection, setActiveSection] = useState(null)
  const [notifications, setNotifications] = useState({
    legal_updates: true,
    location_reminders: false,
    emergency_alerts: true
  })

  const updateUserState = (newState) => {
    dispatch({ type: 'SET_USER_STATE', payload: newState })
    localStorage.setItem('knowyourrights_user_state', newState)
  }

  const updateUserLanguage = (newLanguage) => {
    dispatch({ type: 'SET_USER_LANGUAGE', payload: newLanguage })
    localStorage.setItem('knowyourrights_user_language', newLanguage)
  }

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSubscribe = () => {
    // In a real app, this would integrate with Stripe
    alert('Subscription functionality would be implemented here with Stripe integration')
  }

  const settingSections = [
    {
      id: 'location',
      title: 'Location & State',
      description: `Currently set to ${state.user.state}`,
      icon: MapPin,
      component: (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Select your state to get accurate, jurisdiction-specific legal information.
          </p>
          <StateSelector 
            states={US_STATES}
            selectedState={state.user.state}
            onStateSelect={updateUserState}
          />
        </div>
      )
    },
    {
      id: 'language',
      title: 'Language',
      description: 'App language and content',
      icon: Globe,
      component: (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Choose your preferred language for the app interface and legal content.
          </p>
          <LanguageSwitcher 
            selectedLanguage={state.user.language}
            onLanguageSelect={updateUserLanguage}
          />
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your alert preferences',
      icon: Bell,
      component: (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Control what notifications you receive from the app.
          </p>
          <div className="space-y-3">
            {Object.entries({
              legal_updates: 'Legal updates and changes',
              location_reminders: 'Location-based reminders',
              emergency_alerts: 'Emergency safety alerts'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">{label}</span>
                <button
                  onClick={() => toggleNotification(key)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications[key] ? 'bg-accent' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications[key] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'subscription',
      title: 'Subscription',
      description: state.user.subscriptionStatus === 'free' ? 'Free Plan' : 'Premium Plan',
      icon: CreditCard,
      component: (
        <div className="space-y-4">
          <div className="text-center">
            {state.user.subscriptionStatus === 'free' ? (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Upgrade to Premium</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Get unlimited access to all features, offline content, and priority support.
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                  <div className="text-3xl font-bold text-primary mb-1">$2.99</div>
                  <div className="text-gray-600 text-sm">per month</div>
                </div>
                <Button variant="primary" onClick={handleSubscribe} className="w-full">
                  Subscribe Now
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center space-x-2 text-accent mb-4">
                  <Check className="h-5 w-5" />
                  <span className="font-semibold">Premium Active</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  You have access to all premium features including offline content and unlimited downloads.
                </p>
                <Button variant="secondary" className="w-full">
                  Manage Subscription
                </Button>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h5 className="font-medium text-gray-900 mb-2">Premium Features</h5>
            <div className="space-y-2">
              {[
                'Unlimited offline downloads',
                'Advanced recording features',
                'Priority customer support',
                'Extended language support',
                'Legal document templates'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-accent" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-white/80">Customize your experience</p>
      </div>

      {/* Settings List */}
      <div className="space-y-4">
        {settingSections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          
          return (
            <Card key={section.id} className="overflow-hidden">
              <button
                onClick={() => setActiveSection(isActive ? null : section.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    <p className="text-gray-600 text-sm">{section.description}</p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${
                  isActive ? 'rotate-90' : ''
                }`} />
              </button>
              
              {isActive && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4">
                    {section.component}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* App Information */}
      <Card className="p-6 text-center">
        <h3 className="font-semibold text-gray-900 mb-2">KnowYourRights</h3>
        <p className="text-gray-600 text-sm mb-2">Version 1.0.0</p>
        <p className="text-gray-500 text-xs">
          Empowering citizens with legal knowledge for safer interactions with law enforcement.
        </p>
      </Card>

      {/* Reset App Data */}
      <Card className="p-6">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Reset App Data</h3>
          <p className="text-gray-600 text-sm mb-4">
            This will clear all your settings and return the app to its initial state.
          </p>
          <Button 
            variant="secondary" 
            onClick={() => {
              if (confirm('Are you sure you want to reset all app data? This cannot be undone.')) {
                localStorage.clear()
                window.location.reload()
              }
            }}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Reset App Data
          </Button>
        </div>
      </Card>
    </div>
  )
}