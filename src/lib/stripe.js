import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Payment features will be disabled.')
}

export const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

export const pricing = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Basic rights information',
      'Limited state guides',
      'Basic recording (5 recordings)',
      'English only'
    ]
  },
  premium: {
    name: 'Premium',
    price: 2.99,
    priceId: 'price_premium_monthly', // This would be your actual Stripe price ID
    features: [
      'Complete state-specific guides',
      'Unlimited recordings',
      'Offline access',
      'Multilingual support',
      'AI-powered scripts',
      'Priority support'
    ]
  }
}

export const payments = {
  async createCheckoutSession(priceId, userId) {
    // In a real app, this would call your backend API
    // For demo purposes, we'll simulate the flow
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/cancel`
        })
      })

      const session = await response.json()
      
      if (!stripePromise) {
        throw new Error('Stripe not configured')
      }

      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  },

  async createPortalSession(customerId) {
    // In a real app, this would call your backend API
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: window.location.origin
        })
      })

      const session = await response.json()
      window.location.href = session.url
    } catch (error) {
      console.error('Error creating portal session:', error)
      throw error
    }
  },

  // Mock function for demo - in real app this would verify with your backend
  async verifySubscription(userId) {
    try {
      // This would typically call your backend to verify the subscription status
      const response = await fetch(`/api/subscription/status/${userId}`)
      const data = await response.json()
      return data.status === 'active'
    } catch (error) {
      console.error('Error verifying subscription:', error)
      return false
    }
  }
}
