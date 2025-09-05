import React, { useState } from 'react'
import { MapPin, Globe, ArrowRight } from 'lucide-react'
import StateSelector from './StateSelector'
import LanguageSwitcher from './LanguageSwitcher'

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [selectedState, setSelectedState] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  const handleStateSelect = (state) => {
    setSelectedState(state)
  }

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language)
  }

  const handleNext = () => {
    if (step === 1 && selectedState) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleComplete = () => {
    onComplete({
      state: selectedState,
      language: selectedLanguage
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Welcome Step */}
        {step === 1 && (
          <div className="glass-effect rounded-lg p-6 text-center text-white">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to KnowYourRights</h2>
              <p className="text-white/80 mb-6">
                Get instant, state-specific guidance for law enforcement interactions
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-4">Select Your State</h3>
              <StateSelector 
                states={US_STATES}
                selectedState={selectedState}
                onStateSelect={handleStateSelect}
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!selectedState}
              className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-accent/90 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Language Step */}
        {step === 2 && (
          <div className="glass-effect rounded-lg p-6 text-center text-white">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Choose Your Language</h2>
              <p className="text-white/80 mb-6">
                Select your preferred language for legal information
              </p>
            </div>

            <div className="mb-6">
              <LanguageSwitcher 
                selectedLanguage={selectedLanguage}
                onLanguageSelect={handleLanguageSelect}
              />
            </div>

            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Final Step */}
        {step === 3 && (
          <div className="glass-effect rounded-lg p-6 text-center text-white">
            <div className="mb-6">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
              <p className="text-white/80 mb-4">
                Your app is configured for <strong>{selectedState}</strong> law
              </p>
              <p className="text-sm text-white/60 mb-6">
                You can change these settings anytime in the Settings menu
              </p>
            </div>

            <button
              onClick={handleComplete}
              className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-2 h-2 rounded-full transition-colors ${
                stepNumber <= step ? 'bg-accent' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}