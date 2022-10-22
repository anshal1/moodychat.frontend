import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import Context from '../context/context'
import "../Styling/Alert.css"
const Alert = () => {
    const context = useContext(Context)
    const { alert, setalert } = context
    useEffect(() => {
        if (alert.style === "mainalertcontainer_display") {
            setTimeout(() => {
                setalert({
                    text: "",
                    style: "mainalertcontainer"
                })
            }, 3000)
        }
    }, [alert])
    return (
        <>
            <div className={alert.style}>
                {alert.text}
            </div>
        </>
    )
}

export default Alert
