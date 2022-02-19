const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const users = [];
const socketIds = [];


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



io.on('connection',(socket)=>{ // o parâmetro "socket" serve para eu rastrear o usuário em questão
    //console.log('Conectado(Servidor)');

    socket.on('new user', (data) => {
        if(users.indexOf(data) !== -1){
            socket.emit('new user', { success: false });
        } else {
            users.push(data);
            socketIds.push(socket.id);

            socket.emit('new user', { success: true });
        }
    });

    socket.on('chat message', (obj) => {
        const isUserConnected = users.indexOf(obj.name) !== -1;
        const preventManipulationUser = users.indexOf(obj.name) == socketIds.indexOf(socket.id); // Só o back tem acesso ao socket.id

        if(isUserConnected && preventManipulationUser){
            io.emit('chat message', obj); // Reenvinado pra validar no front
        } else {
            console.error('Erro: Você não tem permissão para executar a ação');
        }
    });

    socket.on('disconnect', () => {
        let id = socketIds.indexOf(socket.id);
        socketIds.splice(id, 1);
        const userDeleted = users.splice(id, 1);

        console.log('O usuário ' + userDeleted + ' desconectou do chat');
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