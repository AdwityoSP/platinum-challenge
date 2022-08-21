const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000
const router = require('./routes/index')
const passport = require('./lib/passport')
const socketio = require('socket.io')

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
}

app.set('view engine', 'ejs')

app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())

app.use(router)

const errorHandler = (err, req, res, next) => {
    console.log(err);
    return res.status(500).json({
        status: 'fail',
        errors: err.message
    })
}

const notFoundHandler = (req, res, next) => {
    return res.status(404).json({
        status: 'fail',
        errors: "Not Found"
    })
}

app.use(errorHandler)
app.use(notFoundHandler)

const server = app.listen(port, () => {
    console.log(`Server is Running!`)
})

const io = socketio(server)

io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('chat message', (msg) => {
        io.emit('new chat', msg)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})