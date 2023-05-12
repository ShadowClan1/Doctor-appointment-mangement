import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DocH() {
  const [month, setMonth] = useState("");
  const [total, setTotal] = useState("");
  const [doc, setDoc] = useState({});

  const verify = (e) => {
    fetch("http://localhost:5000/generate-otp-doc", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ id: localStorage.getItem("doc-userId") }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success)
          setTimeout(() => {
            // navigate('/verify-mobile')
          }, 3000);
      })
      .catch((err) => {
        console.log(err, "Front end error");
      });

    e.preventDefault();
  };

  useEffect(() => {
    fetch("http://localhost:5000/get-doc-info", {
      method: "GET",
      headers: {
        doc: localStorage.getItem("doc-userId"),
      },
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data)
        setDoc(data);
      })
      .catch((err) => {
        console.log(err);
      });
    fetch("http://localhost:5000/doc-earning-total", {
      method: "GET",
      headers: {
        docid: localStorage.getItem("doc-userId"),
      },
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setTotal(data.data[0].sum);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch("http://localhost:5000/doc-earning-month", {
      method: "GET",
      headers: {
        docid: localStorage.getItem("doc-userId"),
      },
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setMonth(data.data[0].sum);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="w-screen">
      <div className="mt-5 ml-5 ">
        <h1 className="text-3xl">Profile</h1>
        <div className="flex flex-col text-2xl">
          <div>Name : {doc?.fName}</div>
          <div>Speciality : {doc?.type}</div>

          <div>{doc?.hospital && <> Hospital : {doc.hospital}</>}</div>
          <div>{doc?.location && <> Location : {doc.location}</>}</div>
          <div>{doc?.email && <> Email : {doc.email}</>}</div>
          <div>
            {doc?.mNumber && <> Phone Number : {doc.mNumber}</>}{" "}
            {doc.temp && JSON.parse(doc.temp).v === "T" ? (
              <>
                <div className="bg-green-400">
                 verified
                </div>
              </>
            ) : (
              <>
                {" "}
                Not verified :{" "}
                <button
                  className="bg-slate-300 px-2 py-1 rounded-lg hover:shadow-lg hover:bg-slate-400 "
                  onClick={verify}
                >
                  <Link to="/verify-mobile" state={{ from: "D" }}>
                    verify
                  </Link>
                </button>{" "}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-evenly mt-10">
        <div>
          This month earning :
          <div
            className="bg-black text-white h-32 w-32 text-center items-center flex justify-center text-xl rounded-xl hover:scale-105"
            style={{ transitionDuration: "0.3s" }}
          >
            {" "}
            &#8377;{month ? month : 0}
          </div>
        </div>
        <div>
          Your total earning :
          <div
            className="bg-black text-white h-32 w-32 text-center items-center flex justify-center text-xl rounded-xl hover:scale-105"
            style={{ transitionDuration: "0.3s" }}
          >
            &#8377; {total ? total : 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocH;
