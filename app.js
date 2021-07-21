// require 
const http = require("http");
const express = require("express")
const db = require("./model/db");

// set up server 
const app = express();
const server = http.createServer(app)

let id = 6;

// include middleware (static files, json, urlencoded)
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// get all todos
app.get('/api/v1/todos', (req,res) => {
    res.json(db.todos)
})

// create new todos 
app.post('/api/v1/todos' , (req, res) => {
    // console.log(req.body)
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

// update existing todo by id
app.path('/api/v1/todos/:id', (req,res) => {
    //get the id from the route
    const id = parseInt(req.params.id)
    //find the existing todo
    const todoIndex = db.todos.findIndex((todo) => {
        return todo.id === id
    })
    //update the todo
    //respond with updated item
})

// delete existing todo by id 

// listen for request

// server listen
server.listen(3000, '127.0.0.1', () => {
    console.log('Server running: http://127.0.0.1:3000')
})