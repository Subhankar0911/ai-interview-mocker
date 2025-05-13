'use client'

import React, { useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Button } from 'components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text'

function RecordAnswersSectionFixed({ currentQuestion = "Please select a question to repeat." }) {
  const [userAnswer, setUserAnswer] = useState('')
  const { 
    error, 
    interimResult, 
    isRecording, 
    results, 
    startSpeechToText, 
    stopSpeechToText 
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  })

  const [transcript, setTranscript] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const textToSpeech = (text) => {
    if (isClient && 'speechSynthesis' in window) {
      console.log("Triggering speech synthesis for text:", text)
      const speech = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(speech)
    } else {
      alert("Sorry, your browser doesn't support text to speech.")
    }
  }

  const handleMicClick = () => {
    textToSpeech(currentQuestion)
  }

  useEffect(() => {
    if (results.length > 0) {
      const fullTranscript = results.map(result => result.transcript).join(' ')
      setTranscript(fullTranscript)
      setUserAnswer(fullTranscript)
    }
  }, [results])

  const handleRecordClick = () => {
    if (isRecording) {
      stopSpeechToText()
    } else {
      startSpeechToText()
    }
  }

  return (
    <div className='flex flex-col my-0 justify-center items-center rounded-lg bg-gray-300 p-0 mt-0 w-full'>
      <div className='relative flex flex-col my-0 justify-center items-center rounded-lg bg-gray-300 p-0 w-full'>
        {/* Removed broken image reference */}
        <Webcam
          mirrored={true}
          style={{ height: 300, width: 300, zIndex: 10 }}
        />
      </div>
      <Button 
        variant="outline" 
        className={`my-10 px-4 py-2 rounded-lg text-sm ${isRecording ? 'bg-red-600 text-white' : 'bg-primary text-white'}`}
        onClick={handleRecordClick}
      >
        {isRecording ? 'Stop Recording' : 'Record Answer'}
      </Button>

      {/* Mic button to repeat current question */}
      <Button 
        variant="outline"
        className="mb-4 px-4 py-2 rounded-lg text-sm bg-primary text-white"
        onClick={handleMicClick}
        aria-label="Repeat current question"
      >
        🎤 Repeat Question
      </Button>
      
      <div className='w-full p-1 bg-white rounded-md text-black min-h-[50px] text-xs text-center'>
        {error && <p className='text-red-600'>Error: {error}</p>}
        <p>{interimResult || transcript || 'Press "Record Answer" and start speaking...'}</p>
        <Button onClick={() => console.log(userAnswer)} className='mt-4'>
          Show User Answer
        </Button>
      </div>
    </div>
  )
}

export default RecordAnswersSectionFixed
