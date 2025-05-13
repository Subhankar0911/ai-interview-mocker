import React, { useState, useEffect } from 'react'
import Webcam from 'react-webcam'

function QuestionSectionsFixed({ mockInterviewQuestion, activeQuestionIndex: initialActiveIndex, style, recognizedText }) {
  const [showQuestions, setShowQuestions] = useState(false)
  const [webCamEnabled, setWebCamEnabled] = useState(false)
  const [webCamError, setWebCamError] = useState(false)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(initialActiveIndex || 0)
  const [variationIndices, setVariationIndices] = useState({})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const textToSpeech = (text) => {
    if (isClient && 'speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(speech)
    } else {
      alert("Sorry, your browser doesn't support text to speech.")
    }
  }

  const handleShowQuestions = () => {
    setShowQuestions(true)
    setWebCamEnabled(true)
  }

  const handleQuestionClick = (index) => {
    if (index === activeQuestionIndex) {
      setVariationIndices((prev) => {
        const currentVarIndex = prev[index] || 0
        const variations = Array.isArray(mockInterviewQuestion[index])
          ? mockInterviewQuestion[index].length
          : 1
        const nextVarIndex = (currentVarIndex + 1) % variations
        return { ...prev, [index]: nextVarIndex }
      })
    } else {
      setActiveQuestionIndex(index)
      setVariationIndices((prev) => ({ ...prev, [index]: 0 }))
    }
  }

  const renderQuestionText = () => {
    const question = mockInterviewQuestion[activeQuestionIndex]
    if (Array.isArray(question)) {
      const varIndex = variationIndices[activeQuestionIndex] || 0
      const currentQuestion = question[varIndex]
      if (typeof currentQuestion === 'object' && currentQuestion !== null) {
        return currentQuestion.question || JSON.stringify(currentQuestion)
      }
      return currentQuestion
    }
    if (typeof question === 'object' && question !== null) {
      return question.question || JSON.stringify(question)
    }
    return question
  }

  if (!mockInterviewQuestion) {
    return <div>Loading interview questions...</div>
  }

  return (
    <div
      className="p-2 rounded-lg my-10"
      style={{
        ...style,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'grey',
        padding: '2px',
        boxSizing: 'border-box',
        margin: '10px auto',
        fontSize: '0.875rem',
        maxWidth: '600px',
      }}
    >
      {!showQuestions && (
        <div className="flex justify-center items-center" style={{ height: '100px' }}>
          <button
            onClick={handleShowQuestions}
            className="bg-primary text-white px-6 py-3 rounded cursor-pointer transform transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
            style={{ fontSize: '1.25rem' }}
          >
            Show Questions
          </button>
        </div>
      )}

      {showQuestions && (
        <>
          {webCamError ? (
            <div className="fixed inset-0 bg-red-600 text-white p-4 text-center z-50 flex items-center justify-center text-xl font-bold">
              Please turn on your webcam and microphone to see the questions.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-full mx-auto">
                {mockInterviewQuestion.map((_, index) => (
                  <h2
                    key={index}
                    onClick={() => handleQuestionClick(index)}
                    className={`rounded-full border border-gray-400 px-3 py-2 text-center cursor-pointer font-semibold ${
                      activeQuestionIndex === index ? 'bg-primary text-white' : ''
                    }`}
                    style={{ margin: '5px', padding: '0.25rem 0.6rem', fontSize: '0.875rem' }}
                  >
                    Question#{index + 1}
                  </h2>
                ))}
              </div>
              <h2 className="my-5 text-sm md:text-base flex items-center justify-center gap-2">
                {renderQuestionText()}
                {isClient && (
                  <button
                    className="text-primary text-sm md:text-base cursor-pointer"
                    onClick={() => textToSpeech(renderQuestionText())}
                    aria-label="Play question text"
                    title="Play question"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5l6 7-6 7V5z" />
                    </svg>
                  </button>
                )}
              </h2>
              {/* Render recognized speech-to-text below the question text */}
              {recognizedText && (
                <div className="my-4 p-3 bg-gray-100 rounded-md text-center text-gray-800" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <strong>Your Answer:</strong>
                  <p className="mt-2 whitespace-pre-wrap">{recognizedText}</p>
                </div>
              )}
              <div className="border rounded-lg p-5 bg-blue-100 my-10" style={{ fontSize: '0.875rem' }}>
                <h2 className="flex gap-2 items-center text-blue-primary font-semibold">
                  <strong>Note:</strong>
                </h2>
                <h2 className="text-base text-primary my-2">
                  Please note that the interview will be recorded and stored for future reference. You can review the recording after the interview.
                </h2>
              </div>
              {webCamEnabled && (
                <>
                  {webCamError && (
                    <div className="fixed top-0 left-0 w-full bg-red-600 text-white p-4 text-center z-50">
                      Please enable your webcam and microphone or otherwise you will be disqualified.
                    </div>
                  )}
                  {/* Removed duplicate webcam display to avoid dual camera issue */}
                  {/* <div style={{ position: 'fixed', bottom: 10, right: 10, width: 150, height: 150, zIndex: 1000 }}>
                    <Webcam
                      audio
                      mirrored
                      videoConstraints={{ width: 150, height: 150, facingMode: 'user' }}
                      onUserMedia={() => {
                        setWebCamEnabled(true)
                        setWebCamError(false)
                      }}
                      onUserMediaError={() => setWebCamError(true)}
                    />
                  </div> */}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default QuestionSectionsFixed
