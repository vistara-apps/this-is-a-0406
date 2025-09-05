import React, { useState } from 'react'
import { Share2, Copy, MessageSquare, Mail, ExternalLink } from 'lucide-react'
import Button from './ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/Dialog'
import { useApp } from '../context/AppContext'
import { copyToClipboard, shareContent } from '../lib/utils'
import { getStateName } from '../data/states'
import toast from 'react-hot-toast'

export default function ShareButton({ content, type = 'rights' }) {
  const { state } = useApp()
  const [isOpen, setIsOpen] = useState(false)

  const generateShareContent = () => {
    const stateName = getStateName(state.user.state)
    
    if (type === 'rights') {
      return {
        title: `Know Your Rights - ${stateName}`,
        text: `Important legal rights information for ${stateName}:\n\n${content.basicRights?.join('\n• ') || 'Know your rights when interacting with law enforcement.'}\n\nStay informed, stay safe.`,
        url: window.location.origin
      }
    }
    
    if (type === 'recording') {
      return {
        title: 'Police Interaction Recording',
        text: `Recorded interaction from ${content.timestamp}\nLocation: ${content.location}\nDuration: ${content.duration}s\n\nKnow Your Rights - Stay Safe`,
        url: window.location.origin
      }
    }
    
    return {
      title: 'Know Your Rights',
      text: 'Instant clarity for every interaction with law enforcement.',
      url: window.location.origin
    }
  }

  const handleShare = async (method) => {
    const shareData = generateShareContent()
    
    try {
      if (method === 'native' && navigator.share) {
        await shareContent(shareData)
        toast.success('Shared successfully')
      } else if (method === 'copy') {
        await copyToClipboard(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`)
        toast.success('Copied to clipboard')
      } else if (method === 'sms') {
        const smsText = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`)
        window.open(`sms:?body=${smsText}`)
      } else if (method === 'email') {
        const subject = encodeURIComponent(shareData.title)
        const body = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`)
        window.open(`mailto:?subject=${subject}&body=${body}`)
      }
      
      setIsOpen(false)
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share')
    }
  }

  const generateRightsCard = () => {
    const stateName = getStateName(state.user.state)
    
    return `
🛡️ KNOW YOUR RIGHTS - ${stateName.toUpperCase()}

✅ YOUR BASIC RIGHTS:
${content.basicRights?.map(right => `• ${right}`).join('\n') || '• You have the right to remain silent\n• You have the right to refuse searches\n• You have the right to leave if not detained'}

🚗 DURING TRAFFIC STOPS:
${content.trafficStop?.whatToSay?.map(phrase => `✓ ${phrase}`).join('\n') || '✓ "I am exercising my right to remain silent"\n✓ "I do not consent to searches"'}

❌ AVOID SAYING:
${content.trafficStop?.whatNotToSay?.map(item => `• ${item}`).join('\n') || '• Don\'t argue or resist\n• Don\'t consent to searches'}

📱 Emergency Contacts:
• ACLU: 1-800-775-2258
• NAACP: 1-212-965-2200

Stay informed. Stay safe.
KnowYourRights App - ${window.location.origin}
    `.trim()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Information</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview Card */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm mb-2">Preview:</h3>
            <div className="text-xs text-gray-600 whitespace-pre-line max-h-32 overflow-y-auto">
              {type === 'rights' ? generateRightsCard() : generateShareContent().text}
            </div>
          </div>
          
          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            {navigator.share && (
              <Button
                onClick={() => handleShare('native')}
                variant="outline"
                className="flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
            
            <Button
              onClick={() => handleShare('copy')}
              variant="outline"
              className="flex items-center justify-center"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            
            <Button
              onClick={() => handleShare('sms')}
              variant="outline"
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              SMS
            </Button>
            
            <Button
              onClick={() => handleShare('email')}
              variant="outline"
              className="flex items-center justify-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-3">Quick Actions:</p>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  copyToClipboard(type === 'rights' ? generateRightsCard() : generateShareContent().text)
                  toast.success('Rights card copied!')
                  setIsOpen(false)
                }}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy {type === 'rights' ? 'Rights Card' : 'Content'}
              </Button>
              
              <Button
                onClick={() => {
                  copyToClipboard(window.location.origin)
                  toast.success('App link copied!')
                  setIsOpen(false)
                }}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Copy App Link
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
