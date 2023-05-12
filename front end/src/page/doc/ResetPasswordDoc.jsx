import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Context1 from '../../components/context/Context1';

function ResetPasswordDoc() {
    const navigate = useNavigate()
    const {token} = useParams()
    const [creds, setCreds] = useState({ password : "", cpassword: "" });
    const {setPrompt} = useContext(Context1)
    const change = (e) => {
      setCreds({ ...creds, [e.target.name]: e.target.value });
    };
    const handleClick = async (e) => {
      localStorage.clear()
      await fetch(`http://localhost:5000/doc-reset-password`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ token: token, password: creds.password }),
      })
        .then((data) => data.json())
        .then((data) => {
        console.log(data)
  if(data.status) {
  
 
    setPrompt({display : true, message: "Password changed successfully", button: "Login"});
    navigate('/doc-login')
  
  }
  else{
    setPrompt({display : true, message: " Failed!!", button: "Login"});
  }
  
          
        })
        .catch((err) => {console.log(err);
          setPrompt({display : true, message: "Failed!!", button: "try again"});});
  
      e.preventDefault();
      setTimeout(()=>{
          setPrompt({display : false, message: "", button: ""})
      
      },3000)
    };
  
  
  const styleBlock = 'bg-black  '
  
    return (
  <div className="h-screen">
      
      <div className="flex flex-col items-center h-3/4  justify-evenly  ">
  <div className="">
  
  
        {/* EMAIL :{" "} */}
        <input type="text" placeholder="Password" onChange={change} name="password" value={creds.password}  className='outline outline-1 outline-blue-300 px-3 py-1 rounded-3xl focus-within:outline-blue-500 placeholder:text-blue-300 ' />
  </div>
  <div>
  
        {/* Password :{" "} */}
        <input placeholder="Confirm Password"
          type="text" 
          onChange={change}
          name="cpassword"
          value={creds.cpassword}
          className='outline outline-1 outline-blue-300 px-3 py-1 rounded-3xl focus-within:outline-blue-500 placeholder:text-blue-300'
          />
          </div>
        <button onClick={handleClick} disabled={

(creds.password !== creds.cpassword || creds.password.length < 4)


        } className={`px-10 py-3 text-white hover:text-black rounded-full  ${(creds.password !== creds.cpassword || creds.password.length < 4)? "bg-red-400" : "bg-blue-500 hover:bg-blue-400 "}`} >Login</button>
    
      </div>
      </div>
    );
}

export default ResetPasswordDoc