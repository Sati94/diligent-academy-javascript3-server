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
        console.error(`Error fetching todos: ${error.message}`);
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
        console.log(`New todo created: ${newTodo}`);

    } catch (error) {
        console.error(`Error creating new todo: ${error.message}`);
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
            console.log(`Todo updated :  ${updatedTodo.title}`);
        } else {
            const error = await response.json();
            console.error(`Error updating todos: ${error.message}`);
        }

    } catch (error) {
        console.error(`Error updating todos: ${error.message}`);
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
            const error = await response.json();
            console.error(`Error deleting todo: ${error.message}`);
        }

    } catch (error) {
        console.error(`Error deleting todo: ${error.message}`)
    }
}

const ui = async () => {

    presentOptions();
    while(await selectAction()){
        presentOptions();
    }

    console.log('Goodbye!')

}

const selectAction = async () => {


    const action = getInput('Enter a number to select an action');

    switch (action) {
        case '0' :
            await getTodos();
            return true;
        case '1' :
            await postTodo();
            return true;
        case '2' :
            await putTodo();
            return true;
        case '3' :
            await deleteTodo();
            return true;
        case 'x':
            return false;
        default:
            console.log('Invalid input');
            await selectAction();
    }
}

function presentOptions() {
    console.log('Get all Todos: 0');
    console.log('Post new Todo: 1');
    console.log('Update existing Todo: 2');
    console.log('Delete existing Todo: 3');
    console.log('Escape: x');
}

ui();


