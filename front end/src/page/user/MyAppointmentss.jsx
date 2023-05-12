import React, { useContext, useEffect, useState } from "react";
import AppointMentList from "../../components/AppointMentList";
import Context1 from "../../components/context/Context1";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
const {setPrompt} = useContext(Context1)
  useEffect(() => {
    fetch("http://localhost:5000/get-appointments", {
      method: "GET",
      headers: {
        'authtoken' : localStorage.getItem('token'),
        user: localStorage.getItem("userId"),
      },
    })
      .then((data) => data.json())
      .then((data) => {
       if(data.success){
         setAppointments(data.data);

       }
       else {

       }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



  return (
    <div>
      <div className="mt-5 ml-5 text-3xl">MAppointments : {appointments?.length === 0 && "no appointments found"}</div>

      <div className="flex flex-col mt-10 ">
      {appointments?.map((e) => {
          return (
        
          <AppointMentList key={Math.random()} e={e} />
             
          );
        })}
      </div>
      <hr />
    </div>
  );
}

export default MyAppointments;
