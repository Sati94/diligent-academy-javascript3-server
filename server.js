const fs = require('fs');
const express = require('express');


const port = 3000;

const app = express();

app.use(express.json())

const readTodo = () => {
  try {
    const data = fs.readFileSync('data.json', 'utf-8');
    console.log('Read:' + data);
    return JSON.parse(data);

  } catch (error) {
    console.error('Read error ' + error)
    //throw new Error(error.message)
  };
}

const writeTodo = (todo) => {
  try {
    const data = fs.writeFileSync('data.json', JSON.stringify(todo, null, 2));
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error.message)
  }

}


app.get("/todos", (req, res) => {
  try {
    const todos = readTodo();
    res.status(200).json(todos);

  } catch (error) {
    res.status(500).json({ message: "Get error" })
  }

})


app.post('/todos', (req, res) => {
  try {
    const todos = readTodo();
    console.log('(Post)Length ' + todos.length)
    const newTodo = { ...req.body, id: todos.length ? todos[todos.length - 1].id + 1 : 1 };
    console.log('(Post)Req.body:' + req.body);
    console.log('(Post)ID :' + newTodo.id);
    writeTodo([...todos, newTodo]);
    res.status(201).json(newTodo);

  } catch (error) {
    res.status(500).json({ message: error })
  }

})


app.put('/todos/:id', (req, res) => {
  try {
    const todos = readTodo();
    const { id } = req.params;
    const updatedTodo = req.body;

    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));

    if (todoIndex !== -1) {
      todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo }
      writeTodo(todos);
      res.status(201).json(updatedTodo);

    } else {
      res.status(404).json({ message: 'Todo not found' })
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Put error in server' })
  }

})

app.delete('/todos/:id', (req, res) => {
  try {
    const todos = readTodo();
    const { id } = req.params;


    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));

    if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
      writeTodo(todos);
      res.status(201).json(todos);
    } else {
      res.status(404).json({ message: 'Todo not found' })
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Delete error in server' })
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})