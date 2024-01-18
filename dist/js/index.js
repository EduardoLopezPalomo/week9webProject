document.addEventListener('DOMContentLoaded', () => {
    const userInfoElement = document.getElementById('userInfo');
    const authButtonsElement = document.getElementById('authButtons');
    const logoutButton = document.getElementById('logout');
    const addItemInput = document.getElementById('add-item');
    const todoList = document.getElementById('todo-list');

    const isAuthenticated = () => {
        return !!localStorage.getItem('auth_token');
    };

    const updateUI = async () => {
        if (isAuthenticated()) {
            const token = localStorage.getItem('auth_token');

            userInfoElement.textContent = `Welcome, example@gmail.com`;
            authButtonsElement.innerHTML = '';
            logoutButton.style.display = 'block';

            // Fetch user's todos and display them
            const todos = await fetchTodos();
            displayTodos(todos);
        } else {
            userInfoElement.textContent = '';
            authButtonsElement.innerHTML = `
                <a href="/register.html">Register</a>
                <a href="/login.html">Login</a>
            `;
            logoutButton.style.display = 'none';
            todoList.innerHTML = ''; // Clear the todo list when logged out
        }
    };

    const logout = async () => {
        localStorage.removeItem('auth_token');
        await fetch('/api/user/logout', { method: 'GET' });
        updateUI();
    };

    const fetchTodos = async () => {
        try {
            const response = await fetch('/api/todos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }

            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const displayTodos = (todos) => {
        todoList.innerHTML = '';
        todos.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            todoList.appendChild(listItem);
        });
    };

    const addTodo = async (item) => {
        try {
            await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({ items: [item] })
            });

            const todos = await fetchTodos();
            displayTodos(todos);
        } catch (error) {
            console.error(error);
        }
    };

    addItemInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            const newItem = addItemInput.value.trim();
            if (newItem) {
                await addTodo(newItem);
                addItemInput.value = ''; // Clear the input field after adding a todo
            }
        }
    });

    logoutButton.addEventListener('click', logout);

    updateUI();
});

