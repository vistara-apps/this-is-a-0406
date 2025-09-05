import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import AppShell from './components/AppShell'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('knowyourrights_onboarded')
    if (onboardingComplete === 'true') {
      setIsOnboarded(true)
    }
  }, [])

  const handleOnboardingComplete = (userData) => {
    localStorage.setItem('knowyourrights_onboarded', 'true')
    localStorage.setItem('knowyourrights_user_state', userData.state)
    localStorage.setItem('knowyourrights_user_language', userData.language)
    setIsOnboarded(true)
  }

  return (
    <AppProvider>
      <AppShell>
        {!isOnboarded ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <Dashboard />
        )}
      </AppShell>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </AppProvider>
  )
}

export default App
