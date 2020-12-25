import React, { useState } from 'react'
import axios from 'axios'

import addIcon from '../../assets/img/add.svg'

export default function AddTasksForm({ list, onAddTask }) {

    const [visibleForm, setVisibleForm] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState('')


    const toggleFormVisible = () => {
        setVisibleForm(!visibleForm)
        setInputValue('')
    }
    const addTask = () => {
        const obj = {
            listId: list.id,
            text: inputValue,
            completed: false
        };
        setIsLoading(true)
        axios.post('http://localhost:3001/tasks', obj)
            .then(({ data }) => {
                onAddTask(list.id, data);
                toggleFormVisible();
            }).catch(() => {
                alert('Ошибка при отправление списка')
            })
            .finally(() => {
                setIsLoading(false)
            })

    }



    return (
        <div className="tasks__form">
            {
                !visibleForm ?
                    <div onClick={toggleFormVisible} className="tasks__form-new">
                        <img src={addIcon} alt="Add Icon" />
                        <span>Новая задача</span>
                    </div>
                    :
                    <div className="tasks__form-block">
                        <input value={inputValue} onChange={e => setInputValue(e.target.value)} className="field" type='text' placeholder='Текст задачи'></input>
                        <button disabled = {isLoading} onClick={addTask} className="button">{isLoading ? 'Добавление...': 'Добавить задачу'}</button>
                        <button onClick={toggleFormVisible} className="button button--gray">Отмена</button>
                    </div>
            }



        </div>
    )
}
