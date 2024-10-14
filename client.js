const prompt = require('prompt-sync')()
const BASE_URL = 'http://localhost:3000/todos';

const getInput = (message) => {
  return prompt(`${message}: `)
}

const getTodos = async () => {
    try {
        const response = await fetch(BASE_URL)
        const todos = await response.json();
        console.log(todos);
    } catch (error) {
        console.error('Error fetching todos:' + error);
    }

}

const postTodo = async () => {
    const newTodoTitle = getInput('Enter todo title');
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({title: newTodoTitle})
        })
        const newTodo = await response.json();
        console.log('New todo created:', newTodo);

    } catch (error) {
        console.error('Error posting todos:' + error);
    }
}

const putTodo = async () => {
    const updatedId = getInput('Enter the ID of the todo to update');
    const updatedTitle = getInput('Enter the new title');

    try {
        const response = await fetch(`${BASE_URL}/${updatedId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({title: updatedTitle})
        })
        if (response.ok) {
            const updatedTodo = await response.json();
            console.log('Todo updated : ' + updatedTodo.title);
        } else {
            console.error('Error updating todo: ' + await response.json());
        }

    } catch (error) {
        console.error('Error updating todos:' + error);
    }
}

const deleteTodo = async () => {
    const deleteId = getInput('Enter the ID of the todo to delete');
    try {
        const response = await fetch(`${BASE_URL}/${deleteId}`, {
            method: "DELETE"
        })
        if (response.ok) {
            console.log('Todo deleted successfully.')
        } else {
            console.error('Error deleting todo:' + await response.json());
        }

    } catch (error) {
        console.error('Error deleting todo:' + error)
    }
}
deleteTodo();
