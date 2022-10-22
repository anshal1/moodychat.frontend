import React from 'react'
import "../Styling/MessageCard.css"
import { useNavigate } from "react-router-dom"
const MessageCard = (props) => {
    const navigate = useNavigate()
    // ? this function shows the message to the user when user hover on the mood message from the preadded we imported before
    const show = (e) => {
        e.target.innerHTML = props.mmood
    }
    // ? this function hides the message of mood
    const hide = (e) => {
        e.target.innerHTML = props.defaultMood
        e.target.ClassList = "feeling fw-bold"
    }
    return (
        <>
            <div className='main_messagecard_container'>
                <div onClick={props.navi}>
                    <img src={props.image} alt="" />
                    <p className="username">{props.username}<span id='online' className="position-absolute top-0 start-100 translate-middle p-2 bg-success border border-light rounded-circle">
                        <span className="visually-hidden">{props.online}</span>
                    </span></p>
                </div>
                <span className='feeling fw-bold' onMouseEnter={show} onMouseLeave={hide}>{props.defaultMood}</span>
                <span className={`date2 d-${props.none}`} onClick={props.delete}><i className="fa-solid fa-trash"></i></span>
                <span className='date'>{props.time}</span>
            </div>
        </>
    )
}

export default MessageCard
