import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Webcam from 'react-webcam'
import { Button } from 'components/ui/button'

function RecordAnswersSection({ onRecognizedTextChange }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (onRecognizedTextChange) {
      onRecognizedTextChange(recognizedText)
    }
  }, [recognizedText, onRecognizedTextChange])

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn('Speech Recognition API not supported in this browser.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'

    recognitionRef.current.onresult = (event) => {
      console.log('Speech recognition result event:', event)
      let interimTranscript = ''
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interimTranscript += event.results[i][0].transcript
        }
      }
      setRecognizedText(finalTranscript || interimTranscript)
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [])

  const handleRecordClick = () => {
    console.log('Record button clicked. isRecording:', isRecording)
    if (!isRecording) {
      recognitionRef.current && recognitionRef.current.start()
      setRecognizedText('')
    } else {
      recognitionRef.current && recognitionRef.current.stop()
    }
    setIsRecording(!isRecording)
  }

  return (
    <div className="flex flex-col justify-end my-20">
      <div className="flex flex-col items-center rounded-lg bg-black" style={{ width: 300, height: 300 }}>
        <div className="relative w-full h-full rounded-lg">
          <Image
            src="/logo.svg"
            alt="Recording Logo"
            width={100}
            height={100}
            className={`absolute ${isRecording ? 'opacity-100' : 'opacity-50'}`}
          />
          <Webcam
            mirrored={true}
            style={{ height: 300, width: 300, zIndex: 10, borderRadius: '0.5rem' }}
          />
        </div>
        <Button
          variant="outline"
          className={`my-4 px-4 py-2 rounded-lg text-sm w-full ${isRecording ? 'bg-red-600 text-white' : 'bg-primary text-white'}`}
          onClick={handleRecordClick}
        >
          {isRecording ? (
            <>
              Stop Recording <span className="ml-2 text-xs text-red-400">● recording</span>
            </>
          ) : (
            'Record Answer'
          )}
        </Button>
        <Button
          variant="outline"
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm w-full"
        >
          Show User Answers
        </Button>
      </div>
    </div>
  )
}

export default RecordAnswersSection
