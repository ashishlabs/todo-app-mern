import React, { useState, useEffect } from 'react';
import './styles.css';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/todos');
                if (!res.ok) throw new Error('Failed to fetch todos');
                const data = await res.json();
                setTodos(data);
            } catch (err) {
                setError('Error loading todos. Please try again later.');
            }
        };

        fetchTodos();
    }, []);

    const addTodo = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });
            if (!res.ok) throw new Error('Failed to add todo');
            const newTodo = await res.json();
            setTodos([...todos, newTodo]);
            setTitle('');
        } catch (err) {
            setError('Error adding todo. Please try again.');
        }
    };

    const deleteTodo = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/api/todos/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete todo');
            setTodos(todos.filter(todo => todo._id !== id));
            setEditId(null);
            setEditTitle('');
        } catch (err) {
            setError('Error deleting todo. Please try again.');
        }
    };

    const startEdit = (todo, event) => {
        event.stopPropagation();
        setEditTitle(todo.title);
        setEditId(todo._id);
    };

    const updateTodo = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/todos/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle }),
            });
            if (!res.ok) throw new Error('Failed to update todo');
            const updatedTodo = await res.json();
            setTodos(todos.map(todo => (todo._id === updatedTodo._id ? updatedTodo : todo)));
            setEditId(null);
            setEditTitle('');
        } catch (err) {
            setError('Error updating todo. Please try again.');
        }
    };

    return (
        <div className="app">
            <h1>Todo App</h1>
            {error && <p className="error">{error}</p>}

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
                    <li key={todo._id} onClick={(e) => startEdit(todo, e)}>
                        {todo.title}
                        <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
