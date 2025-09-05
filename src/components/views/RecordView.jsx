import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, Trash2, Share2, Clock, MapPin } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'

export default function RecordView() {
  const { state, dispatch } = useApp()
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingRecording, setPlayingRecording] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (state.isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.isRecording])

  const startRecording = async () => {
    // In a real app, you would request microphone permissions here
    // For demo purposes, we'll simulate the recording
    
    try {
      // Reset timer
      setRecordingTime(0)
      
      // Start recording state
      dispatch({ type: 'START_RECORDING' })
      
      // In a real app, you would start actual audio/video recording here
      console.log('Recording started...')
      
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    // Stop recording state
    const newRecording = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      duration: recordingTime,
      location: state.user.state,
      title: `Interaction ${new Date().toLocaleDateString()}`
    }
    
    dispatch({ type: 'STOP_RECORDING', payload: newRecording })
    setRecordingTime(0)
    
    console.log('Recording stopped and saved')
  }

  const deleteRecording = (recordingId) => {
    // In a real app, you would implement recording deletion
    console.log('Delete recording:', recordingId)
  }

  const shareRecording = (recording) => {
    const shareData = {
      title: recording.title,
      text: `Recorded interaction from ${new Date(recording.timestamp).toLocaleDateString()}`,
      // In a real app, you would include the actual recording file
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      // Fallback for browsers that don't support Web Share API
      alert('Sharing functionality would be implemented here')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Record Interaction</h1>
        <p className="text-white/80">One-tap recording for your safety</p>
      </div>

      {/* Recording Interface */}
      <Card className="p-8 text-center">
        {!state.isRecording ? (
          <div className="space-y-6">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto hover:bg-red-600 transition-colors cursor-pointer" onClick={startRecording}>
              <Mic className="h-12 w-12 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tap to Start Recording</h3>
              <p className="text-gray-600 text-sm">Audio and video will be recorded securely</p>
            </div>
            <Button variant="primary" onClick={startRecording} className="px-8">
              Start Recording
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto recording-pulse">
              <Square className="h-12 w-12 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-red-600 mb-2">Recording in Progress</h3>
              <div className="text-2xl font-mono text-gray-900 mb-2">
                {formatTime(recordingTime)}
              </div>
              <p className="text-gray-600 text-sm">Keep your device steady and speak clearly</p>
            </div>
            <Button variant="secondary" onClick={stopRecording} className="px-8">
              Stop Recording
            </Button>
          </div>
        )}
      </Card>

      {/* Recording Tips */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recording Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Keep your phone in a secure, visible position</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Inform the officer you are recording (if required by law)</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Stay calm and speak clearly</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Don't interfere with officer duties</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Recording is automatically saved securely</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">Recordings can be shared with legal counsel</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Previous Recordings */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Previous Recordings</h3>
        
        {state.recordings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Mic className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No recordings yet</p>
            <p className="text-sm">Your recordings will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {state.recordings.map((recording) => (
              <div key={recording.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{recording.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(recording.duration)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{recording.location}</span>
                      </span>
                      <span>{new Date(recording.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="icon" 
                    onClick={() => shareRecording(recording)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="icon" 
                    onClick={() => deleteRecording(recording.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Legal Notice */}
      <Card className="p-4 bg-blue-50 border border-blue-200">
        <p className="text-xs text-blue-800 text-center">
          <strong>Legal Notice:</strong> Recording laws vary by state. In some states, you must inform all parties that you are recording. 
          Check your local laws and consult with an attorney if needed.
        </p>
      </Card>
    </div>
  )
}