import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Context1 from "../../components/context/Context1";
import Timings from "../../components/Timings";

function Appointments() {
  const { users, setUsers, setErrorM, setPrompt } = useContext(Context1);
  const { id } = useParams();
  const userId = localStorage.getItem("userId");

  const [appoint, setAppoint] = useState({
    userId: "",
    date: "",
    hours: "",
    mins: "",
  });
  const change = (e) => {
    setAppoint({ ...appoint, [e.target.name]: e.target.value });
  };
  const load = () => {};

  const timings = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "13:00 PM",
    "13:30 PM",
    "14:00 PM",
    "14:30 PM",
    "15:00 PM",
    "15:30 PM",
    "16:00 PM",
    "16:30 PM",
  ];

  const navigate = useNavigate();

  const handleClick = async (e) => {
    // console.log(JSON.stringify(appoint));

    await fetch(`http://localhost:5000/make-appointment`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        user: localStorage.getItem("userId"),
        authtoken: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        userId: userId,
        doctorId: id,
        date: appoint.date,
        time: appoint.hours + ":" + appoint.mins,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        

        if (data.success) {
setPrompt({display : true, message: `Booked Appointment for ${appoint.date} -- ${appoint.hours + ":" + appoint.mins}` , button: "Okay"})

          navigate("/my-appointments");
        }
else {
  setPrompt({display : true, message: `Failed to book appointment` , button: "Okay"})
}
        
      })
      .catch((err) => {
        setPrompt({display : true, message: `Failed to book appointment` , button: "Okay"})
      
      });
      setTimeout(()=>{
        setPrompt({display : false, message: "", button: ""})
    
    },3000)

    e.preventDefault();
  };


  return (
    <div className="h-screen">
      <div className="flex flex-col items-center  h-3/4  justify-evenly  ">
        <div className="">
          date:{``}
          <input
            type="date"
            name="date"
            onChange={(e) => {
              change(e);
            }}
            value={appoint.date}
          />
        </div>
        <div className="">
          Time :{" "}
          {/* <input type="time" name="time" onChange={change} value={appoint.time}  /> */}
          <div className="flex flex-row flex-wrap gap-1 box-border w-5/6  items-center justify-center ">
            {appoint.date.length !== 0 &&
              timings.map((e) => {
                return (
                  <Timings
                    key={e}
                    e={e}
                    setTime={setAppoint}
                    time={appoint}
                    date={appoint.date}
                    id={id}
                  />
                );
              })}
          </div>
          {/* <select
            name="hours"
            id=""
            onChange={(e) => {
              change(e);
              checkChange();
            }}
          >
            <option value="">Select</option>
            <option value="10:00">10 AM</option>
            <option value="10:30">10:30 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="11:30">11:30 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="12:30">12:30 PM</option>
            <option value="13:00">01:00 PM</option>
            <option value="13:30">01:30 PM</option>
            <option value="14:00">02:00 PM</option>
            <option value="14:30">02:30 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="15:30">03:30 PM</option>
            <option value="16:00">04:00 PM</option>
            <option value="16:30">04:30 PM</option>
          </select>{" "} */}
        </div>

        <button
          onClick={handleClick}
          className={`px-10 py-3  ${
            appoint.date.length !== 0 &&
            appoint.hours.length !== 0 &&
            appoint.mins.length !== 0
              ? "bg-green-400 hover:bg-green-600"
              : "  bg-red-400 cursor-not-allowed"
          }  text-white rounded-full `}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default Appointments;
