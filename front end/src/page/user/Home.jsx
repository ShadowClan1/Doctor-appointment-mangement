import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Narbar'

function Home() {
    const navigate = useNavigate()
const [docs, setDocs] = useState([])
const data1 = [{type : "c"}]

useEffect(() => {

if(!localStorage.getItem('token')) navigate('/login');

    



fetch('http://localhost:5000/doctors-types',{
  method : 'GET',
  headers: {
    'authtoken' : localStorage.getItem('token'),
    user: localStorage.getItem("userId"),
  }
}).then((data)=>data.json()).then((data)=>{

//  setDocs(data)
setDocs(data.data1)
}).catch((err)=>{
  console.log(err)
})




}, [])
const tile = ''


  return (
    <>
      
    <div className='w-screen  '>
<div className='w-screen  h-10 '></div>
<div className='flex flex-wrap flex-row items-center mt-10 ml-10 gap-10'>


{docs.map((e)=>{
return  <Link key={e} to={`doctors/${e}`} className="bg-slate-300 w-64 h-32  rounded-xl flex flex-col justify-center text-center text-2xl hover:scale-110  " style={{transitionDuration: '0.3s'}}>  {e} </Link>
  
})}




</div>

    </div>
    
    
    </>
  )
}

export default Home