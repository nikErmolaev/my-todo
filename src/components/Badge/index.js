import React from 'react'
import './index.css'

export default function Badge({ icon, color, onClick }) {
    
    return (
        <i onClick={onClick}>
            {icon ? <img src={icon} /> : <i className={color}></i>}
        </i>
    )
}
