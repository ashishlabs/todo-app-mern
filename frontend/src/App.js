import React, { useState, useEffect } from 'react';
import './styles.css';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/todos')
            .then(res => res.json())
            .then(data => setTodos(data));
    }, []);

    const addTodo = async () => {
        const res = await fetch('http://localhost:8080/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        const newTodo = await res.json();
        setTodos([...todos, newTodo]);
        setTitle('');
    };

    const deleteTodo = async (id) => {
        await fetch(`http://localhost:8080/api/todos/${id}`, { method: 'DELETE' });
        setTodos(todos.filter(todo => todo._id !== id));
    };

    const startEdit = (todo) => {
        setEditTitle(todo.title);
        setEditId(todo._id);
    };

    const updateTodo = async () => {
        const res = await fetch(`http://localhost:8080/api/todos/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: editTitle }),
        });
        const updatedTodo = await res.json();
        setTodos(todos.map(todo => (todo._id === updatedTodo._id ? updatedTodo : todo)));
        setEditId(null);
        setEditTitle('');
    };

    return (
        <div className="app">
            <h1>Todo App</h1>
            {editId ? (
                <>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Edit todo"
                    />
                    <button onClick={updateTodo}>Save</button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add a new todo"
                    />
                    <button onClick={addTodo}>Add</button>
                </>
            )}

            <ul>
                {todos.map((todo) => (
                    <li key={todo._id} onClick={() => startEdit(todo)}>
                        {todo.title}
                        <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div >
    );
};

export default App;
