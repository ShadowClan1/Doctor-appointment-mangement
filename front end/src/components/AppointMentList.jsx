import React, { useEffect, useState } from "react";
import {GiCancel} from 'react-icons/gi'
import { Link } from "react-router-dom";
function AppointMentList({ e, doc }) {
  const [doctorDetails, setDoctorDetails] = useState({});
  const [color, setColor] = useState("Waiting");
  useEffect(() => {
    fetch("http://localhost:5000/get-doc-des-from-id", {
      method: "GET",
      headers: {
        id: e.doctorId,
      },
    })
      .then((data) => data.json())
      .then((data) => {
       
        setDoctorDetails(data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    setColor(e?.status);
  }, []);

  const cancel = async (id) => {
    const userId = localStorage.getItem("userId");

    if (!doc) {
      //for user
      await fetch("http://localhost:5000/cancel-appointment", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          authtoken : localStorage.getItem('token'),
          user : localStorage.getItem('userId')
        },
        body: JSON.stringify({
          userId: userId,
          doctorId: e.doctorId,
          id: id,
          date: e.date,
          time: e.visitTime,
        }),
      })
        .then((data) => data.json())
        .then((data) => {
          setColor("Canceled");
          
        })
        .catch((err) => {
          console.log(err);
        });

    } else {
     
      await fetch("http://localhost:5000/cancel-appointment-doc", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          date: e.date,
          time: e.visitTime,
          userId: e.patientId,
          doctorId: e.doctorId,
          id: id,
        }),
      })
        .then((data) => data.json())
        .then((data) => {
          setColor("Canceled");
          
        })
        .catch((err) => {
          
        });
    }
  };
  const approve = async (id) => {
    await fetch("http://localhost:5000/approve-appointment", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        date: e.date,
        time: e.visitTime,
        userId: e.patientId,
        doctorId: e.doctorId,
        id: id,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        setColor("Approved");
  
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="">
      <hr />
      <div key={e} className={` pl-4 py-4     flex `} style={{}}>
        <div>
          <h1 className="text-3xl flex flex-row items-center gap-4">
            {doctorDetails?.fName}{" "}
            <span
              className={` outline outline-1 text-sm px-2 bg-opacity-20 py-1 ${
                color == "Waiting" &&
                "bg-yellow-300 text-yellow-300 outline-yellow-300"
              } ${
                color == "Approved" &&
                "bg-green-300 text-green-400 outline-green-400"
              } ${color == "Canceled" && "bg-red-300 text-red-500 "}`}
            >
              {color}{" "}
            </span>
          </h1>{" "}
          {e.date} At - {e.visitTime.substring(0, 5)} ( {e?.remarks} )
          <div>{doctorDetails?.location} </div>
        </div>

      <div className="absolute right-10 ">
        {color !== "Canceled" && color !== 'Completed'  && (
          <button
            className="bg-red-400 bg-opacity-10 p-1 text-3xl rounded-full text-red-400 hover:text-red-500 "
            onClick={() => {
              cancel(e.id);
            }}
          >
<GiCancel/>
          </button>
        )}
{color === 'Completed' && <button> &#8377; {e?.charged}</button>}


        {color === "Waiting" && doc && (
          <button
            className="bg-green-400 bg-opacity-10 p-1 text-3xl rounded-full text-green-400 hover:text-green-500 "
            onClick={() => {
              approve(e.id);
            }}
          >
            Approve
          </button>
        )}

{doc && color == 'Approved' && (<Link to={`/doc-home/completed-appointment/${e.id}`} >Completed </Link>)}


      </div>      </div>
    </div>
  );
}

export default AppointMentList;
