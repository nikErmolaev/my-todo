import React from 'react'
import axios from 'axios'

import AddTasksForm from './AddTasksForm'

import checkIcon from '../../assets/img/check.svg'
import editIcon from '../../assets/img/edit.svg'
import removeIcon from '../../assets/img/remove.svg'


import './index.css'

export default function Tasks({ list, onEditTitle, onAddTask, withoutEmpty, onRemoveTask, onEditTask , onCompleteTask}) {

    const editTitle = () => {
        const newTitle = window.prompt('Название списка', list.name)
        if (newTitle) {
            onEditTitle(list.id, newTitle);
            axios
                .patch('http://localhost:3001/lists/' + list.id, {
                    name: newTitle
                })
                .catch((e) => {
                    console.log(e)
                    alert('Не удалось изменить название списка')
                });
        }
    }

    const onChangeCkeckbox = e => {
        const str = e.target.id.replace('task-','')
        
        onCompleteTask(list.id, Number(str),e.target.checked)
    }

    return (
        <div className="tasks">

            <h2 style={{ color: list.color.hex }} className="tasks__title">
                {list.name}
                <img onClick={editTitle} className="edit-icon" src={editIcon} alt="Edit icon" />
            </h2>

            <div>
                {!withoutEmpty && list.tasks && !list.tasks.length && (
                    <h2 className="noTasks">Задачи отсутствуют</h2>)}
                {
                    
                        list.tasks &&
                            list.tasks.map(task =>

                                <div key={task.id} className="tasks__items">
                                    <div className="checkbox">
                                        <input onChange={onChangeCkeckbox} id={`task-${task.id}`} type="checkbox" checked = {task.completed} />
                                        <label htmlFor={`task-${task.id}`}><img src={checkIcon}></img></label>
                                    </div>
                                    <p>{task.text}</p>
                                    <div className="tasks__items-row-actions">
                                        <div onClick={() => onEditTask(list.id, task)}>
                                            <img src={editIcon}></img>
                                        </div>
                                        <div onClick={() => onRemoveTask(list.id, task.id)}>
                                            <img src={removeIcon}></img>
                                        </div>
                                    </div>
                                </div>)
                    

                }

                <AddTasksForm key={list.id} list={list} onAddTask={onAddTask} />

            </div>
        </div>
    )
}
