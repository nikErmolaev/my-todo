import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {

    Route,

    useHistory
} from "react-router-dom";

import List from './components/List'
import AddList from './components/AddList'
import Tasks from './components/Tasks'

import listSvg from './assets/img/list.svg'






function App() {


    const [lists, setLists] = useState(null)
    const [colors, setColors] = useState(null)
    const [activeItem, setActiveItem] = useState(null)
    let history = useHistory()


    useEffect(() => {
        axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks')
            .then(({ data }) => {
                setLists(data)
            });


        axios.get('http://localhost:3001/colors')
            .then(({ data }) => {
                setColors(data)
            });
    }, []);

    useEffect(() => {
        const listId = history.location.pathname.split('lists/')[1];
        if (lists) {
            const list = lists.find(list => list.id === Number(listId));
            setActiveItem(list);
        }
    }, [lists, history.location.pathname]);

    const onAddList = (obj) => {
        setLists([...lists, obj]);

    }

    const onAddTask = (listId, taskobj) => {

        const newList = lists.map(item => {
            if (item.id === listId) {
                item.tasks = [...item.tasks, taskobj]
            }
            return item;
        });
        setLists(newList);
    }

    const onEditListTitle = (id, title) => {
        const newList = lists.map(item => {
            if (item.id === id) {
                item.name = title;
            }
            return item;
        });
        setLists(newList);
    };

    const onRemoveTask = (listId, taskId) => {
        if (window.confirm('Вы действительно хотите удалить задачу?')) {
            const newList = lists.map(item => {
                if (item.id === listId) {
                    item.tasks = item.tasks.filter(task => task.id !== taskId)
                }
                return item;

            });
            setLists(newList);
            axios
                .delete('http://localhost:3001/tasks/' + taskId)
                .catch(() => {
                    alert('Не удалось удалить задачу')
                });

        }
    }
    const onEditTask = (listId, taskObj) => {
        const newTaskText = window.prompt('Текст задачи', taskObj.text);
        console.log(taskObj.id)
        if (!newTaskText) {
            return;
        }

        const newList = lists.map(list => {
            if (list.id === listId) {
                list.tasks = list.tasks.map(task => {
                    if (task.id === taskObj.id) {
                        task.text = newTaskText;
                    }
                    return task;
                });
            }
            return list;
        });
        setLists(newList);

        axios
            .patch('http://localhost:3001/tasks/' + taskObj.id, {
                text: newTaskText
            })
            .catch(() => {
                alert('Не удалось обновить задачу');
            });
    };


    const onCompleteTask = (listId, taskId, completed) => {
        const newList = lists.map(list => {
            if (list.id === listId) {
                list.tasks = list.tasks.map(task => {
                    if (task.id === taskId) {
                        task.completed = completed;
                    }
                    return task;
                });
            }
            return list;
        });
        setLists(newList);
        axios
            .patch('http://localhost:3001/tasks/' + taskId, {
                completed
            })
            .catch(() => {
                alert('Не удалось обновить задачу');
            });
    };


    return (
        <div className="todo" >

            <div className="todo__sidebar" >

                <List
                    onClickItem={(list) => {
                        history.push(`/`)
                        setActiveItem(list)
                    }}
                    items={
                        [{
                            active: !activeItem,
                            icon: listSvg,
                            name: 'Все задачи',
                        }]} />

                {lists ? <List items={lists}

                    onRemove={
                        (id) => {
                            const newLists = lists.filter(item => item.id !== id);
                            setLists(newLists)
                        }

                    }
                    onClickItem={(item) => {

                        history.push(`/lists/${item.id}`);
                        setActiveItem(item)


                    }}
                    activeItem={activeItem}
                    isRemovable
                /> : <div>Загрузка списка</div>
                }

                <AddList onAdd={onAddList}
                    colors={colors}
                />

            </div>
            <div className="todo__tasks" >
                <Route exact path="/">
                    {lists &&
                        lists.map(list => (
                            <Tasks
                                key={list.id}
                                list={list}
                                onEditTitle={onEditListTitle}
                                onAddTask={onAddTask}
                                onEditTask={onEditTask}
                                onRemoveTask={onRemoveTask}
                                onCompleteTask={onCompleteTask}
                                withoutEmpty
                            />
                        ))}
                </Route>
                <Route path="/lists/:id">
                    {lists && activeItem &&
                        (<Tasks

                            list={activeItem}
                            onEditTitle={onEditListTitle}
                            onAddTask={onAddTask}
                            onRemoveTask={onRemoveTask}
                            onEditTask={onEditTask}
                            onCompleteTask={onCompleteTask}

                        />)}
                </Route>


            </div>
        </div>

    );
}

export default App;