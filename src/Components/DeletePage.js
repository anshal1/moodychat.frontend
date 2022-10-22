import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import Context from '../context/context'
import "../Styling/DeletePage.css"
import MessageCard from './MessageCard'
import URL from './URL'
import { Link } from 'react-router-dom'
import Default from "../img/default.png"
import { format, render, cancel, register } from 'timeago.js';
const DeletePage = () => {
    const context = useContext(Context)
    const { setalert, socket } = context
    const [userchat, setuserchat] = useState([])
    // ? fetching user specific chats
    const usersChat = async () => {
        let url = `${URL}/user/chat/v0/?number=5`
        let data = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                unknown: localStorage.getItem("user") || localStorage.getItem("guest")
            }
        })
        let res = await data.json()
        if (res.error) {
            return
        } else if (res.limited) {
            setuserchat(res.limited)
        }
        console.log(res)
    }
     // ? function to delete Chat
     const Delete = async (room) => {
        let url = `${URL}/delete/chat/v0/${room._id}`
        let data = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                unknown: localStorage.getItem("user") || localStorage.getItem("guest")
            }
        })
        let res = await data.json()
        if (res.msg) {
            socket?.emit("room_deleted", { roomname: room.Chatrommname })
            setalert({
                text: res.msg,
                style: "mainalertcontainer_display"
            })
            usersChat()
        } else if (res.error) {
            setalert({
                text: res.error,
                style: "mainalertcontainer_display"
            })
        }
        const newChats = userchat.filter((e) => {
            return e._id !== room._id
        })
        setuserchat(newChats)
    }
    useEffect(() => {
        usersChat()
    }, [])
    return (
        <>
            <div className="maindelelpagecontainer">
                <div className="allchats_delete">
                    {!userchat || userchat.length < 1 ? <h2 style={{ textAlign: "center", marginTop: "5rem", fontFamily: "sans-serif", fontWeight: 700 }}>No chats available <span id='create_one'><Link to="/create/chat/version-0">Create One</Link></span></h2> : userchat.map((e) => {
                        return <MessageCard key={e._id} time={format(e.date)} image={!e.user_profile ? Default : e.user_profile} username={`${e.Chatrommname}`} defaultMood={`${e.Mood}`} mmood={!e.custom_msg ? `This user is currently ${e.Mood} so why not talk with him` : e.custom_msg} delete={(event) => {
                            Delete(e)
                        }} none={"block"} />
                    })}
                </div>
            </div>
        </>
    )
}

export default DeletePage
