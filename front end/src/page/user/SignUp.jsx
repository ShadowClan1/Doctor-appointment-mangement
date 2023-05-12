import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Context1 from "../../components/context/Context1";

function Signup() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("userId"))
      navigate("/");
  }, []);

  const { users, setUsers, setErrorM, setPrompt } = useContext(Context1);
  const [creds, setCreds] = useState({
    email: "",
    password: "",
    fName: "",
    age: 0,
    gender: "",
    accountType: "P",
    cpassword: "",
    mNumber: "",
  });
  const change = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleClick = async (e) => {
    if (creds.email.length < 5) {
      setErrorM({ message: "Length of email should be greater than 5" });

      setTimeout(() => {
        setErrorM({ message: "" });
      }, 3500);
    }

    await fetch(`http://localhost:5000/signup`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: creds.email.toLowerCase(),
        password: creds.password,
        age: creds.age,
        gender: creds.gender,
        fName: creds.fName,
        accountType: creds.accountType,
        mNumber: creds.mNumber,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status) {
          setPrompt({
            display: true,
            message: "Verification mail sent to the Email id",
            button: "Login",
          });
          navigate("/login");
        } else {
          return setPrompt({
            display: true,
            message: "Unable to create account please try in some time",
            button: "Okay",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setPrompt({
          display: true,
          message: "Can't create account right now",
          button: "Try some Time later",
        });
      });

    setTimeout(() => {
      setPrompt({ display: false, message: "", button: "" });
    }, 3000);

    e.preventDefault();
  };

  return (
    <div className="h-screen">
      <div className="flex flex-col items-center h-3/4  justify-evenly  ">
        <div className="">
          Full Name :{" "}
          <input
            type="text"
            onChange={change}
            name="fName"
            value={creds.fName}
            className="outline outline-1"
          />
        </div>
        <div className="">
          Email :{" "}
          <input
            type="text"
            onChange={change}
            name="email"
            value={creds.email}
            className="outline outline-1"
          />
        </div>
        <div className="">
          Age :{``}
          <input
            max={110}
            min={0}
            type="number"
            onChange={change}
            name="age"
            value={creds.age}
            className="outline outline-1"
          />
        </div>
        <div className="">
          Mobile Number *:{``}
          <input
            max={110}
            min={0}
            type="number"
            onChange={change}
            name="mNumber"
            value={creds.mNumber}
            className="outline outline-1"
          />
        </div>
        <div className="">
          gender :{" "}
          <select name="gender" className="" id="gender" onChange={change}>
            <option value="">Select</option>
            <option value="M">MALE</option>
            <option value="F">FEMALE</option>
            <option value="F">Not to disclose</option>
          </select>
        </div>
        {/* <div className="">
          Patient/Doctor :{" "}
          <select name="accountType"  className="" id="gender" onChange={change}>
<option value="">Select</option>
<option value="P">Patient</option>
<option value="D">Doctor</option>


</select>
         
        </div> */}
        <div>
          Password :{" "}
          <input
            type="text"
            onChange={change}
            name="password"
            value={creds.password}
            className="outline outline-1"
          />
        </div>
        <div>
          Confirm Password :{" "}
          <input
            type="text"
            onChange={change}
            name="cpassword"
            value={creds.cpassword}
            className="outline outline-1"
          />
        </div>
        <button
          disable={(
            creds.password !== creds.cpassword || creds.password.length < 5
          ).toString()}
          onClick={handleClick}
          className={`px-10 py-3  ${
            creds.password !== creds.cpassword || creds.password.length < 5
              ? "bg-red-500"
              : "bg-blue-500 hover:bg-blue-400 "
          } text-white hover:text-black rounded-full`}
        >
          Signup
        </button>

        <Link to="/doc-signup">Signup As a doctor</Link>
      </div>
    </div>
  );
}

export default Signup;
