import React, { useRef } from 'react'
import "../Styling/Chatbox.css"
import demo from "../img/download.jpg"
import { useEffect } from 'react'
import { useContext } from 'react'
import Context from '../context/context'
import { useState } from 'react'
import { format } from 'timeago.js';
import { useLocation, useNavigate } from 'react-router-dom'
import Loadingbox from './Loadingbox'
import URL from './URL'
const Chatbox = () => {
    const location = useLocation()
    const [sidePanel, setsidePanel] = useState("side_pannel")
    const navigate = useNavigate()
    const scrollRef = useRef(null)
    const [msg, setmsg] = useState("")
    const [chats, setchats] = useState([])
    const [arrivedChat, setarrivedChat] = useState(null)
    const context = useContext(Context)
    const { socket, setalert, setdisplay, setloading_msg, user, getUser, onlineusers, setonlineusers } = context
    const [room_data, setroom_data] = useState({})
    const btnref= useRef(null)
    const fetch_Room_data = async () => {
        let url = `${URL}/get/room/?room=${location.pathname.slice(6)}`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                unknown: localStorage.getItem("user") || localStorage.getItem("guest")
            }
        })
        let res = await data.json()
        setroom_data(res.find_room)
        setonlineusers(res.find_room.no_of_user_joined)
    }
    // ? using socket
    useEffect(() => {
        socket?.on("you_got_kicked", data => {
            if (data) {
                setloading_msg(data)
                setdisplay("block")
                setTimeout(() => {
                    navigate("/")
                }, 2000)
            }
        })
        socket?.on("user_kicked", data => {
            setalert({
                text: data,
                style: "mainalertcontainer_display"
            })
        })
        socket?.on("user_connected_to_room", data => {
            if (data) {
                fetch_Room_data()
            }
        })
        socket?.on("Welcome_msg", data => {
            fetch_Room_data()
            setalert({
                text: data,
                style: "mainalertcontainer_display"
            })
            if (data) {
                setdisplay("none")
            }
        })
        socket?.on("welcome_msg_private", data => {
            fetch_Room_data()
            setalert({
                text: data,
                style: "mainalertcontainer_display"
            })
        })
        socket?.on("send_msg_to_room", data => {
            if (data) {
                scrollRef.current?.scrollIntoView({ behavior: "smooth" })
                setarrivedChat(data.data)
            }
        })
        socket?.on("room_deleted_msg", data => {
            if (data) {
                setdisplay("block")
                setloading_msg(data)
            }
            if (window.innerWidth <= 1000) {
                setalert({
                    text: "This room has been deleted by the user",
                    style: "mainalertcontainer_display"
                })
            }
            fetch_Room_data()
            setTimeout(() => {
                navigate("/")
            }, 2000)
        })
        socket?.on("user_left", data => {
            if (data) {
                fetch_Room_data()
                setalert({
                    text: `${data.username} left the chat`,
                    style: "mainalertcontainer_display"
                })
            }
        })
        // eslint-disable-next-line 
    }, [socket])
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [arrivedChat])
    useEffect(() => {
        if (arrivedChat !== null) {
            setchats((prev) => [...prev, arrivedChat])
        }
    }, [arrivedChat])
    // ? this function will send the message 
    const Send = async () => {
        if (msg) {
            let url = `${URL}/send/message/?room=${localStorage.getItem("room")}`
            let data = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    unknown: localStorage.getItem("user") || localStorage.getItem("guest")
                },
                body: JSON.stringify({ text: msg })
            })
            let res = await data.json()
            if (res.createMessage) {
                socket?.emit("receive_msg_from_room", { data: res.createMessage })
                setmsg("")
            }
        } else {
            setalert({
                text: "Message cannot be empty",
                style: "mainalertcontainer_display"
            })
        }
    }
    const AllChats = async () => {
        let url = `${URL}/fetch/all/chat?room_id=${localStorage.getItem("room")}`
        let data = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                unknown: localStorage.getItem("user") || localStorage.getItem("guest")
            }
        })
        let res = await data.json()
        if (res.allchats) {
            setchats(res.allchats)
        }
    }
    useEffect(() => {
        getUser()
        AllChats()
    }, [])
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chats])
    // ? This event lister is for , so that the user dosent have to click the Send button all the time to send message he can just click Enter
    useEffect(() => {
        window.addEventListener("keyup", async(event)=>{
            if(event.key === "Enter"){
                btnref.current.click()
            }
        })
    }, [])
    window.onload = () => {
        if (user) {
            setdisplay("block")
            socket?.emit("loaded", { roomname: localStorage.getItem("room"), socket: socket.id, user: { username: user.username } })
        }
    }
    // ? function to leave the chat
    const LeaveChat = async () => {
        let url = `${URL}/leave/chat/${location.pathname.slice(6)}`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                unknown: localStorage.getItem("user") || localStorage.getItem("guest")
            }
        })
        let res = await data.json()
        if (res.edit) {
            navigate("/")
            setalert({
                text: "You left the chat",
                style: "mainalertcontainer_display"
            })
            socket?.emit("leave_room", { roomname: localStorage.getItem("room"), socket: socket.id, username: user.username })
        } else if (res.error) {
            setalert({
                text: res.error,
                style: "mainalertcontainer_display"
            })
        }
        console.log(res)
    }

    // ? function to kick user from the room
    const kickUser = async (kick_user) => {
        let url = `${URL}/kick/user/?room=${location.pathname.slice(6)}&user=${kick_user}&owner=${user.username}`
        let data = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                unknown: localStorage.getItem("user") || localStorage.getItem("guest")
            }
        })
        let res = await data.json()
        console.log(res)
        if (res.edit && res.msg) {
            setonlineusers(res.edit.no_of_user_joined)
            setalert({
                text: res.msg,
                style: "mainalertcontainer_display"
            })
            socket?.emit("kick_out", { res, kick_user })
        } else if (res.error) {
            setalert({
                text: res.error,
                style: "mainalertcontainer_display"
            })
        }
    }
    const ShowPanel = () => {
        setsidePanel("side_pannel_block")
        if (sidePanel === "side_pannel_block") {
            setsidePanel("side_pannel")
        }
    }
    return (
        <>
            <div className="mainChatbox">
                <div className="userbox">
                    <div className='user_info'>
                        <img src={demo} id="profile" alt="" />
                        <p className="username text-dark">{user.username}</p>
                    </div>
                    <p className="roomname text-dark mx-1"> Room:- {localStorage.getItem("room")}</p>
                    <div className="options">
                        <i className="fa-solid fa-bars" onClick={ShowPanel}></i>
                    </div>
                    <div className={`${sidePanel}`}>
                        <p className="connected_users">
                            Connected users
                        </p>
                        {onlineusers?.map((users) => {
                            return <li key={users} className="onlineuser">
                                {users === user.username ? "You" : users}
                                {users !== room_data.username && room_data.username === user.username ? <span className='kick_user' onClick={() => { kickUser(users) }}>Kick user</span> : ""}
                            </li>
                        })}
                        <p className="leave_Chat" onClick={LeaveChat}>
                            Leave Chat
                        </p>
                    </div>
                </div>
                {chats ? <div>
                    {chats.map((e) => {
                        return <p ref={scrollRef} className={e.username === user.username ? "right" : "left"} key={e._id}>{e.text}<img src={demo} id={e.username === user.username ? "msg_profile" : "msg_profile2"} alt="" /><span id={e.username === user.username ? "msg_profile_other2" : "msg_profile_other"}>{format(e.date)}</span></p>
                    })}
                </div> : <h1>No chats so far</h1>}


                {/* <p className="left">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime dolor officiis sint omnis unde, cupiditate alias. Reiciendis aspernatur illum quos!<img src={demo} id="msg_profile_other" alt="" /></p> */}
                <div className='send_box'>
                    <input type="text" className='send_input' onChange={(e) => { setmsg(e.target.value) }} value={msg} />
                    <button className='sendbtn' ref={btnref} onClick={Send} >Send</button>
                </div>
            </div>
            <Loadingbox />
        </>
    )
}

export default Chatbox
