import React from 'react'
import { Shield, BookOpen, Mic, MapPin, Clock, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function DashboardHome() {
  const { state, dispatch } = useApp()

  const quickActions = [
    {
      icon: BookOpen,
      title: 'Know My Rights',
      description: 'Get instant legal guidance',
      action: () => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'rights' }),
      color: 'bg-blue-500'
    },
    {
      icon: Mic,
      title: 'Record Interaction',
      description: 'One-tap recording',
      action: () => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'record' }),
      color: 'bg-red-500'
    }
  ]

  const recentActivity = [
    { type: 'guide', title: 'Traffic Stop Rights', time: '2 days ago' },
    { type: 'recording', title: 'Interaction Recording', time: '1 week ago' }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-white/80 flex items-center justify-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>Protected under {state.user.state} law</span>
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Card key={index} className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={action.action}>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">24/7</div>
          <div className="text-sm text-gray-600">Always Available</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent mb-1">50+</div>
          <div className="text-sm text-gray-600">States Covered</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">99%</div>
          <div className="text-sm text-gray-600">Uptime</div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </h3>
        <div className="space-y-3">
          {recentActivity.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-gray-900">{item.title}</span>
              </div>
              <span className="text-gray-500 text-sm">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Subscription Status */}
      {state.user.subscriptionStatus === 'free' && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 flex items-center space-x-2">
                <Star className="h-5 w-5 text-purple-600" />
                <span>Upgrade to Premium</span>
              </h3>
              <p className="text-gray-600 text-sm">Unlock unlimited downloads and offline access</p>
            </div>
            <Button variant="primary">
              Upgrade
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}