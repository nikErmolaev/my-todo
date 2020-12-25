import React from 'react'
import axios from 'axios'

import './index.css'
import Badge from '../Badge'

import removeIcon from '../../assets/img/remove.svg'

export default function List({ items , onClick , isRemovable, onRemove, onClickItem, activeItem}) {

    const removeList = (item) => {
        if(window.confirm('Вы действительно хотите удалить список?')){
            axios.delete('http://localhost:3001/lists/' + item.id)
            .then(()=>{
                onRemove(item.id);
            })
           
        }
    }
    return (
        <ul onClick= {onClick} className="todo__list">
        
            {
                items.map((item, index )=>
                    <li  key = {index} 
                    className ={item.active ? "li__active" 
                    : activeItem && activeItem.id === item.id ? "li__active" : ""} 
                    onClick={onClickItem ? ()=> onClickItem(item) : null}
                    >
                        <Badge icon = {item.icon} 
                            color = {item.color === undefined ? "" : item.color.name}
                        />

                        <span>{item.name}
                        {item.tasks && item.tasks.length > 0 && ` (${item.tasks.length})`}</span>
                        {isRemovable && <img className = "list__remove-icon" src ={removeIcon} alt="Remove item" onClick={()=>removeList(item)} />}
                    </li>)
                    
            }

        </ul>
    )
   
}