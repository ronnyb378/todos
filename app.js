//todo | require 
const http = require("http");
const express = require("express")
const db = require("./model/db");

//todo | set up server 
const app = express();
const server = http.createServer(app)

let id = 6;

//todo | include middleware (static files, json, urlencoded)
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//todo | get all todos
app.get('/api/v1/todos', (req,res) => {
    res.json(db.todos)
})

//todo | create new todos 
app.post('/api/v1/todos' , (req, res) => {
    //todo | console.log(req.body)
    if (!req.body || !req.body.text) {
        // respond with an error
        res.status(422).json({
            error: "are u stupid? add fucking text"
        })
        return
    }
    const newTodo= {
        id: id++,
        text: req.body.text,
        completed: false,
    }
    db.todos.push(newTodo)
    res.status(201).json(newTodo)
})

//todo | update existing todo by id
app.patch('/api/v1/todos/:id', (req,res) => {
    //todo |get the id from the route
    const id = parseInt(req.params.id)
    //find the existing todo
    const todoIndex = db.todos.findIndex((todo) => {
        return todo.id === id
    })
    //todo | if we could not find the todo with that id
    if (todoIndex === -1) {
        res.status(404).json({ error: 'Could not find todo with that id'})
        return
    }
    //todo |update the text/completed
    if (req.body && req.body.text) {
        db.todos[todoIndex].text = req.body.text
    }
    if (req.body && req.body.completed !== undefined) {
        db.todos[todoIndex].completed = req.body.completed
    } 
    //todo |respond with updated item
    res.json(db.todos[todoIndex])
})

//todo | delete existing todo by id 
app.delete('/api/v1/todos/:id', (req, res) => {
    //todo | get the id
    const id = parseInt(req.params.id)
    //todo | find the existing todo
    const todoIndex = db.todos.findIndex((todo) => {
        return todo.id === id
    })
    //todo | if we could not find the todo with that id
    if (todoIndex === -1) {
        res.status(404).json({ error: 'Could not find todo with that id'})
        return
    }
    //todo | delete the todo
    db.todos.splice(todoIndex, 1)

    // db.todos = db.todos.filter((todo) => {
    //     return todo.id !== id
    // })
    //todo | respond with 204 status
    res.status(204).json()
})

//todo | listen for request
server.listen(3000, '127.0.0.1', () => {
    console.log('Server running: http://127.0.0.1:3000')
})