import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function DoctorDesc() {
const {id} = useParams();
const [doctorDetails, setDoctorDetails] = useState({})


useEffect(() => {
 

    fetch("http://localhost:5000/get-doc-des-from-id", {
        method: "GET",
        headers: {
          id: id,
        },
      })
        .then((data) => data.json())
        .then((data) => {
     
          setDoctorDetails(data.data);
        })
        .catch((err) => {
          console.log(err);
        });


}, [])


  return (
    <div>
<div className='flex flex-col pl-5 pt-5 '>
    <div className='flex flex-row '>

    <h1 className='text-3xl '>
{doctorDetails?.fName}

    </h1> 
    </div>
<div className='flex flex-col gap-1'>
 <strong className='text-xl mt-5'>Description: </strong> 
<p className='text-xs '>{doctorDetails?.hospital && "Worked at " + doctorDetails.hospital }</p>
<p>{doctorDetails?.description}</p>


</div>



<div className='w-screen flex flex-row items-center justify-center'>

   <Link className='fixed bg-black  text-white px-3 py-1 rounded-xl text-center flex flex-row bottom-20' to={`/book-appointment/${id}`}>Book Appointment</Link>
</div>
</div>


    </div>
  )
}

export default DoctorDesc