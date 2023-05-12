
import React, { useEffect } from 'react'
    import { Link } from 'react-router-dom'
function UserNotifications({notifications}) {
  
    
    
    
    
    useEffect(() => {
     
        fetch('http://localhost:5000/set-notification', {
            method : "PATCH",
            headers : {
                'user' : localStorage.getItem('userId')
            }
     }, ).then((data)=>data.json()).then((data)=>{}).catch((err) => {
       console.log(err)
          });
     
    
    
    
    
    
    
    }, [])
    
    
    
      return (
        <div>
    
    {
    notifications?.map((e)=>{
        return <div key={e}>
        <div className='flex flex-col gap-2 py-3 outline-1 outline items-center' >
            <div className='flex flex-col '>
    
          New appointment request for: <span className='bg-yellow-400 '>
          { e.date}   </span> 
           <span className='bg-blue-300 '>
          { e.visitTime}   </span> 
            </div>

    
    
        </div>
        
        </div>
    })
    }

{notifications.length === 0 && <div className='text-4xl flex  justify-center text-center mt-10'>No New Notification</div>}

    
    
        </div>
      )
    }
    



export default UserNotifications