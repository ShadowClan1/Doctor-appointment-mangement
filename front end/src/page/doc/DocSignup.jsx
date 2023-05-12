import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context1 from "../../components/context/Context1";


function DocSignup() {
  const { users, setUsers, setErrorM, setPrompt } = useContext(Context1)
  const [type, setType] = useState([])
  const [checkBox, setCheckBox] = useState(false)
  const [creds, setCreds] = useState({ email: "", password: "" , fName : "", age : "", gender : "" , type : "" , cpassword : "", hospital : "", location: "", desc : "", mNumber : ""});
  const change = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const checkClick = ()=>{
    if(checkBox) setCheckBox(false);
    else setCheckBox(true)
  }

  useEffect(() => {
  getType()
}, [])


const getType =()=>{

  fetch('http://localhost:5000/doctors-types',{
  method : 'GET'
}).then((data)=>data.json()).then((data)=>{
//  setDocs(data)

setType(data.data1)
}).catch((err)=>{
  console.log(err)
})
}


  const handleClick = async (e) => {

    if (creds.email.length < 5) {
      setErrorM({ message: "Length of email should be greater than 5" });

      setTimeout(() => {
        setErrorM({ message: "" });
      }, 3500);
    }
// return console.log(creds)


    await fetch(`http://localhost:5000/doc-signup`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: creds.email.toLowerCase(), password: creds.password , age : creds.age, gender : creds.gender, fName : creds.fName, type : creds.type, location : creds.location , description : creds.desc, hospital : creds.hospital, mNumber : creds.mNumber}),
    })
      .then((data) => data.json())
      .then((data) => {


       if(data.success){ setPrompt({display : true, message: "Verification mail sent successfully verify your account!!", button: "Okay"});
    navigate('/doc-login')} 
    else {


     if(data.status === 101){ setPrompt({display : true, message: "You are already registered", button: "Okay"});
     
}
else setPrompt({display : true, message: "You are already registered", button: "Okay"});

    }
    
           
      })
      .catch((err) =>{console.log(err);
    setPrompt({display : true, message: "Can't create account right now", button: "Try some Time later"})
    });
 
 
    setTimeout(()=>{
      setPrompt({display : false, message: "", button: ""})
  
  },3000)
   

    e.preventDefault();
  };

  return (
    <div className="h-screen">
      <div className="flex flex-col items-center h-3/4  justify-evenly  ">
        <div className="">
          Full Name* :{" "}
          <input
            type="text"
            onChange={change}
            name="fName"
            value={creds.fName}
            className="outline outline-1"
          />
        </div>
        <div className="">
          Email* :{" "}
          <input
            type="text"
            onChange={change}
            name="email"
            value={creds.email}
            className="outline outline-1"
          />
        </div>
        <div className="">
          Age* :{``}
          <input max={110} min={0}
            type="number"
            onChange={change}
            name="age"
            value={creds.age}
            className="outline outline-1"
          />
        </div>
        <div className="">
          phone Number* :{``}
          <input max={110} min={0}
            type="number"
            onChange={change}
            name="mNumber"
            value={creds.mNumber}
            className="outline outline-1"
          />
        </div>
        <div className="">
          gender* :{" "}
<select name="gender"  className="" id="gender" onChange={change}>
<option value="">Select</option>
<option value="M">MALE</option>
<option value="F">FEMALE</option>
<option value="F">Not to disclose</option>

</select>

          
        </div>
       

  


     { !checkBox &&  
        <div className="">
          Type* :{" "}
         
         
         
         
          <select name="type" className="" onChange={change}>
            <option value="">Select</option>
            {type?.map((e)=>{

return <option key={e} value={e}>{e}</option>

            })}



{/* <option value="Dentist">Dentist</option> */}
</select> </div>}
<div >

Not above : <input type="checkbox"  onClick={checkClick} id="" />
</div>


{checkBox && <div className="">
          Type :{" "}
          <input
            type="text"
            onChange={change}
            name="type"
            value={creds.type}
            className="outline outline-1"
          />
        </div>}


<div className="">
          Description :{" "}
          <textarea
            type="text"
            onChange={change}
            name="desc"
            value={creds.desc}
            className="outline outline-1"
          />
        </div>

<div className="">
          Hospital :{" "}
          <input
            type="text"
            onChange={change}
            name="hospital"
            value={creds.hospital}
            className="outline outline-1"
          />
        </div>
        <div className="">
          location* :{" "}
          <input
            type="text"
            onChange={change}
            name="location"
            value={creds.location}
            className="outline outline-1"
          />
        </div>


        <div>
          Password* :{" "}
          <input 
            type="text"
            onChange={change}
            name="password"
            value={creds.password}
            className="outline outline-1"
          />
        </div>
        <div>
       Confirm   Password :{" "}
          <input
            type="text"
            onChange={change}
            name="cpassword"
            value={creds.cpassword}
            className="outline outline-1"
          />
        </div>
        <button disable={(creds.password !== creds.cpassword || creds.password.length < 5).toString()}
          onClick={handleClick}
          className={`px-10 py-3  ${ (creds.password !== creds.cpassword || creds.password.length < 5) ?  "bg-red-500" : "bg-blue-500 hover:bg-blue-400 " } text-white hover:text-black rounded-full`}
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default DocSignup;
