import React from 'react'
import { useState } from 'react'
import "../Styling/CreateChat.css"
import chat from "../img/chat.jpg"
import img from "../img/refferrence.png"
import URL from "./URL"
import { useContext } from 'react'
import Context from "../context/context.js"
import { useNavigate } from 'react-router-dom'
const CreateChat = () => {
    const navigate = useNavigate()
    // ? context api
    const context = useContext(Context)
    const { setalert, socket } = context
    // ? using socket.io

    // ? this is all related to client-side
    // ? all states to display inputs tags to add custom value
    const [Private, setprivate] = useState("none")
    const [time, settime] = useState("none")
    const [mood, setmood] = useState("none")

    // ? states for changing the state of the dropdown
    const [chattype, setchattype] = useState("")
    const [customtime, setcustomtime] = useState("")
    const [moodtype, setmoodtype] = useState("")


    // ? this is all related to server-side
    const [roomname, setroomname] = useState("")
    const [password, setpassword] = useState("")
    const [duration, setduration] = useState("")
    const [currentMood, setcurrentMood] = useState("")
    const [numberofuser, setnumberofuser] = useState(null)
    const [custommessage, setcustommessage] = useState("")

    // ? function to create a new Chat
    const CreateChat = async () => {
        let url = `${URL}/chat/create/v0`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                unknown: localStorage.getItem("user") || localStorage.getItem("guest")
            },
            body: JSON.stringify({ chatname: roomname, chattype: chattype, password: password, time: duration, no_of_users: numberofuser, Mood: currentMood, custom_msg: custommessage })
        })
        let res = await data.json()
        if (res.res) {
            setalert({
                text: "Chat room created",
                style: "mainalertcontainer_display"
            })
            navigate("/")
            setroomname("")
            setpassword("")
            setduration("")
            setcurrentMood("")
            setnumberofuser(null)
            setcustommessage("")
            socket?.emit("roomcreated", res.res)
        } else if (res.error) {
            setalert({
                text: res.error,
                style: "mainalertcontainer_display"
            })
            console.log(res.error)
        } 
    }
    return (
        <>
            <div className="main_createchat">
                <div className="createrM">
                    <p id='message'>Create new chat room to chat with others according to your mood</p>
                    <img src={chat} alt="Create a chat" id='createchat_img' />
                </div>
                <div className="createchat">
                    <div>
                        {/* Chat name default will be user's username */}
                        <input type="text" name="chatname" value={roomname} onChange={(e) => { setroomname(e.target.value) }} id="chatname" placeholder='Chat Room Name' />
                        {/* chat type open or private */}
                        <div className="btn-group my-3">
                            <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                {!chattype ? "Chat type" : chattype}
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item fw-bold" onClick={(e) => {
                                    setchattype(e.target.innerHTML)
                                    // ? setting password to open when user selects open to use later in the project
                                    setpassword(e.target.innerHTML)
                                    setprivate("none")
                                }}>Default(Open)</a></li>
                                <li><a className="dropdown-item fw-bold" onClick={(e) => {
                                    setchattype(e.target.innerHTML)
                                    setprivate("block")
                                }}>Private</a></li>
                            </ul>
                        </div>
                        {/* chat password */}
                        <input className={`d-${Private}`} type="text" value={password} onChange={(e) => { setpassword(e.target.value) }} name="password" id="chatpassword" placeholder='Chat Room Password' />
                    </div>
                    <div>
                        {/* duration */}
                        <div className="btn-group my-3">
                            <button type="button" className="btn btn-secondary dropdown-toggle " data-bs-toggle="dropdown" aria-expanded="false">
                                {!customtime ? "Choose duration" : customtime}
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item fw-bold" onClick={
                                    (e) => {
                                        setcustomtime(e.target.innerHTML)
                                        setduration(e.target.innerHTML)
                                        settime("none")
                                    }
                                }>24Hr</a></li>
                                <li><a className="dropdown-item fw-bold" onClick={(e) => {
                                    setcustomtime(e.target.innerHTML)
                                    setduration(e.target.innerHTML)
                                    settime("none")
                                }}>1Hr</a></li>
                                <li><a className="dropdown-item fw-bold" onClick={(e) => {
                                    setcustomtime(e.target.innerHTML)
                                    settime("block")
                                }}>Custom</a></li>
                            </ul>
                        </div>
                        <input type="date" value={duration} onChange={(e) => { setduration(e.target.value) }} className={`d-${time}`} name="time" id="time" />
                        <input type="number" value={numberofuser} onChange={(e) => { setnumberofuser(e.target.value) }} name="no of user" min={2} max={10} id="noOfuser" placeholder='Number of users' />
                    </div>
                    <div>
                        {/* Chat moto */}
                        <div className="btn-group my-3">
                            <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                {!moodtype ? "Choose your mood" : moodtype}
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item fw-bold" onClick={(e) => {
                                    setmoodtype(e.target.innerHTML)
                                    setcurrentMood(e.target.innerHTML)
                                    setmood("block")
                                }}>Happy</a></li>
                                <li><a className="dropdown-item fw-bold" onClick={(e) => {
                                    setmoodtype(e.target.innerHTML)
                                    setcurrentMood(e.target.innerHTML)
                                    setmood("block")
                                }}>Sad</a></li>
                                <li><a className="dropdown-item fw-bold" onClick={(e) => {
                                    setmoodtype(e.target.innerHTML)
                                    setcurrentMood(e.target.innerHTML)
                                    setmood("block")
                                }}>Angry</a></li>
                                <li><a className="dropdown-item fw-bold" onClick={(e) => {
                                    setmoodtype(e.target.innerHTML)
                                    setcurrentMood(e.target.innerHTML)
                                    setmood("block")
                                }}>Frustrated</a></li>
                                <li><a className="dropdown-item fw-bold" onClick={(e) => {
                                    setmoodtype(e.target.innerHTML)
                                    setcurrentMood(e.target.innerHTML)
                                    setmood("block")
                                }}>Feeling Alone</a></li>
                                <li><a className="dropdown-item fw-bold" onClick={(e) => {
                                    setmoodtype(e.target.innerHTML)
                                    setmood("block")
                                    setcurrentMood("")
                                }}>Didn't find your mood?! create your's then</a></li>
                            </ul>
                        </div>
                        <input type="text" value={currentMood} onChange={(e) => { setcurrentMood(e.target.value) }} className={`d-${mood}`} name="mood" id="Mood" placeholder='Feeling " "?' />
                    </div>
                    <textarea type="text" value={custommessage} maxLength={70} onChange={(e) => {
                        setcustommessage(e.target.value)
                        if (e.target.value.length >= 70) {
                            setalert({
                                text: "Custom message cannot be greater than 70 character",
                                style: "mainalertcontainer_display"
                            })
                        }
                    }} className={`d-${mood}`} name="customMoto" id="customMoto" placeholder='Custom Chat message' />
                    <img src={img} className={`d-${mood}`} alt="refference" id='refference' /><span className={`d-${mood}`} id='arrow'></span>
                    <button className='createChat_btn' onClick={CreateChat}>Create Chat </button>
                </div>
            </div>
        </>
    )
}

export default CreateChat
