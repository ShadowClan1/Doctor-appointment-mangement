import { useState } from "react";
import Context1 from "./Context1"



const Context2 = (props)=>{
    const [users, setUsers] = useState([]);

const getData = ()=>{
    fetch('http://localhost:5000/', {
        method : 'get'
      }).then((data)=>data.json()).then((data)=>{
        console.log(data);
        setUsers(data)
      })
}
const [errorM, setErrorM] = useState({
    v : false , message :""
})


const [prompt, setPrompt] = useState({display: false, message : "" , button : ""})



return (
    <Context1.Provider value={{users, setUsers,getData, errorM, setErrorM, prompt, setPrompt}} >

{props.children}

    </Context1.Provider>
)


}

export default Context2;