import React, { useEffect, useRef, useState } from 'react'

function Timings({e, date,id, setTime , time}) {
    const [booked, setBooked] = useState(false);

const ref = useRef(null)
const click = ()=>{

setTime({...time, hours : e.substring(0,2), mins : e.substring(3,5)})



}
useEffect(() => {

 
setBooked(false)
    fetch(`http://localhost:5000/check-avail`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "doctor" : id
        },
        body: JSON.stringify({  
          date: date,
          time: e.substring(0,5) }),
      })
        .then((data) => data.json())
        .then((data) => {
       
if(data.data.length > 0) setBooked(true)

        })
        .catch((err) => {
          console.log(err);
        });



}, [date])



  return (
    <div>

<div onClick={click} htmlFor='select'  className={`outline outline-1 p-2 ${(time.hours === e.substring(0,2)  && time.mins === e.substring(3,5) ) ? "outline outline-4 outline-blue-400" : ""} ${booked? "bg-red-400  pointer-events-none": "bg-green-300 cursor-pointer"}`}>{e}</div>


    </div>
  )
}

export default Timings