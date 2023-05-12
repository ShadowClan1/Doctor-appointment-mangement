import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAvail() {
  const [appoint, setAppoint] = useState({
    userId: "",
    doctorId: "",
    date: "",
    time: "",
  });
  const change = (e) => {
    setAppoint({ ...appoint, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleClick = async (e) => {
    console.log(JSON.stringify(appoint));

    await fetch(`http://localhost:5000/make-appointment`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: appoint.userId,
        doctorId: appoint.doctorId,
        date: appoint.date,
        time: appoint.time,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
     
      })
      .catch((err) => {
        console.log(err);
      });

    e.preventDefault();
  };

  return (
    <div className="h-screen">
      <div className="flex flex-col items-center h-3/4  justify-evenly  ">
        <div className="">
          UserId :{" "}
          <input
            type="text"
            onChange={change}
            name="userId"
            value={appoint.userId}
            className="outline outline-1"
          />
        </div>
        <div className="">
          doctorId :{" "}
          <input
            type="text"
            onChange={change}
            name="doctorId"
            value={appoint.doctorId}
            className="outline outline-1"
          />
        </div>
        <div className="">
          date:{``}
          <input
            type="date"
            name="date"
            onChange={change}
            value={appoint.date}
          />
        </div>
        <div className="">
          gender :{" "}
          <input
            type="time"
            name="time"
            onChange={change}
            value={appoint.time}
          />
        </div>

        <button
          onClick={handleClick}
          className={`px-10 py-3   hover:text-black rounded-full`}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default CheckAvail;
