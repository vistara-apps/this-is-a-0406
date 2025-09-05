import React from 'react'
import { useApp } from '../context/AppContext'
import DashboardHome from './views/DashboardHome'
import RightsView from './views/RightsView'
import RecordView from './views/RecordView'
import ShareView from './views/ShareView'
import SettingsView from './views/SettingsView'

export default function Dashboard() {
  const { state } = useApp()

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'dashboard':
        return <DashboardHome />
      case 'rights':
        return <RightsView />
      case 'record':
        return <RecordView />
      case 'share':
        return <ShareView />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderCurrentView()}
    </div>
  )
}