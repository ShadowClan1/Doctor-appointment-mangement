import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Profile() {
   const [data, setData] = useState({})
const navigate = useNavigate()   
const verify = (e)=>{

fetch('http://localhost:5000/generate-otp', {
    method : 'POST', 
    headers : {
        "content-type" : 'application/json'
    },
    body : JSON.stringify({id : localStorage.getItem('userId')})
}).then((data)=>data.json()).then((data)=>{
   
if(data.success) setTimeout(()=>{
// navigate('/verify-mobile')
}, 3000)




}).catch((err)=>{
    console.log(err)
})




    e.preventDefault()
}



useEffect(() => {
 axios.get('http://localhost:5000/user',{headers:{
    user : localStorage.getItem('userId')
 }}).then((data)=>{
    console.log(data.data)
    setData(data.data)
    if(data.temp) {
        let d  = JSON.parse(data.temp)


    }
 }).catch((err)=>{
    console.log(err)
 })


}, [])



  return (
    <div className='w-screen'>
<div className='flex flex-col mx-5 mt-10'>

<div className='name-box flex flex-row justify-between'>
    <div>  <button className=' px-4 py-2 bg-fuchsia-500 rounded-full text-white'>btn</button>  {data.fName}</div>
    <div>{data.email}</div>
</div>

<div>  { data.temp &&  JSON.parse(data.temp).v === "T" ? <>
<div className='bg-green-400'>

Mobile Number : {data.mNumber} 
</div>

</> : <> Not verified : <button className='bg-slate-300 px-2 py-1 rounded-lg hover:shadow-lg hover:bg-slate-400 ' onClick={verify}> 

<Link to='/verify-mobile' state={{from : "U"}}>verify</Link>

</button>  </>} </div>

</div>


    </div>
  )
}

export default Profile