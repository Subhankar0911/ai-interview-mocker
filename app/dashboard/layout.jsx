import React from "react";
import Header from "./_components/header";

function DashboardPage({children}) {
  return (
    <div className="min-h-screen p-4 text-6xl">
      <Header/>
      <div className='mx-5 md:mx-20 lg:mx-36'>
      {children}
      </div>
    </div>
  )
}

export default DashboardPage
