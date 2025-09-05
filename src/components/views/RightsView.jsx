import React, { useState, useEffect } from 'react'
import { BookOpen, Copy, Share2, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ShareButton from '../ShareButton'
import { useApp } from '../../context/AppContext'
import { getLegalGuide, SCENARIOS } from '../../data/legalContent'
import { getStateName } from '../../data/states'
import { ai } from '../../lib/openai'
import { copyToClipboard } from '../../lib/utils'
import toast from 'react-hot-toast'

export default function RightsView() {
  const { state } = useApp()
  const [selectedScenario, setSelectedScenario] = useState('traffic-stop')
  const [expandedSections, setExpandedSections] = useState({})
  const [aiScript, setAiScript] = useState(null)
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const [legalGuide, setLegalGuide] = useState(null)

  useEffect(() => {
    // Load state-specific legal guide
    const guide = getLegalGuide(state.user.state, state.user.language)
    setLegalGuide(guide)
  }, [state.user.state, state.user.language])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCopyScript = async (script) => {
    try {
      await copyToClipboard(script)
      toast.success('Script copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy script')
    }
  }

  const generateAIScript = async () => {
    if (!state.user.state) {
      toast.error('Please select your state first')
      return
    }

    setIsGeneratingScript(true)
    try {
      const scenario = SCENARIOS.find(s => s.id === selectedScenario)
      const script = await ai.generateScript(
        scenario?.description || selectedScenario,
        state.user.state,
        state.user.language
      )
      setAiScript(script)
      toast.success('AI script generated!')
    } catch (error) {
      console.error('Error generating AI script:', error)
      toast.error('Failed to generate AI script. Please try again.')
    } finally {
      setIsGeneratingScript(false)
    }
  }

  const currentScenario = SCENARIOS.find(s => s.id === selectedScenario)
  const stateName = getStateName(state.user.state)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Know Your Rights</h1>
          <p className="text-gray-600">State-specific legal guidance for {stateName}</p>
        </div>
        {legalGuide && (
          <ShareButton content={legalGuide} type="rights" />
        )}
      </div>

      {/* Scenario Selector */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Select Scenario</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedScenario === scenario.id
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{scenario.icon}</div>
              <div className="font-medium text-sm">{scenario.title}</div>
              <div className="text-xs text-gray-500">{scenario.description}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Basic Rights */}
      {legalGuide && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-primary" />
              Your Basic Rights in {stateName}
            </h2>
            <Button
              onClick={() => toggleSection('basicRights')}
              variant="ghost"
              size="sm"
            >
              {expandedSections.basicRights ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
          
          {expandedSections.basicRights && (
            <div className="space-y-3">
              {legalGuide.basicRights?.map((right, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{right}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Traffic Stop Guidance */}
      {legalGuide?.trafficStop && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Traffic Stop Guidance</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* What to Say */}
            <div>
              <h3 className="font-medium text-green-700 mb-3 flex items-center">
                ✅ What to Say
              </h3>
              <div className="space-y-2">
                {legalGuide.trafficStop.whatToSay?.map((phrase, index) => (
                  <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">{phrase}</p>
                    <Button
                      onClick={() => handleCopyScript(phrase)}
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-green-600 hover:text-green-700"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* What NOT to Say */}
            <div>
              <h3 className="font-medium text-red-700 mb-3 flex items-center">
                ❌ What NOT to Say/Do
              </h3>
              <div className="space-y-2">
                {legalGuide.trafficStop.whatNotToSay?.map((item, index) => (
                  <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Procedure */}
          {legalGuide.trafficStop.procedure && (
            <div className="mt-6">
              <h3 className="font-medium text-blue-700 mb-3">Recommended Procedure</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <ol className="space-y-2">
                  {legalGuide.trafficStop.procedure.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm text-blue-800">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* AI-Generated Scripts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            AI-Powered Scripts
          </h2>
          <Button
            onClick={generateAIScript}
            disabled={isGeneratingScript}
            variant="outline"
            size="sm"
          >
            {isGeneratingScript ? 'Generating...' : 'Generate Script'}
          </Button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Get personalized scripts for your specific scenario in {stateName}
        </p>

        {aiScript && (
          <div className="space-y-4">
            {aiScript.whatToSay && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">What to Say:</h4>
                <div className="space-y-2">
                  {aiScript.whatToSay.map((phrase, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="text-sm text-green-700">{phrase}</span>
                      <Button
                        onClick={() => handleCopyScript(phrase)}
                        variant="ghost"
                        size="sm"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiScript.keyRights && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Key Rights to Remember:</h4>
                <ul className="space-y-1">
                  {aiScript.keyRights.map((right, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start">
                      <span className="mr-2">•</span>
                      {right}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiScript.deEscalationTips && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">De-escalation Tips:</h4>
                <ul className="space-y-1">
                  {aiScript.deEscalationTips.map((tip, index) => (
                    <li key={index} className="text-sm text-yellow-700 flex items-start">
                      <span className="mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Emergency Contacts */}
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <h2 className="text-lg font-semibold text-red-800">Emergency Contacts</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="font-medium text-red-800">ACLU</p>
            <p className="text-sm text-red-600">1-800-775-2258</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-red-800">NAACP Legal Defense</p>
            <p className="text-sm text-red-600">1-212-965-2200</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-red-800">National Lawyers Guild</p>
            <p className="text-sm text-red-600">1-415-285-5067</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
