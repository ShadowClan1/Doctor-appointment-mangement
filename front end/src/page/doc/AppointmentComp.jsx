import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function AppointmentComp() {
const navigate = useNavigate();
    const [comp, setComp] = useState({earning : "", remarks : ""})
    const {id} = useParams()
  const change = (e)=>{
    setComp({...comp,[e.target.name]: e.target.value})
  }
const handleSubmit = (e)=>{
    console.log(comp)
fetch('http://localhost:5000/comp-appointment', {
    method : 'PATCH',
    headers : {
        'content-type' : 'application/json'
    },
    body : JSON.stringify({id : id, docId : localStorage.getItem('doc-userId'), earning : comp.earning, remarks : comp.remarks})
}).then((data)=>data.json()).then((data)=>{
    console.log(data)
}).catch((err)=>{
    console.log(err)
})
navigate('/doc-home/doc-dashboard')

    e.preventDefault()
}  
    return (
    <div >
<div className='flex flex-col justify-evenly h-screen'>
<div>

your earning : <input type="number" name='earning' className='outline' value={comp.earning}  onChange={change}/>

</div>
<div>

Any remarks: <input type="text" name='remarks' className='outline' value={comp.remarks}  onChange={change}/>
</div>
<div className='flex flex-row justify-center'>

<button onClick={handleSubmit}>submit</button>
</div>

</div>



    </div>
  )
}

export default AppointmentComp