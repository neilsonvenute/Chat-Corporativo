const express = require('express')
const app = express()
const server = require('http').createServer(app)
const PORT = process.env.PORT || 8045
const path = require('path')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const io = require('socket.io')(server)

const chats = require('./routes/chats')


//Congfiguração da engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//Configuração do Body-Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Acessório ao diretório
app.use(express.static(path.join(__dirname, 'public')))

//Rota Principal
app.get('/', (req, res) => {
    res.render('index')
})

app.use('/chat', chats)

let messages = []
var usuarios = 0
var users = {};


io.sockets.on('connection', (socket) => {
    socket.on('room', function (room) {
        socket.join(room);
        console.log(room)
        //socket.broadcast.to(room).emit('previousMessage', messages)
    });


    socket.on('adduser', function(username){
        // we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
        users[username] = socket.id;
        console.log(users)
    })

    usuarios++
    io.emit('usuarios online', usuarios)
    //socket.emit('previousMessage', messages)
    //socket.broadcast.to(room).emit('previousMessage', messages)
    socket.on('sendMessage', data => {
        messages.push(data)
        // socket.broadcast.emit('receivedMessage', data)
        io.sockets.in(data.room).emit('receivedMessage', data)
        //console.log(data)
    })

    //socket.emit('previousPrivateMessage', messages)

    socket.on('sendPrivateMessage', data => {
        messages.push(data)
        // socket.broadcast.emit('receivedMessage', data)
        io.to(data.room).emit('receivedPrivateMessage', data)
        //console.log(data)
    })

    socket.on("typing", function (data) {
        socket.broadcast.to(data.quarto).emit("typing", data);
    });

    socket.on("not-typing", function (data) {
        socket.broadcast.to(data).emit("not-typing", data);
    });
})



server.listen(PORT, () => {
    console.log('Servidor iniciado...')
})
