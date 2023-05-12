import React, { useContext } from 'react'
import Context1 from './context/Context1'
import { AiOutlineClose } from 'react-icons/ai'

function Prompt() {
    const {prompt, setPrompt} = useContext(Context1)
  return (
    <>
   {prompt.display  && <div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-30 z-50'>
    <div className='bg-white h-28 w-64 ouline shadow-2xl border  relative flex flex-col py-2 px-3 items-center'>
        <button className='absolute top-0 right-0 text-xl bg-red-300 rounded-sm  text-red-400' onClick={()=>{
 setPrompt({display : false, message: "", button: ""})


        }} ><AiOutlineClose/></button>  
<div>{prompt.message}</div>
<button className='absolute bottom-0 bg-yellow-400 px-3 py-2 rounded-xl  ' onClick={()=>{
 setPrompt({display : false, message: "", button: ""})}} >{prompt.button} </button>

    </div>
    </div>}
    </>
  )
}

export default Prompt