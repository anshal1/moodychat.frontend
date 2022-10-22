import React from 'react'
import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Context from '../context/context'

const Navbar = () => {
    // ? context api
    const context = useContext(Context)
    const { setalert } = context
    // ? getting the location or current oage url
    const location = useLocation()
    // ? logging out
    const Logout = () => {
        localStorage.removeItem("user")
        setalert({
            text: "Logged out successfully",
            style: "mainalertcontainer_display"
        })
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark shadow shadow-sm bg-dark">
                <div className="container-fluid">

                    <Link className={`navbar-brand ${location.pathname === "/" ? "active" : ""}`} to="/">Moody-Chat</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" aria-current="page">Profile</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Chats
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><Link className="dropdown-item fw-bold" to="/create/chat/version-0">Create a new chat</Link></li>
                                    <li><Link className="dropdown-item" to="/delete/chat/version-0">Delete a chat</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                {!localStorage.getItem("user") ? <Link className={`nav-link ${location.pathname === "/login/version-0" ? "active" : ""}`} to="/login/version-0">Login</Link> : <Link className={`nav-link ${location.pathname === "/login/version-0" ? "active" : ""}`} to="/login/version-0" onClick={Logout}>Logout</Link>}
                            </li>
                        </ul>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
