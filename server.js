const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    console.log('🎮 Bir oyuncu bağlandı! ID:', socket.id);

    socket.on('joinGame', (playerName) => {
        players[socket.id] = {
            id: socket.id,
            name: playerName || "İsimsiz Savaşçı",
            x: Math.floor(Math.random() * 600) + 100,
            y: Math.floor(Math.random() * 400) + 100,
            score: 0
        };

        socket.emit('currentPlayers', players);
        socket.broadcast.emit('newPlayer', players[socket.id]);
    });

    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ Oyuncu ayrıldı:', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

const PORT = 3000;
http.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 KAPTAN HAMZA MULTIPLAYER SUNUCUSU CALISIYOR!');
    console.log('🌐 Adres: http://localhost:3000');
    console.log('========================================');
});