import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function DocNotifications({notifications,setNotificationL}) {
  

useEffect(() => {
 setNotificationL(0)
    fetch('http://localhost:5000/set-notification-doc', {
        method : "PATCH",
        headers : {
            'doctor' : localStorage.getItem('doc-userId')
        }
 }, ).then((data)=>data.json()).then((data)=>{console.log(data)}).catch((err) => {
   console.log(err)
      });
 






}, [])



  return (
    <div className='mt-5 ' >
      {notifications.length === 0 && <div className='text-3xl text center '>No new notification found</div>}
<hr />
{
notifications?.map((e)=>{
    return <div  >
    <div className='flex flex-col gap-2 pl-5 py-4 relative ' >
        <div className='flex flex-row gap-2'>

      New appointment request for: <span className='bg-yellow-400 bg-opacity-30 '>
      { e.date}   </span> at 
       <span className='bg-blue-300 bg-opacity-30 '>
     { e.visitTime.substring(0,5)}   </span> 
        </div>
<Link to='/doc-home/doc-dashboard' className='bg-blue-300 hover:bg-blue-500 px-3 py-2 rounded-2xl w-20 absolute right-20 bottom-3'>Accept</Link>


    </div>
    <hr />
    </div>
})
}


    </div>
  )
}

export default DocNotifications