import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Context from './context'
import { io } from "socket.io-client"
import URL from '../Components/URL'
const State = (props) => {
  // ? Socket state
  const [socket, setsocket] = useState(null)
  useEffect(() => {
    setsocket(io(URL))
  }, [])

  // ?Online users of specific room
  const [onlineusers, setonlineusers] = useState([])
  // ? loading box state
  const [display, setdisplay] = useState("none")
  // ? loading msg state
  const [loading_msg, setloading_msg] = useState("Reconnecting please wait...")
  // ? Alert State
  const [alert, setalert] = useState({
    text: "Welcome to the Moody-Chat",
    style: "mainalertcontainer"
  })

  // ? current user info state
  const [user, setuser] = useState({})
  const getUser = async () => {
    let url = `${URL}/auth/get/user/v0`
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        unknown: localStorage.getItem("user") || localStorage.getItem("guest")
      }
    })
    let res = await data.json()
    setuser(res.user)
  }
  // ? all sockets starts from here
  // ? sending the user data to add the user
  useEffect(() => {
    if (user) {
      socket?.emit("user_sended", user)
    }
  }, [socket, user])

  // ? getting all connected users
  useEffect(() => {
    socket?.on("allusers", data => {
      console.log(data)
    })
  }, [socket])
  useEffect(() => {
    getUser()
  }, [])
  return (
    <Context.Provider value={{ socket, alert, setalert, user, display, setdisplay, loading_msg, setloading_msg, getUser, onlineusers, setonlineusers }}>
      {props.children}
    </Context.Provider>
  )
}

export default State
