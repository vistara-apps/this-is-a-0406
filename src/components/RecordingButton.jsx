import React, { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react'
import Button from './ui/Button'
import { useApp } from '../context/AppContext'
import { formatDuration } from '../lib/utils'
import { db } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function RecordingButton({ variant = 'start' }) {
  const { state, dispatch } = useApp()
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordedChunks, setRecordedChunks] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRecording, isPaused])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      })
      
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        await saveRecording(blob)
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setRecordedChunks(chunks)
      setIsRecording(true)
      setDuration(0)
      
      dispatch({ type: 'START_RECORDING' })
      toast.success('Recording started')
    } catch (error) {
      console.error('Error starting recording:', error)
      toast.error('Failed to start recording. Please check microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
      setIsRecording(false)
      setIsPaused(false)
      setDuration(0)
      
      dispatch({ type: 'STOP_RECORDING' })
      toast.success('Recording saved')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause()
      setIsPaused(true)
      toast.success('Recording paused')
    }
  }

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume()
      setIsPaused(false)
      toast.success('Recording resumed')
    }
  }

  const saveRecording = async (blob) => {
    try {
      const recordingData = {
        recordingId: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: state.user.userId || 'anonymous',
        timestamp: new Date().toISOString(),
        duration: duration,
        location: state.user.state,
        filePath: null // In production, upload to Supabase storage
      }

      // In a real app, you would upload the blob to Supabase storage
      // For demo purposes, we'll store it locally
      const url = URL.createObjectURL(blob)
      recordingData.filePath = url

      // Save to database (mock for demo)
      if (typeof window !== 'undefined') {
        const recordings = JSON.parse(localStorage.getItem('knowyourrights_recordings') || '[]')
        recordings.push(recordingData)
        localStorage.setItem('knowyourrights_recordings', JSON.stringify(recordings))
      }

      dispatch({ 
        type: 'STOP_RECORDING', 
        payload: recordingData 
      })
    } catch (error) {
      console.error('Error saving recording:', error)
      toast.error('Failed to save recording')
    }
  }

  if (variant === 'start' && !isRecording) {
    return (
      <Button
        onClick={startRecording}
        variant="primary"
        size="lg"
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        <Mic className="w-5 h-5 mr-2" />
        Start Recording
      </Button>
    )
  }

  if (variant === 'stop' && isRecording) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">{formatDuration(duration)}</span>
        </div>
        
        <div className="flex space-x-2">
          {isPaused ? (
            <Button
              onClick={resumeRecording}
              variant="secondary"
              size="sm"
            >
              <Play className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={pauseRecording}
              variant="secondary"
              size="sm"
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            onClick={stopRecording}
            variant="destructive"
            size="sm"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={startRecording}
      variant="outline"
      size="icon"
      className="rounded-full"
    >
      <Mic className="w-4 h-4" />
    </Button>
  )
}
