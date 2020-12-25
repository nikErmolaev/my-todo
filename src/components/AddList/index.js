import React, { useState, useEffect } from 'react'
import axios from 'axios'

import List from '../List'
import Badge from '../Badge'

import closeSvg from '../../assets/img/close.svg'
import iconAdd from '../../assets/img/add.svg'

import './index.css'


export default function AddList({ colors, onAdd }) {

    const [visiblePopup, setVisiblePopup] = useState(false)
    const [selectedColor, setSelectedColor] = useState()
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        if (Array.isArray(colors)) {
            setSelectedColor(colors[0].id)
        }
    }, [colors]);

    const onClose = () => {
        setVisiblePopup(false);
        setInputValue('');
        setSelectedColor(colors[0].id)
    }

    const addList = () => {
        if (!inputValue) {
            alert('Введите название списка');
            return;
        }
        
        setLoading(true);
        axios
            .post('http://localhost:3001/lists', { "name": inputValue, "colorId": selectedColor })
                .then(({ data }) => {
                    const color = colors.filter(c => c.id === selectedColor)[0];
                    const listObj ={...data, color, tasks: []} 
                    onAdd(listObj)
                    onClose();
                    
                }).catch(() => {
                    alert('Ошибка при отправление задачи')
                }).finally(()=>{
                    setLoading(false);  
                })
        
        
    };



    return (
        <div className="add-list" >
            <List
                onClick={
                    () => {
                        setVisiblePopup(!visiblePopup)
                    }
                }
                items={[
                    {
                        class: 'add-li',
                        icon: iconAdd,
                        name: 'Добавить список',
                    }]} />
            {visiblePopup && <div className="add-list__popup">

                <img onClick={onClose} src={closeSvg} alt="Close" className="add-list__close"></img>


                <input value={inputValue} onChange={e => setInputValue(e.target.value)} className="field" type='text' placeholder='Название задачи'></input>

                <div className="add-list__popup-colors">
                    <ul>{
                        colors.map(item =>
                            <li className={selectedColor === item.id ? 'active' : ''} key={item.id}>
                                <Badge key={item.id} color={item.name} onClick={() => { setSelectedColor(item.id) }} />
                            </li>
                        )
                    }
                    </ul>
                </div>
                <button onClick={addList} className="button">{isLoading ? 'Добавление...' : 'Добавить'}</button>
            </div>}
        </div>
    )
}
