const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const users = [];


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



io.on('connection',(socket)=>{ // o parâmetro "socket" serve para eu rastrear o usuário em questão
    console.log('Conectado(Servidor)');

    socket.on('chat message', (obj) => {
        io.emit('chat message', obj); // Reenvinado pra validar no front
    });
});

server.listen(3000, () => {
  console.log('listening on localhost:3000');
});

/*
    A partir do método emit e broadcast.emit podemos nos conectar e comunicar com o Front/Client

        io.emit('clientConnect','Estou me conectando a partir do método clientConnect do script do browser'); // Emite para todo mundo que acessa o browser, até mesmo quem acabou de acessar a página

        socket.broadcast.emit('newUserClient', 'Um novo usuário se conectou!'); // Emite a mensagem para o cliente que já está na sessão para apresentar usuários novos.

        socket.on('disconnect',()=> { // Detecta quando o usuário sai do app
            console.log('Desconectado.');
        });
*/