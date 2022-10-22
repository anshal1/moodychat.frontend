import React from 'react'
import "../Styling/MessageBox.css"
import MessageCard from './MessageCard'
import logo from "../img/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import URL from './URL'
import { useState } from 'react'
import { format } from 'timeago.js';
import Default from "../img/default.png"
import { useContext } from 'react'
import Context from '../context/context'

const MessageBox = () => {
    const [arrivedChatRoom, setarriverChatRoom] = useState(null)
    const navigate = useNavigate()
    // ? STATE to hold our chats
    let [Chats, setChats] = useState([])

    // ? changing column-reverse to column for best user experience
    const [colomn, setcolumn] = useState("allchats")

    // ? using context api
    const context = useContext(Context)
    const { socket, user, setalert, getUser } = context
    // ? using socket to update the list of chats in real time
    useEffect(() => {
        socket?.on("receive_room", data => {
            if (data) {
                setarriverChatRoom(data)
                return
            }
        })
    }, [socket])
    // ? adding the arrived chatroom from the server to the list of chatromm
    useEffect(() => {
        if (arrivedChatRoom && !Chats.includes(arrivedChatRoom)) {
            setcolumn("allchats_reverse")
            setChats((prev) => [...prev, arrivedChatRoom])
        }
        // eslint-disable-next-line 
    }, [arrivedChatRoom])

    const [allresult, setallresult] = useState(0)
    const [receive, setreceive] = useState(0)
    let [limitnumber, setlimitnumber] = useState(5)

    const [loading, setloading] = useState("none")
    // ? fetching all the chat rooms
    const AllChats = async () => {
        let url = `${URL}/get/chat/v0/?number=5`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                unknown: localStorage.getItem("user") || localStorage.getItem("guest")
            }
        })
        let res = await data.json()
        if (res.limited) {
            setallresult(res.totalChats)
            setreceive(res.received)
            setChats(res.limited)
        }
    }
    // ? this function will fetch the data when the user starts scrolling downward because we don't want to fetch all data because our user's screens is not big to fit all data so we will only goining to fetch remaining data when user starts to scroll
    const AllChats_scroll = async () => {
        setloading("block")
        let url = `${URL}/get/chat/v0/?number=${limitnumber}`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                unknown: localStorage.getItem("user") || localStorage.getItem("guest")
            }
        })
        let res = await data.json()
        if (res.limited) {
            setallresult(res.totalChats)
            setreceive(res.received)
            setChats(res.limited)
        }
        setloading("none")
    }
    const scrollMessage = () => {
        if (receive < allresult) {
            setlimitnumber(limitnumber += 5)
            setloading("none")
            AllChats_scroll()
        }
    }
    // ? function to delete Chat
    const Delete = async (room) => {
        let url = `${URL}/delete/chat/v0/${room._id}`
        let data = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                unknown: localStorage.getItem("user") || localStorage.getItem("guest")
            },
        })
        let res = await data.json()
        if (res.msg) {
            setalert({
                text: res.msg,
                style: "mainalertcontainer_display"
            })
            socket?.emit("room_deleted", { roomname: room.Chatrommname })
            AllChats()
        } else if (res.error) {
            setalert({
                text: res.error,
                style: "mainalertcontainer_display"
            })
        }
        const newChats = Chats.filter((e) => {
            return e._id !== room._id
        })
        setChats(newChats)
    }
    const [password, setpassword] = useState("")
    const [showPassword, setshowPassword] = useState("none")
    const joinChat = async (room) => {
        let url = `${URL}/join/chat/${room._id}`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                unknown: localStorage.getItem("user") || localStorage.getItem("guest")
            },
            body: JSON.stringify({ password })
        })
        let res = await data.json()
        if (res.edit) {
            socket?.emit("wanna_join", user) // ? i don't think this is getting used somewhere
            socket?.emit("find_room", { roomname: room.Chatrommname, socket: socket.id, user: user })
            navigate(`/chat/${room._id}`)
            localStorage.setItem("room", room.Chatrommname)
        } else if (res.error) {
            setalert({
                text: res.error,
                style: "mainalertcontainer_display"
            })
        } else if (res.msg) {
            navigate(`/chat/version-0-${room._id}`)
        }
    }
    // ? this function will navigate the user to the chatting page
    const navi = async (room) => {
        const current_user = room.no_of_user_joined.find((ele) => {
            return ele === user.username
        })
        // ? if user does  not exists and the room type is private then run the following code
        if (!current_user) {
            if (room.type === "Private") {
                setshowPassword("block")
                if (!password) {
                    setalert({
                        text: "This room is private please enter the password",
                        style: "mainalertcontainer_display"
                    })
                    console.log("Test1")
                } else {
                    joinChat(room)
                }
            } else {
                // ? if user does not exists but the room type is open then run the folllowing code
                joinChat(room)
            }
        } else {
            // ? if user exists then we do not want to check the type of the room just let the user join the chat
            joinChat(room)
        }
    }
    useEffect(() => {
        socket?.on("no_room-exists", data => {
            setalert({
                text: data,
                style: "mainalertcontainer_display"
            })
        })
        // eslint-disable-next-line 
    }, [socket])
    useEffect(() => {
        // eslint-disable-next-line 
        getUser()
        AllChats()
        // eslint-disable-next-line 
    }, [])
    return (
        <>
            <div className="main_container">
                <div className="messageBox2">
                    <div className='admimM'>
                        <p className="defaultMessage">
                            Have you ever felt like, that you want to talk to someone but there's no one beside you at that specific moment.
                            If your answer is yes?. then let me introduce you Moody-chat, you can chat with any one here at any time according to your mood, whether you are happy, sad, hurt, alone, etc it does not matter, because in this world there is always someone for you. <span className='defaultMessage_heart'>♥♥♥♥♥</span>
                        </p>
                        {!localStorage.getItem("user") || localStorage.getItem("guest") ? <Link id="for_mobile" to="/login/version-0">Login to start Chatting</Link> : ""}
                    </div>
                    <img src={logo} alt="Logo" id='logo' />
                </div>
                {/* ? if user hasn't login yet */}
                {!user ? <div className='no_user_found'><p className="login_msg" onClick={() => { navigate("/login/version-0") }}>Login or create an account to chat</p></div> : <div className="messageBox" onScroll={scrollMessage}>
                    <div className="tags">
                        <p className="tag_msg">New Chats</p>
                    </div>
                    {/* ? typo */}
                    <div className={`${colomn}`}>
                        {/* ? password input */}
                        <label htmlFor="password" id='label' className={`d-${showPassword}`}>Password</label>
                        <input type="text" name="password" id='password_input' className={`d-${showPassword}`} onChange={(e) => { setpassword(e.target.value) }} />
                        {Chats ? Chats.map((e) => {
                            // ? message card
                            return <MessageCard key={e._id} time={format(e.date)} image={!e.user_profile ? Default : e.user_profile} username={`${e.Chatrommname} `} defaultMood={`${e.Mood}`} mmood={!e.custom_msg ? `This user is currently ${e.Mood} so why not talk with him` : e.custom_msg} delete={(event) => {
                                Delete(e)
                            }} none={e.username === user.username ? "block" : "none"} navi={() => { navi(e) }} />
                        }) : <div className="tags">
                            {/* ? if no chats were found */}
                            <p className="tag_msg">No Chats Avaiable</p>
                        </div>}
                    </div>
                    {/* ? loading message */}
                    <p className={`loading d-${loading} `}>Loading...</p>
                </div>}
            </div>
        </>
    )
}

export default MessageBox
