import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillStar, AiHome } from "react-icons/ai";
import { GrMapLocation } from "react-icons/gr";
import { CiHospital1 } from "react-icons/ci";
function FindDoc() {
  const [doctors, setDoctors] = useState([]);
  const { type } = useParams();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    fetch("http://localhost:5000/find-doc-key", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        
          'authtoken' : localStorage.getItem('token'),
          user: localStorage.getItem("userId"),
     

      },
      body: JSON.stringify({ search: search, type: type }),
    })
      .then((data) => data.json())
      .then((data) => {
        setDoctors(data.data);
    
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const change = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    fetch("http://localhost:5000/get-doc-from-type", {
      method: "GET",
      headers: {
        type: type,
  
          'authtoken' : localStorage.getItem('token'),
          user: localStorage.getItem("userId"),
        

      },
    })
      .then((data) => data.json())
      .then((data) => {
     
        setDoctors(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="">
      <input
        type="text"
        name="search"
        placeholder="Enter three letters minimum"
        className="outline outline-1 mt-10 ml-10 mb-5 px-3 py-1 rounded-md"
        id=""
        onChange={change}
        value={search}
      />{" "}
      <button
        className="bg-black text-white hover:bg-slate-900 px-3 py-1 rounded-lg"
        onClick={handleSearch}
      >
        search
      </button>
      <div className="pl-4">Showing Results for : {type} </div>
      <div className="flex flex-col ">
        {doctors?.map((e) => {
          return (
            <div
              className="pl-5 outline outline-1 py-2 hover:scale-101  hover:pl-10"
              style={{ transitionDuration: "0.4s" }}
              key={e}
            >
              <Link to={`/doctor/${e.id}`}>
                <h1 className="text-3xl">{e?.fName}</h1>
                <p className="flex flex-row  gap-2">
                  {" "}
                  <GrMapLocation /> {e.location}
                </p>
                <p className="flex flex-row justify-evenly">
                  {" "}
                  <p className="flex flex-row items-center gap-2">
                    <CiHospital1 /> {e?.hospital}{" "}
                  </p>{" "}
                  <p className="flex flex-row items-center ">
                    Rating : {e?.rating} <AiFillStar />{" "}
                  </p>{" "}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FindDoc;
