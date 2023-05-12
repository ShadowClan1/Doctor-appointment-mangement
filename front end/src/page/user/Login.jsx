import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context1 from "../../components/context/Context1";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("userId"))
      navigate("/home");
  }, []);

  const [creds, setCreds] = useState({ email: "", password: "" });
  const { setPrompt } = useContext(Context1);
  const change = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  const handleClick = async (e) => {
    localStorage.clear();
    await fetch(`http://localhost:5000/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: creds.email.toLocaleLowerCase(),
        password: creds.password,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
  
        if (data.status) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.id);
          setPrompt({
            display: true,
            message: "Loged in successfully!!",
            button: "Okay",
          });
          navigate("/");
        } else {
          if (data.code === 111) {
            setPrompt({
              display: true,
              message: "Account not verfied yet!!",
              button: "Okay",
            });
          } else if (data.code === 102) {
            setPrompt({
              display: true,
              message: "Wrong password!!",
              button: "Login",
            });
          } else if (data.code == 110) {
            setPrompt({
              display: true,
              message: "User dont exists!!",
              button: "Signup",
            });
            navigate("/signup");
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setPrompt({ display: true, message: "Failed!!", button: "Login" });
      });

    e.preventDefault();
    setTimeout(() => {
      setPrompt({ display: false, message: "", button: "" });
    }, 3000);
  };

  const styleBlock = "bg-black  ";

  return (
    <div className="h-screen">
      <div className="flex flex-col items-center h-3/4  justify-evenly  ">
        <div className="">
          {/* EMAIL :{" "} */}
          <input
            type="text"
            placeholder="Email"
            onChange={change}
            name="email"
            value={creds.email}
            className="outline outline-1 outline-blue-300 px-3 py-1 rounded-3xl focus-within:outline-blue-500 placeholder:text-blue-300 "
          />
        </div>
        <div>
          {/* Password :{" "} */}
          <input
            placeholder="Password"
            type="text"
            onChange={change}
            name="password"
            value={creds.password}
            className="outline outline-1 outline-blue-300 px-3 py-1 rounded-3xl focus-within:outline-blue-500 placeholder:text-blue-300"
          />
        </div>
        <button
          onClick={handleClick}
          className="px-10 py-3 bg-blue-500 hover:bg-blue-400 text-white hover:text-black rounded-full"
        >
          Login
        </button>
        <Link to="/signup">Signup</Link>
        <Link to="/forgot-password">Forgot password</Link>
      </div>
    </div>
  );
}

export default Login;
