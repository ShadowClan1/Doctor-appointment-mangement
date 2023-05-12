import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import Context1 from "./context/Context1";

function VerifyMobile() {
  const navigate = useNavigate();
  const location = useLocation()
  useEffect(() => {

  }, []);

  const [creds, setCreds] = useState({ otp: ""});
  const { setPrompt } = useContext(Context1);
  const change = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  const handleClick = async (e) => {

//user 

 if(location.state.from === 'U'){   await fetch(`http://localhost:5000/verify-otp`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id : localStorage.getItem('userId'),
        otp : creds.otp
      }),
    })
      .then((data) => data.json())
      .then((data) => {
  console.log(data)
        if (data.success) {
          
          setPrompt({
            display: true,
            message: "Verification successfull",
            button: "Okay",
          });
          setTimeout(()=>{
            navigate('/profile')
            }, 3000)
  
        } else {
          
            setPrompt({
                display: true,
                message: "User is verified already",
                button: "Okay",
              });
      
navigate('/')

        }
      })
      .catch((err) => {
        console.log(err);
       
      });

    e.preventDefault();
    setTimeout(() => {
      setPrompt({ display: false, message: "", button: "" });
    }, 3000);}
 if(location.state.from === 'D'){   await fetch(`http://localhost:5000/verify-otp-doc`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id : localStorage.getItem('doc-userId'),
        otp : creds.otp
      }),
    })
      .then((data) => data.json())
      .then((data) => {
  console.log(data)
        if (data.success) {
          
          setPrompt({
            display: true,
            message: "Verification successfull",
            button: "Okay",
          });
          setTimeout(()=>{
            navigate('/doc-home')
            }, 3000)
  
        } else {
          
            setPrompt({
                display: true,
                message: "User is verified already",
                button: "Okay",
              });
      

        }
      })
      .catch((err) => {
        console.log(err);
       
      });

    e.preventDefault();
    setTimeout(() => {
      setPrompt({ display: false, message: "", button: "" });
    }, 3000);}
  };

  const styleBlock = "bg-black  ";

  return (
    <div className="h-screen">
      <div className="flex flex-col items-center h-3/4  justify-evenly  ">
        <div className="">
          {/* EMAIL :{" "} */}
          <input
            type="text"
            placeholder="otp"
            onChange={change}
            name="otp"
            value={creds.otp}
            className="outline outline-1 outline-blue-300 px-3 py-1 rounded-3xl focus-within:outline-blue-500 placeholder:text-blue-300 "
          />
        </div>
       
        <button
          onClick={handleClick}
          className="px-10 py-3 bg-blue-500 hover:bg-blue-400 text-white hover:text-black rounded-full"
        >
          Verify OTP
        </button>
       
      </div>
    </div>
  );
}

    export default VerifyMobile;
