import React, { useState } from 'react'
import { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Context from '../context/context'
import "../Styling/Login.css"
import URL from "./URL"
const Login = () => {
    // ? Context api
    const context = useContext(Context)
    const { setalert } = context
    const navigate = useNavigate()

    // ? input state
    const [username, setusernae] = useState("")
    const [password, setpassword] = useState("")
    // ? login using guest account
    const Guest = async () => {
        // ? if token does not  exists only then fire the below code
        if (!localStorage.getItem("guest") && !localStorage.getItem("user")) {
            let url = `${URL}/auth/v0/guest`
            let data = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                }
            })
            let res = await data.json()
            localStorage.setItem("guest", res.sign)
            navigate("/")
        } else {
            setalert({
                text: "You already have an account",
                style: "mainalertcontainer_display"
            })
        }
    }
    // ? login using an actual account
    const login = async () => {
        // ? if token does not  exists only then fire the below code
        if (!localStorage.getItem("user")) {
            let url = `${URL}/auth/v0/login`
            let data = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ username, password })
            })
            let res = await data.json()
            if (res.sign) {
                // ? saving username and password in cookee
                document.cookie = `username=${username}; expires= Sun, 11 Sep 2022 23:00:00 UTC`
                document.cookie = `password=${password}; expires= Sun, 11 Sep 2022 23:00:00 UTC`
                // ? removing guest user
                localStorage.removeItem("guest")
                localStorage.setItem("user", res.sign)
                setalert({
                    text: "Logged In",
                    style: "mainalertcontainer_display"
                })
                // ? navigating to home page
                navigate("/")
            } else if (res.error) {
                setalert({
                    text: res.error,
                    style: "mainalertcontainer_display"
                })
            }
        } else {
            setalert({
                text: "You have already logged into your account",
                style: "mainalertcontainer_display"
            })
        }
    }
    // const allcookie = document.cookie.split(";")
    // const Cookieusername = allcookie[1]
    // const Cookiepassword = allcookie[0]
    // useEffect(()=>{
    //     if(Cookiepassword && Cookieusername){
    //         setusernae(Cookieusername.split("=")[1])
    //         setpassword(Cookiepassword.split("=")[1])
    //     }
    // }, [])
    return (
        <>
            <div className='main_logincontainer'>
                <h3 className='brand_name'>Moody-Chat.com</h3>
                <h3 className='continue'>Login to continue</h3>
                <div className="login_inputs">
                    <input type="text" className='send_input' value={username} onChange={(e) => { setusernae(e.target.value) }} placeholder='Username' />
                    <input type="password" className='send_input' value={password} onChange={(e) => { setpassword(e.target.value) }} placeholder='Password' />
                    <button className='btn btn-dark my-3' onClick={login}>Login</button>
                    <p className="guest" onClick={Guest}>Login as guest</p>
                    <Link className="nav-link fw-bold" aria-current="page" to="/signup/version-0">Don't have an account?</Link>
                </div>
                <ul>
                    {/* this is for only show */}
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
        </>
    )
}

export default Login
