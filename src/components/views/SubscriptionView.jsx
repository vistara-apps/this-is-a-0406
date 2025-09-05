import React, { useState, useEffect } from 'react'
import { Crown, Check, X, CreditCard, Shield, Globe, Zap, Star } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { pricing, payments } from '../../lib/stripe'
import { getStateName } from '../../data/states'
import toast from 'react-hot-toast'

export default function SubscriptionView() {
  const { state, dispatch } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('free')

  useEffect(() => {
    // Check current subscription status
    setCurrentPlan(state.user.subscriptionStatus || 'free')
  }, [state.user.subscriptionStatus])

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      await payments.createCheckoutSession(
        pricing.premium.priceId,
        state.user.userId || 'anonymous'
      )
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast.error('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      await payments.createPortalSession(state.user.customerId)
    } catch (error) {
      console.error('Error opening customer portal:', error)
      toast.error('Failed to open subscription management. Please try again.')
    }
  }

  const stateName = getStateName(state.user.state)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
        <p className="text-gray-600">
          Get the most comprehensive legal protection for {stateName}
        </p>
      </div>

      {/* Current Plan Status */}
      {currentPlan === 'premium' && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900">Premium Active</h3>
              <p className="text-sm text-purple-700">
                You have access to all premium features
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card className={`p-6 ${currentPlan === 'free' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              $0
              <span className="text-lg font-normal text-gray-500">/month</span>
            </div>
            <p className="text-sm text-gray-600">Basic protection</p>
          </div>

          <div className="space-y-3 mb-6">
            {pricing.free.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {currentPlan === 'free' ? (
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                dispatch({ type: 'SET_SUBSCRIPTION_STATUS', payload: 'free' })
                toast.success('Switched to free plan')
              }}
            >
              Switch to Free
            </Button>
          )}
        </Card>

        {/* Premium Plan */}
        <Card className={`p-6 relative ${currentPlan === 'premium' ? 'ring-2 ring-purple-500 bg-purple-50' : 'ring-2 ring-purple-200'}`}>
          {/* Popular Badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>Most Popular</span>
            </div>
          </div>

          <div className="text-center mb-6 mt-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${pricing.premium.price}
              <span className="text-lg font-normal text-gray-500">/month</span>
            </div>
            <p className="text-sm text-gray-600">Complete protection</p>
          </div>

          <div className="space-y-3 mb-6">
            {pricing.premium.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {currentPlan === 'premium' ? (
            <div className="space-y-3">
              <Button variant="primary" className="w-full" disabled>
                <Crown className="w-4 h-4 mr-2" />
                Current Plan
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleManageSubscription}
              >
                Manage Subscription
              </Button>
            </div>
          ) : (
            <Button 
              variant="primary" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={handleUpgrade}
              disabled={isLoading}
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </>
              )}
            </Button>
          )}
        </Card>
      </div>

      {/* Feature Comparison */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Feature</th>
                <th className="text-center py-3 px-4">Free</th>
                <th className="text-center py-3 px-4">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3 px-4">Basic rights information</td>
                <td className="text-center py-3 px-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">State-specific legal guides</td>
                <td className="text-center py-3 px-4">
                  <span className="text-sm text-gray-500">Limited</span>
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">Recording interactions</td>
                <td className="text-center py-3 px-4">
                  <span className="text-sm text-gray-500">5 recordings</span>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-sm text-green-600 font-medium">Unlimited</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">AI-powered scripts</td>
                <td className="text-center py-3 px-4">
                  <X className="w-5 h-5 text-red-400 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">Multilingual support</td>
                <td className="text-center py-3 px-4">
                  <X className="w-5 h-5 text-red-400 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">Offline access</td>
                <td className="text-center py-3 px-4">
                  <X className="w-5 h-5 text-red-400 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">Priority support</td>
                <td className="text-center py-3 px-4">
                  <X className="w-5 h-5 text-red-400 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Enhanced Protection</h3>
          <p className="text-sm text-gray-600">
            Get comprehensive, state-specific legal guidance tailored to your location
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Scripts</h3>
          <p className="text-sm text-gray-600">
            Generate personalized scripts for any scenario using advanced AI
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Multilingual Support</h3>
          <p className="text-sm text-gray-600">
            Access rights information in multiple languages for better understanding
          </p>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="p-6 bg-gray-50">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-sm text-gray-600">
              Your payment information is processed securely through Stripe. 
              We never store your payment details, and all recordings remain on your device.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
