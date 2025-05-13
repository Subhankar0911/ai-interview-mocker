import React from "react";
import AddNewInterview from './_components/AddNewInterview'
import { UserButton } from "@clerk/nextjs";

function Dashboard({children}) {
    return(
        <div className='flex flex-col items-center justify-center min-h-screen p-10'>
            <h2 className='font-bold text-5xl text-center mb-2'>AN AI POWERED MOCK INTERVIEWER</h2>
            <h2 className='text-gray-500 text-sm text-center mb-10'>Create and Start your Ai Mock Interviews</h2>
            <AddNewInterview />
        </div>
    )
}   
export default Dashboard
