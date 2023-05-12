import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {BsPower} from 'react-icons/bs'
function Navbar({notifications}) {
  const active = 'text-white  '
  const passive = 'text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1 rounded-xl'
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const logout = ()=>{
   
localStorage.clear()

    navigate('/login')
  }
  return (
    <div className='fixex top-0 h-20 bg-black flex flex-row text-white justify-evenly items-center' >

<NavLink to='/' end className={({isActive, isPending})=>{  return isActive? active : passive }} >Home</NavLink>
<NavLink to='/my-appointments' className={({isActive, isPending})=>{  return isActive? active : passive }}>appointments</NavLink>
<NavLink to='/notifications' className={({isActive, isPending})=>{  return isActive? active + " relative " : passive + " relative "  } }>Notifications  
{notifications?.length > 0 &&  <span className='absolute top-0 text-xs bg-red-400 w-4 h-4 text-center items-center rounded-full ' >{notifications?.length}</span>}

  </NavLink>
<NavLink to='/profile' className={({isActive, isPending})=>{  return isActive? active : passive }} >profile</NavLink>

  { token &&  <button className='bg-red-300 bg-opacity-20 rounded-full text-2xl p-1 outline outline-1 text-red-400' onClick={logout} ><BsPower/></button>}



    </div>
  )
}

export default Navbar