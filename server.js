const fs = require('fs');
const express = require('express');


const port = 3000;

const app = express();

app.use(express.json())

const readTodo = () => {
    try {
        const data = fs.readFileSync('data.json', 'utf-8');
        return JSON.parse(data);

    } catch (error) {
        console.error(`Error reading from the Database: ${error.message}`)
        throw new Error(error.message)
    }
}

const writeTodo = (todo) => {
    try {
        fs.writeFileSync('data.json', JSON.stringify(todo, null, 2));
    } catch (error) {
        console.error(`Error writing into the Database: ${error.message}`);
        throw new Error(error.message)
    }

}


app.get("/todos", (req, res) => {
    try {
        const todos = readTodo();
        res.status(200).json(todos);

    } catch (error) {
        res.status(500).json({message: error})
    }

})


app.post('/todos', (req, res) => {
    try {
        const todos = readTodo();
        const newId = todos.length ? todos[todos.length - 1].id + 1 : 1;
        const newTodo = {...req.body, id: newId};
        writeTodo([...todos, newTodo]);
        res.status(201).json(newTodo);

    } catch (error) {
        res.status(500).json({message: error})
    }

})


app.put('/todos/:id', (req, res) => {
    try {
        const todos = readTodo();
        const {id} = req.params;
        const updatedTodo = req.body;
        const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));

        if (todoIndex !== -1) {
            todos[todoIndex] = {...todos[todoIndex], ...updatedTodo}
            writeTodo(todos);
            res.status(201).json(updatedTodo);

        } else {
            console.error(`No Todo found with id ${id}`);
            res.status(500).json({message: `No Todo found with id ${id}`})
        }
    } catch (error) {
        console.error(`Error Updating todo with id ${id}`);
        console.error(error.message);
        res.status(500).json({message: 'Put error in server'})
    }

})

app.delete('/todos/:id', (req, res) => {
    try {
        const todos = readTodo();
        const {id} = req.params;
        const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));

        if (todoIndex !== -1) {
            todos.splice(todoIndex, 1);
            writeTodo(todos);
            res.status(201).json(todos);
        } else {
            console.error(`No Todo found with id ${id}`);
            res.status(500).json({message: `No Todo found with id ${id}`})
        }
    } catch (error) {
        console.error(`Error deleting todos with id ${id}`);
        console.error(error.message);
        res.status(500).json({message: error})
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})