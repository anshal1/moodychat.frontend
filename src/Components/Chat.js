import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Context from '../context/context'
import "../Styling/Chat.css"
import Chatbox from './Chatbox'
import URL from "./URL"
const Chat = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const context = useContext(Context)
  const { socket, onlineusers, setonlineusers, setalert, user } = context
  // ? we will use this sockets function to show the currently online users inside the room
  useEffect(() => {
    let Onlineusers = []
    socket?.on("allusers", data => {
      if (data) {
        Onlineusers.push(data)
      }
    })
    // eslint-disable-next-line 
  }, [socket])

  const [room_data, setroom_data] = useState({})
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
    console.log(res)
    setroom_data(res.find_room)
  }
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
  useEffect(() => {
    fetch_Room_data()
  }, [])
  return (
    <>
      <div className='main_chatContainer'>
        <div className="chatbox">
          <Chatbox />
        </div>
        {window.innerWidth < 1000 ? "" : <div className="recent">
          <div className="recenchat">
            Connected users
          </div>
          {onlineusers.map((users) => {
            return <li key={users} className="onlineuser">
              {users ? users : ""}
              {room_data.username === user.username ? <span className='kick_user' onClick={() => { kickUser(users) }}>Kick user</span> : ""}
            </li>
          })}
          <button className='leave_Chat' onClick={LeaveChat}>Leave Chat</button>
        </div>}
      </div>
    </>
  )
}

export default Chat
