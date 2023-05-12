import React, { useEffect, useState } from 'react'
import AppointMentList from '../../components/AppointMentList'
import DocAppointmentList from '../../components/DocAppointmentList'
import DocNavBar from '../../components/DocNavBar';

function DoctorDashBoard() {
const [appointments, setAppointments] = useState([])


useEffect(() => {
  fetch("http://localhost:5000/get-appointments-doc", {
    method: "GET",
    headers: {
     doctor : localStorage.getItem('doc-userId'),
    },
  })
    .then((data) => data.json())
    .then((data) => {
      
      setAppointments(data.data);
    })
    .catch((err) => {
      console.log(err);
    });



    
}, []);


  return (
    <>
    <div className='flex flex-col'>

<div className='flex flex-row'>
<div>   </div>
</div>


  {appointments?.length === 0 && "No appointments found"}
<div>
{appointments?.map((e) => {
  return (
    
    <AppointMentList e={e}  doc={true}  />
    
    );
  })}



<DocAppointmentList/>




</div>




    </div>
  </>
  )
}

export default DoctorDashBoard