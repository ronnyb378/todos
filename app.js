//todo | require 
const http = require("http");
const express = require("express");
const pgp = require("pg-promise")();
// const db = require("./model/db");
const config = require("./config")
const db = pgp(config)

//todo | set up server 
const app = express();
const server = http.createServer(app)

//todo | include middleware (static files, json, urlencoded)
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//todo | get all todos
app.get('/api/v1/todos', (req, res) => {
    db.many("SELECT * FROM todos")
        .then((todos) => {
            res.json(todos)
        })
})

//todo | create new todos 
app.post('/api/v1/todos', (req, res) => {
    //todo | console.log(req.body)
    if (!req.body || !req.body.text) {
        // respond with an error
        res.status(422).json({
            error: "add text"
        })
        return
    }
    const newTodo = {
        text: req.body.text
    }
    db.result("INSERT INTO todos (text) VALUES (${text}) RETURNING *", newTodo)
        .then((results) => {
            const createdTodo = results.row[0]
            res.status(201).json(createdTodo)
        })
})

//todo | Update existing todo by id
app.patch('/api/v1/todos/:id', (req, res) => {
    // get the id from the route
    const id = parseInt(req.params.id)
    let data = { id: id }
    let query = "UPDATE todos SET "

    if (req.body && req.body.text) {
        query += "text = ${text}"
        data.text = req.body.text
    }

    if (req.body && req.body.text && req.body.completed !== undefined) {
        query += ', '
    }

    if (req.body && req.body.completed !== undefined) {
        query += "completed = ${completed}"
        data.completed = req.body.completed
    }
    query += " WHERE id = ${id}"
    // console.log(query);

    db.result(query, data)
        .then(results => {
            if (results.rowCount === 0) {
                res.status(404).json({ error: 'could not find todo with that id ' })
            } else {
                res.json()
            }
        })
})

//todo | delete existing todo by id 
app.delete('/api/v1/todos/:id', (req, res) => {
    //todo | get the id
    const id = parseInt(req.params.id)

    //todo | find the existing todo
    db.result("DELETE FROM todos WHERE id = $1", id)
        .then((results) => {
            if (results.rowCount === 0) {
                res.status(404).json({ error: 'Could not find todo with that id' })
            } else {
                res.status(204).json()
            }
        })
})

//todo | listen for request
server.listen(3000, '127.0.0.1', () => {
    console.log('Server running: http://127.0.0.1:3000')

})