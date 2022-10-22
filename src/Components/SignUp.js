import React from 'react'
import "../Styling/SignUp.css"
import { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Context from '../context/context'
import URL from './URL'
import { useState } from 'react'
import { useEffect } from 'react'
const SignUp = () => {
    // ? Context api
    const context = useContext(Context)
    const { setalert } = context
    const navigate = useNavigate()
    // ? Signup states
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [email, setemail] = useState("")
    const [gender, setgender] = useState("")
    const [profile] = useState("Nothing")
    const Guest = async () => {
        // ? if token does not  exists only then fire the below code
        if (!localStorage.getItem("guest") || !localStorage.getItem("user")) {
            let url = `${URL}/auth/v0/guest`
            let data = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                }
            })
            let res = await data.json()
            if (res.sign) {
                setalert({
                    text: "Guest account created",
                    style: "mainalertcontainer_display"
                })
            }
            localStorage.setItem("guest", res.sign)
            navigate("/")
        } else {
            setalert({
                text: "You already have an account",
                style: "mainalertcontainer_display"
            })
        }
    }
    // ? state to show a cross next to the email input when the email is wrong
    const [none, setnone] = useState("none")
    useEffect(() => {
        let emailarray = email.split("")
        if (emailarray.includes(" ") || !emailarray.includes("@")) {
            setnone("block")
        } else {
            setnone("none")
        }
    }, [email])

    // ? Sign up function
    const signup = async () => {
        let url = `${URL}/auth/v0/signup`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ username, email, password, gender, profile })
        });
        let res = await data.json()
        if (res.sign) {
            setalert({
                text: "Account created successfully",
                style: "mainalertcontainer_display"
            })
            localStorage.setItem("user", res.sign)
            navigate("/")
        } else if (res.error) {
            setalert({
                text: res.error,
                style: "mainalertcontainer_display"
            })
        }
    }
    return (
        <>
            <div className="mainsignup">
                <h3 className='brand_name'>Moody-Chat.com</h3>
                <h3 className='continue'>Signup to continue</h3>
                <div className="signupInput">
                    <input type="text" value={username} className='send_input' onChange={(e) => { setusername(e.target.value) }} placeholder='Username' />
                    <input type="email" id='cross_relative' value={email} className='send_input' onChange={(e) => { setemail(e.target.value) }} placeholder='Email' /> <span id='cross'><i className={`fa-solid fa-circle-xmark d-${none}`}></i></span>
                    <input type="password" value={password} className='send_input' onChange={(e) => { setpassword(e.target.value) }} placeholder='Password' />
                    <div className="btn-group my-3">
                        <button type="button" className="btn btn-info dropdown-toggle fw-bold" data-bs-toggle="dropdown" aria-expanded="false">
                            {!gender ? "Gender" : gender}
                        </button>
                        <ul className="dropdown-menu">
                            <li><p className="dropdown-item fw-bold" onClick={(e) => { setgender(e.target.innerHTML) }}>Male</p></li>
                            <li><p className="dropdown-item fw-bold" onClick={(e) => { setgender(e.target.innerHTML) }}>Female</p></li>
                            <li><p className="dropdown-item fw-bold" onClick={(e) => { setgender(e.target.innerHTML) }}>Prefer not to say</p></li>
                        </ul>
                    </div>
                    <button className='btn btn-dark my-3' onClick={signup}>SignUp</button>
                    <p className="guest" onClick={Guest}>Sign Up as guest</p>
                    <Link className="nav-link fw-bold" aria-current="page" to="/login/version-0">Already have an account?</Link>
                </div>
            </div>
        </>
    )
}

export default SignUp
