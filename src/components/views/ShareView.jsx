import React, { useState } from 'react'
import { Share2, Copy, MessageSquare, Mail, Download, QrCode, ExternalLink } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'

export default function ShareView() {
  const { state } = useApp()
  const [copiedItem, setCopiedItem] = useState('')

  const shareableContent = {
    rights_card: {
      title: 'My Rights Card',
      description: 'Essential rights and contact information',
      content: `🛡️ KNOW YOUR RIGHTS - ${state.user.state}\n\n✓ Right to remain silent\n✓ Right to refuse searches\n✓ Right to ask if free to leave\n✓ Right to an attorney\n\nEmergency: 911\nACLU: 1-877-6-PROFILE\n\nGet the app: KnowYourRights`
    },
    quick_scripts: {
      title: 'Quick Response Scripts',
      description: 'Ready-to-use phrases for interactions',
      content: `🗣️ WHAT TO SAY:\n\n"Officer, I am exercising my right to remain silent."\n\n"I do not consent to any searches."\n\n"Am I being detained or am I free to go?"\n\n"I want to speak to a lawyer."\n\nStay calm • Keep hands visible • Don't argue`
    },
    emergency_contacts: {
      title: 'Emergency Contacts',
      description: 'Important numbers for legal assistance',
      content: `📞 EMERGENCY CONTACTS:\n\nLocal Emergency: 911\nACLU Hotline: 1-877-6-PROFILE\nNational Lawyer Guild: (212) 679-5100\n\nFamily Contact: [Add your contact]\nLawyer: [Add your lawyer]\n\nKnowYourRights App`
    }
  }

  const copyToClipboard = async (content, key) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedItem(key)
      setTimeout(() => setCopiedItem(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareContent = (content, title) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: content
      })
    } else {
      copyToClipboard(content, title)
    }
  }

  const shareViaEmail = (content, title) => {
    const subject = encodeURIComponent(title)
    const body = encodeURIComponent(content)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaSMS = (content) => {
    const body = encodeURIComponent(content)
    window.open(`sms:?body=${body}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Share Information</h1>
        <p className="text-white/80">Spread awareness and help others</p>
      </div>

      {/* Shareable Cards */}
      <div className="space-y-4">
        {Object.entries(shareableContent).map(([key, item]) => (
          <Card key={key} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="icon" 
                  onClick={() => copyToClipboard(item.content, key)}
                  className={copiedItem === key ? 'text-accent' : ''}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="icon" 
                  onClick={() => shareContent(item.content, item.title)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {item.content.substring(0, 200)}
                {item.content.length > 200 && '...'}
              </pre>
            </div>

            {/* Share Options */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="secondary" 
                onClick={() => shareViaSMS(item.content)}
                className="text-xs"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                SMS
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => shareViaEmail(item.content, item.title)}
                className="text-xs"
              >
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => copyToClipboard(item.content, key)}
                className="text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                {copiedItem === key ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* App Sharing */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Share KnowYourRights App</h3>
          <p className="text-gray-600 text-sm mb-4">
            Help others stay informed and protected
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="primary"
              onClick={() => shareContent(
                'Get instant legal guidance for law enforcement interactions. Download KnowYourRights app - your essential companion for staying informed and protected. Available now!',
                'KnowYourRights App'
              )}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share App
            </Button>
            <Button 
              variant="secondary"
              onClick={() => copyToClipboard(window.location.origin, 'app_link')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {copiedItem === 'app_link' ? 'Link Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Sharing Tips */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Sharing Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Share with family and friends for their safety</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Post on social media to raise awareness</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Keep emergency contacts updated</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Share with community organizations</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Education helps protect everyone's rights</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Information can save lives</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}