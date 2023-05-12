import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Context1 from './context/Context1';

function ForgotPassword() {
    const navigate = useNavigate()
    const {id} = useParams()
    const [creds, setCreds] = useState({ email : ""});
    const {setPrompt} = useContext(Context1)
    const change = (e) => {
      setCreds({ ...creds, [e.target.name]: e.target.value });
    };
    const handleClick = async (e) => {
      localStorage.clear()
      await fetch(`http://localhost:5000/forgot-password`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: creds.email}),
      })
        .then((data) => data.json())
        .then((data) => {

if(data.success){

  setPrompt({display : true, message: "Reset link sent successfully", button: "Okay"});

} else {

  setPrompt({display : true, message: "Failed", button: "Okay"});

}
        
  
  
 
   
  
 
  
  
          
        })
        .catch((err) => {console.log(err);
          setPrompt({display : true, message: "Failed!!", button: "try again"});});
  
      e.preventDefault();
    //   setTimeout(()=>{
    //       setPrompt({display : false, message: "", button: ""})
      
    //   },3000)
    };
  
  
  const styleBlock = 'bg-black  '
  
    return (
  <div className="h-screen">
      
      <div className="flex flex-col items-center h-3/4  justify-evenly  ">
  <div className="">
  
  
        {/* EMAIL :{" "} */}
        <input type="text" placeholder="email" onChange={change} name="email" value={creds.email}  className='outline outline-1 outline-blue-300 px-3 py-1 rounded-3xl focus-within:outline-blue-500 placeholder:text-blue-300 ' />
  </div>
  
        <button onClick={handleClick} className={`px-10 py-3 text-white hover:text-black rounded-full   bg-blue-500 hover:bg-blue-400 `} >Send verification email</button>
    
      </div>
      </div>
    );
}

export default ForgotPassword