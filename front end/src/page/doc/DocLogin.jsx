import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import Context1 from "../../components/context/Context1";

function DocLogin() {
  const input = "rounded-full px-2 outline-green-300 py-1 ";
  const [creds, setCreds] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setPrompt } = useContext(Context1);
  const change = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  const handleClick = async (e) => {
    localStorage.clear();
    await fetch(`http://localhost:5000/doc-login`, {
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
        console.log(data);
        if (data.success) {
          localStorage.setItem("doc-token", data.token);
          localStorage.setItem("doc-userId", data.id);
          setPrompt({
            display: true,
            message: "Loged in successfully!!",
            button: "Login",
          });
          navigate("/doc-home");
        } else {
          if (data.code === 102) {
            setPrompt({
              display: true,
              message: "Wrong password Failed!!",
              button: "Login",
            });
          } else if (data.code === 112) {
            setPrompt({
              display: true,
              message: "User Not Verified!!",
              button: "Login",
            });
          } else if (data.code === 110) {
            setPrompt({
              display: true,
              message: "User dont exist!!",
              button: "Signup",
            });
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

  const styleBlock = "bg-black ";

  return (
    <div className="h-screen flex flex-col justify-end bg-green-100   relative">
      <img
        src="https://media-cdn.tripadvisor.com/media/photo-s/1c/67/2c/d1/our-beautiful-bar-where.jpg"
        alt=""
        className="absolute top-0 bottom-0 right-0 left-0 h-screen w-screen "
      />

      <div className="flex flex-col items-center  h-full justify-evenly relative z-10 bg-green-100 bg-opacity-30 ">
        <div></div>
        <div></div>
        <div className="">
          {/* EMAIL :{" "} */}
          <input
            type="text"
            onChange={change}
            name="email"
            value={creds.email}
            placeholder="Email"
            className={`outline outline-1 ${input}`}
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
            className={`outline outline-1 ${input}`}
          />
        </div>
        <button
          onClick={handleClick}
          className="px-10 py-3 bg-green-500 hover:bg-green-400 text-white hover:text-black rounded-full"
        >
          Login
        </button>
        <Link to="/doc-signup" className="hover:text-green-500">
          Signup
        </Link>
        <Link to="/forgot-password-doc">Forgot password</Link>
      </div>
    </div>
  );
}

export default DocLogin;
