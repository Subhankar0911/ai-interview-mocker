'use client'
import React, { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { db } from '../../../../../utils/db'
import { Mockinterview } from '../../../../../utils/schema'
import { eq } from 'drizzle-orm'
import QuestionSections from './_components/QuestionSections'
// Dynamically import ReccordAnswersSEction with SSR disabled
const ReccordAnswersSEction = dynamic(() => import('./_components/ReccordAnswersSEction'), { ssr: false })

function StartInterview({ params }) {
  const paramsObj = React.use(params)
  const interviewId = paramsObj?.interviewId
  const [interviewData, setInterviewData] = useState(null)
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false)
  const [locationPermission, setLocationPermission] = useState(null)
  const [screenSharePermission, setScreenSharePermission] = useState(null)
  const [permissionWarning, setPermissionWarning] = useState(false)

  // New state for recognized text from speech-to-text
  const [recognizedText, setRecognizedText] = useState('')

  const getInterviewDetails = useCallback(async () => {
    if (!interviewId) return
    try {
      const result = await db
        .select()
        .from(Mockinterview)
        .where(eq(Mockinterview.mockId, interviewId))

      if (result.length > 0) {
        setInterviewData(result[0])
        let jsonMockResponse = null
        try {
          jsonMockResponse = JSON.parse(result[0].jsonMockResp)
        } catch (error) {
          console.error('Failed to parse jsonMockResp:', error)
        }
        setMockInterviewQuestion(jsonMockResponse)
        console.log('Mock Interview Questions:', jsonMockResponse)
      }
    } catch (error) {
      console.error('Failed to fetch interview details:', error)
    }
  }, [interviewId])

  useEffect(() => {
    getInterviewDetails()
  }, [getInterviewDetails])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.hidden ||
        document.visibilityState === 'hidden' ||
        (window.outerWidth < window.screen.availWidth || window.outerHeight < window.screen.availHeight)
      ) {
        setTabSwitchWarning(true)
      } else {
        setTabSwitchWarning(false)
        // Reset interview on return to tab
        setActiveQuestionIndex(0)
      }
    }
    const handleFocus = () => {
      setTabSwitchWarning(false)
      // Reset interview on focus
      setActiveQuestionIndex(0)
    }

    window.addEventListener('resize', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('resize', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (!navigator.permissions) {
      console.warn('Permissions API not supported')
      return
    }
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      setLocationPermission(result.state)
      if (result.state === 'denied') {
        setPermissionWarning(true)
      }
      result.onchange = () => {
        setLocationPermission(result.state)
        setPermissionWarning(result.state === 'denied')
      }
    })
  }, [])

  const requestScreenShare = useCallback(async () => {
    try {
      // Safari does not support getDisplayMedia, so fallback or notify user
      if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
        alert('Screen sharing is not supported on Safari. Please use Chrome or Firefox for full functionality.')
        setScreenSharePermission('denied')
        setPermissionWarning(true)
        return
      }
      if (navigator.userAgent.includes('Firefox')) {
        // Firefox requires user gesture to prompt screen sharing, so we delay or notify user
        alert('Please click the "Start Interview" button to enable screen sharing permission in Firefox.')
        setScreenSharePermission('prompt')
        setPermissionWarning(false)
        return
      }
      await navigator.mediaDevices.getDisplayMedia({ video: true })
      setScreenSharePermission('granted')
      setPermissionWarning(false)
    } catch (err) {
      setScreenSharePermission('denied')
      setPermissionWarning(true)
    }
  }, [])

  useEffect(() => {
    requestScreenShare()
  }, [requestScreenShare])

  if (!interviewId) {
    return <div>Loading...</div>
  }

  // Handler to update recognizedText state from child component
  const handleRecognizedTextChange = (text) => {
    setRecognizedText(text)
  }

  return (
    <div>
      {(tabSwitchWarning || permissionWarning) && (
        <div
          className="fixed inset-0 bg-red-700 bg-opacity-95 text-white flex items-center justify-center text-center p-4 z-50 text-2xl font-extrabold select-none"
          style={{ userSelect: 'none', pointerEvents: 'auto' }}
        >
          {tabSwitchWarning
            ? "Please don't switch tabs or minimize the window, otherwise you will be disqualified."
            : 'Please enable all necessary permissions to continue the interview.'}
        </div>
      )}
      <div
        style={{
          pointerEvents: tabSwitchWarning || permissionWarning ? 'none' : 'auto',
          filter: tabSwitchWarning || permissionWarning ? 'blur(3px)' : 'none',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          height: '100vh',
          gap: '20px',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid grey', padding: '1px' }}>
          <QuestionSections
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            recognizedText={recognizedText}  // Pass recognizedText prop
          />
        </div>
        <div style={{ width: '350px', flexShrink: 0 }}>
          <ReccordAnswersSEction onRecognizedTextChange={handleRecognizedTextChange} />
        </div>
      </div>
    </div>
  )
}

export default StartInterview
