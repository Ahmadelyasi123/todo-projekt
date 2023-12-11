async function fetchData() {
    try {
        const response = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=d5e86d22-2565-4f8e-b747-1c3778bec8e6');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayTodos(data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function displayTodos(todos) {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = ''; // Rensa listan innan vi lägger till nya todos

    todos.forEach(todo => {
        const listItem = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;

        const textNode = document.createTextNode(todo.title);

        const updateButton = createButton('sabmit kalrade todo', () => updateTodo(todo._id, !todo.completed, listItem, checkbox, textNode));
        const deleteButton = createButton('Delete', () => deleteTodo(todo._id, listItem, checkbox));

        listItem.appendChild(checkbox);
        listItem.appendChild(textNode);
        listItem.appendChild(updateButton);
        listItem.appendChild(deleteButton);

        todoList.appendChild(listItem);
    });
}

async function addTodo() {
    const todoInputElem = document.getElementById("todoInput");
    const todoInput = todoInputElem.value;

    if (todoInput.trim() === "") {
        showErrorMessage('Du måste fylla i fältet innan du lägger till en todo!');
        return;
    }

    try {
        const response = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=d5e86d22-2565-4f8e-b747-1c3778bec8e6', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: todoInput }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        todoInputElem.value = ''; // Rensa inputfältet
        fetchData(); // Uppdatera listan
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function updateTodo(id, completed, listItem, checkbox, textNode) {
    try {
        const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=d5e86d22-2565-4f8e-b747-1c3778bec8e6`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }), 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        checkbox.checked = completed;
        listItem.className = completed ? 'completed' : ''; // Uppdatera stilen om nödvändigt
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function deleteTodo(id, listItem, checkbox) {
    if (!checkbox.checked) {
        showErrorMessage('Todo måste vara markerad som klar innan borttagning!');
        return;
    }

    try {
        const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=d5e86d22-2565-4f8e-b747-1c3778bec8e6`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        listItem.remove();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function createButton(text, onClick) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", onClick);
    return button;
}

function showErrorMessage(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}

fetchData();

