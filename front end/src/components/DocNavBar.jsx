import React from "react";
import { GiPowerButton } from "react-icons/gi";
import { useNavigate, NavLink } from "react-router-dom";

function DocNavBar({ notificationL }) {
  const active = "text-white  ";
  const passive =
    "text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1 rounded-xl ";
  const navigate = useNavigate();
  const token = localStorage.getItem("doc-token");
  const logout = () => {
    console.log("User logged out successfully");
    localStorage.clear();

    navigate("/doc-login");
  };
  return (
    <div className="fixex top-0 h-20 bg-black flex flex-row text-white justify-evenly items-center">
      <NavLink
        to="/doc-home"
        end
        className={({ isActive }) => {
          return isActive ? active : passive;
        }}
      >
        Home
      </NavLink>
      <NavLink
        to="/doc-home/doc-dashboard"
        className={({ isActive }) => {
          return isActive ? active : passive;
        }}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/doc-home/doc-notifications"
        className={({ isActive }) => {
          return isActive ? active + "relative" : passive + "relative";
        }}
      >
        Notifications{" "}
        {notificationL > 0 && (
          <div
            className="absolute text-xs w-4 text-center h-4 right-0 bg-red-400 rounded-full"
            style={{ top: "-5px", right: "-10px" }}
          >
            {notificationL > 0 && notificationL}
          </div>
        )}
      </NavLink>
      {/* <NavLink to=''>one</NavLink>
  <NavLink>one</NavLink> */}

      {token && (
        <button
          className="bg-white outline rounded-full  p-1 text-2xl hover:text-white hover:bg-black text-black"
          onClick={logout}
        >
          <GiPowerButton />
        </button>
      )}
    </div>
  );
}

export default DocNavBar;
