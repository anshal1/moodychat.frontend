import React, { useContext } from 'react'
import Context from '../context/context'
import "../Styling/Loadingbox.css"
const Loadingbox = () => {
    const context = useContext(Context)
    const {display, loading_msg, setdisplay} = context
  return (
    <div className={`d-${display} main_loading_box`}>
        <button onClick={()=>{setdisplay("none")}}><i className={`fa-solid fa-circle-xmark`}></i></button>
      <div className="loading_msg_container">
        <p className="loading_msg">
            {loading_msg}
        </p>
      </div>
    </div>
  )
}

export default Loadingbox
