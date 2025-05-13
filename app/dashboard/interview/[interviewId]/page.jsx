'use client'
import React, { useEffect, useState } from 'react';
import { db } from '../../../../utils/db';
import { Mockinterview } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import Webcam from 'react-webcam';
import WebcamIcon from '../../_components/WebcamIcon.jsx';
import { Button } from '../../../../components/ui/button';
import Link from 'next/link'; // Import Link from next/link

function LightbulbIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 3v1.5m0 0a3.75 3.75 0 013.75 3.75c0 1.243-.75 2.25-1.5 3.375a3.75 3.75 0 01-2.25 1.875m0 0v1.5m0-1.5H9m2.25 0h1.5m-1.5 0v1.5m0 0a3.75 3.75 0 01-3.75-3.75c0-1.243.75-2.25 1.5-3.375a3.75 3.75 0 012.25-1.875m0 0V3m0 0h1.5"
      />
    </svg>
  );
}

function Interview({ params }) {
  const paramsObj = React.use(params);
  const interviewId = paramsObj?.interviewId;
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    // Fetch interview details when interviewId changes
    const getInterviewDetails = async () => {
      const result = await db
        .select()
        .from(Mockinterview)
        .where(eq(Mockinterview.mockId, interviewId));
      setInterviewData(result[0]);
    };
    if (interviewId) {
      getInterviewDetails();
    }
  }, [interviewId]);

  if (!interviewId) {
    return <div>Loading...</div>;
  }

  return (
    <div className='my-10 flex flex-col items-center justify-center'>
      <h2 className='font-bold text-2xl'>Let's get Started The Interview</h2>

      <div className='flex flex-col items-center justify-center'>
        {webCamEnabled ? (
          <Webcam
            audio
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirrored={true}
            style={{
              height: 240, // Increased height for a larger webcam size
              width: 320, // Increased width for a larger webcam size
            }}
            videoConstraints={{
              width: 320, // Increased width for a larger webcam size
              height: 240, // Increased height for a larger webcam size
              facingMode: "user",
            }}
          />
        ) : (
          <>
            <div className='flex justify-center'>
              <WebcamIcon className='w-16 h-16 my-7 p-2 bg-secondary rounded-lg border' />
            </div>
            <div className='flex justify-center'>
              <button
                onClick={() => setWebCamEnabled(true)}
                className='bg-primary text-white px-4 py-2 rounded-lg text-sm'
              >
                Enable Web Cam and Microphone
              </button>
            </div>
          </>
        )}
      </div>
      <div className='flex flex-col my-10'>
        <div className='flex flex-col p-10 rounded-lg border gap-5'>
          <div className='flex flex-col my-2'>
            <h2 className='text-lg'><strong>Job Role/Job Position:</strong>{' '}{interviewData?.jobPosition}</h2>
            <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong>{' '}{interviewData?.jobDesc ? interviewData.jobDesc : 'Technology'}</h2>
            <h2 className='text-lg'><strong>Years of Experience:</strong>{' '}{interviewData?.jobExperience ? interviewData.jobExperience : '3'}</h2>
          </div>
        </div>
        <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
          <h2 className='flex gap-2 items-center text-yellow-300 text-sm'><LightbulbIcon/><strong>Information</strong></h2>
          <h2 className='mt-3 text-yellow-500 text-xs'>Enable video web cam and microphone to start the interview</h2>
        </div>
        
        <div className='flex justify-center items-end p-5 '>
          <Link href={`/dashboard/interview/${interviewId}/start`}>
          <Button className='bg-primary text-white px-4 py-2 rounded-lg text-sm'>Click to Start</Button>
          </Link>
          
        </div>
      </div>
    </div>
  );
}

export default Interview;
