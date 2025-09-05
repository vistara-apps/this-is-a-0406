import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  user: {
    state: localStorage.getItem('knowyourrights_user_state') || '',
    language: localStorage.getItem('knowyourrights_user_language') || 'en',
    subscriptionStatus: 'free'
  },
  currentView: 'dashboard',
  isRecording: false,
  recordings: []
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_STATE':
      return {
        ...state,
        user: { ...state.user, state: action.payload }
      }
    case 'SET_USER_LANGUAGE':
      return {
        ...state,
        user: { ...state.user, language: action.payload }
      }
    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        currentView: action.payload
      }
    case 'START_RECORDING':
      return {
        ...state,
        isRecording: true
      }
    case 'STOP_RECORDING':
      return {
        ...state,
        isRecording: false,
        recordings: [...state.recordings, action.payload]
      }
    case 'SET_SUBSCRIPTION_STATUS':
      return {
        ...state,
        user: { ...state.user, subscriptionStatus: action.payload }
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}