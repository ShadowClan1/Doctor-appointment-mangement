import React, { useEffect, useState } from 'react'
import {Routes , Route} from 'react-router-dom'
import DocNavBar from '../../components/DocNavBar'
import AppointmentComp from './AppointmentComp'
import DocH from './DocH'
import DocNotifications from './DocNotifications'
import DoctorDashBoard from './DoctorDashBoard'
function DocHome() {
const [notifications, setNotifications] = useState([])
const [notificationL, setNotificationL] = useState(0)
useEffect(() => {
 
fetch('http://localhost:5000/get-notification-doc',{
    method : "GET",
    headers :{
        'doctor' : localStorage.getItem('doc-userId')
    }
}).then((data)=>data.json()).then((data)=>{
   setNotificationL(data.data.length)
    setNotifications(data.data)
}).catch((err)=>{
    console.log(err)
})





}, [])



  return (
    <div >
    <DocNavBar notificationL={notificationL} setNotificationsL={setNotificationL} />


<Routes>
    
    <Route path='/'  element={<DocH/>}  />
<Route path='/doc-notifications' element={<DocNotifications notifications={notifications} setNotificationL={setNotificationL} />}  />
<Route path='/doc-dashboard' element={<DoctorDashBoard/>} />
<Route path='/completed-appointment/:id' element={<AppointmentComp/>} />

</Routes>









    </div>
  )
}

export default DocHome