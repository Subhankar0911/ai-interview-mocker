'use client'
import React, { useEffect, useState } from 'react';
import { db } from '../../../utils/db';
import { Mockinterview } from '../../../utils/schema';
import { eq } from 'drizzle-orm';

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db.select().from(Mockinterview).where(eq(Mockinterview.mockId, params.interviewId));
    setInterviewData(result[0]);
  };
  return (
    <div className="my-6">
      <h2 className="font-bold text-2xl"> Let's get Started</h2>
    </div>
  );
}
export default Interview;