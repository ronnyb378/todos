const http = require("http");
const express = require("express")
const db = require("./model/db");
const exp = require("constants");
const { join } = require("path/posix");

const app = express();
const server = http.createServer(app)

app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))


server.listen(3000, '127.0.0.1', () => {
    console.log('Server running: http://127.0.0.1:3000')
})