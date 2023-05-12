import React, { useEffect, useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './Home'
import Navbar from './Narbar'
import Appointments from './Appointment'
import DoctorDesc from '../doc/DoctorDesc'
import FindDoc from './FindDoc'
import MyAppointments from './MyAppointmentss'
import UserNotifications from './UserNotifications'
import Profile from './Profile'
function UserDashBoard() {
    const [notifications, setNotifications] = useState([])
    

useEffect(() => {

    fetch('http://localhost:5000/get-notification',{
        method : "GET",
        headers :{
            'user' : localStorage.getItem('userId') ,
            'authtoken' : localStorage.getItem('token')
        }
    }).then((data)=>data.json()).then((data)=>{
   
        setNotifications(data.data)
    }).catch((err)=>{
        console.log(err)
    })


}, [])






  return (
    <>
<Navbar notifications={notifications}/>

<Routes>

<Route path='/' element={<Home/>} />
<Route path='/book-appointment/:id' element={<Appointments/>} />
    <Route path='/doctors/:type' element={<FindDoc/>} />
    <Route path='/doctor/:id' element={<DoctorDesc/>} />
    <Route path='/my-appointments' element={<MyAppointments/>} />
    <Route path='/notifications' element={<UserNotifications notifications={notifications}/>} />
    <Route path='/profile' element={<Profile/>} />

</Routes>




    </>
  )
}

export default UserDashBoard