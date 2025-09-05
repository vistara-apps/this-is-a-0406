import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, Trash2, Share2, Clock, MapPin, Download, AlertCircle } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import RecordingButton from '../RecordingButton'
import ShareButton from '../ShareButton'
import { useApp } from '../../context/AppContext'
import { formatDate, formatDuration } from '../../lib/utils'
import { getStateName } from '../../data/states'
import toast from 'react-hot-toast'

export default function RecordView() {
  const { state, dispatch } = useApp()
  const [recordings, setRecordings] = useState([])
  const [playingRecording, setPlayingRecording] = useState(null)
  const [playingAudio, setPlayingAudio] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    // Load recordings from localStorage on component mount
    loadRecordings()
  }, [])

  useEffect(() => {
    // Update recordings when state changes
    if (state.recordings) {
      setRecordings(state.recordings)
    }
  }, [state.recordings])

  const loadRecordings = () => {
    try {
      const savedRecordings = JSON.parse(localStorage.getItem('knowyourrights_recordings') || '[]')
      setRecordings(savedRecordings)
    } catch (error) {
      console.error('Error loading recordings:', error)
    }
  }

  const deleteRecording = async (recordingId) => {
    try {
      const updatedRecordings = recordings.filter(r => r.recordingId !== recordingId)
      setRecordings(updatedRecordings)
      localStorage.setItem('knowyourrights_recordings', JSON.stringify(updatedRecordings))
      toast.success('Recording deleted')
    } catch (error) {
      console.error('Error deleting recording:', error)
      toast.error('Failed to delete recording')
    }
  }

  const playRecording = (recording) => {
    if (playingRecording === recording.recordingId) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setPlayingRecording(null)
      setPlayingAudio(null)
    } else {
      // Start playing
      if (recording.filePath) {
        if (audioRef.current) {
          audioRef.current.src = recording.filePath
          audioRef.current.play()
          setPlayingRecording(recording.recordingId)
          setPlayingAudio(recording.filePath)
        }
      } else {
        toast.error('Recording file not available')
      }
    }
  }

  const downloadRecording = (recording) => {
    if (recording.filePath) {
      const link = document.createElement('a')
      link.href = recording.filePath
      link.download = `recording_${recording.recordingId}.webm`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Recording downloaded')
    } else {
      toast.error('Recording file not available')
    }
  }

  const stateName = getStateName(state.user.state)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Record Interaction</h1>
          <p className="text-gray-600">One-tap recording for your safety in {stateName}</p>
        </div>
      </div>

      {/* Recording Interface */}
      <Card className="p-8 text-center">
        <div className="space-y-6">
          <div className="w-32 h-32 mx-auto">
            <RecordingButton variant={state.isRecording ? 'stop' : 'start'} />
          </div>
          
          {!state.isRecording ? (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ready to Record</h3>
              <p className="text-gray-600 text-sm">Audio will be recorded securely on your device</p>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-red-600 mb-2">Recording in Progress</h3>
              <p className="text-gray-600 text-sm">Keep your device steady and speak clearly</p>
            </div>
          )}
        </div>
      </Card>

      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setPlayingRecording(null)
          setPlayingAudio(null)
        }}
        style={{ display: 'none' }}
      />

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
        <h3 className="font-semibold text-gray-900 mb-4">Your Recordings</h3>
        
        {recordings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Mic className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No recordings yet</p>
            <p className="text-sm">Your recordings will appear here after you record an interaction</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recordings.map((recording) => (
              <div key={recording.recordingId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Interaction Recording
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(recording.duration)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{getStateName(recording.location)}</span>
                      </span>
                      <span>{formatDate(recording.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => playRecording(recording)}
                    className={playingRecording === recording.recordingId ? 'text-red-600' : ''}
                  >
                    {playingRecording === recording.recordingId ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => downloadRecording(recording)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <ShareButton content={recording} type="recording" />
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteRecording(recording.recordingId)}
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
      <Card className="p-6 bg-yellow-50 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 mb-2">Recording Laws in {stateName}</h3>
            <p className="text-sm text-yellow-700 mb-3">
              Recording laws vary by state. In some states, you must inform all parties that you are recording. 
              {stateName} may have specific requirements for recording interactions with law enforcement.
            </p>
            <p className="text-xs text-yellow-600">
              <strong>Disclaimer:</strong> This app provides general information only. 
              Consult with a qualified attorney for legal advice specific to your situation.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
