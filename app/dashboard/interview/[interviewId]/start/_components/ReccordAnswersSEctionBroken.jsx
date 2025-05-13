'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Webcam from 'react-webcam'
import { Button } from 'components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic } from 'lucide-react'

function RecordAnswersSectionFixed() {
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

  // Update transcript and userAnswer when results change
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
        <Image
          src="/images/recording.png"
          alt="Recording"
          width={100}
          height={100}
          className='absolute'
        />
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
