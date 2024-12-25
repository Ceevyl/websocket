const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const clients = new Map();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
    res.send("Tudo certo <3");
});

app.get("/all", (req, res) => {
    const allClients = Array.from(clients.keys()).map(client => client.remoteAddress);
    res.json(allClients);
});

io.on("connection", socket => {
    console.log("Cliente WebSocket conectado:", socket.id);

    // Adiciona o socket do cliente ao mapa de clientes
    clients.set(socket.id, socket);

    socket.on("message", message => {
        console.log("Mensagem Recebida do Cliente:", message);
        // Envie uma mensagem de volta para o cliente WebSocket
        socket.emit("message", "Olá Meu querido... " + message);
    });

    socket.on("disconnect", () => {
        console.log("Cliente WebSocket desconectado:", socket.id);
        // Remove o cliente do mapa de clientes quando ele se desconectar
        clients.delete(socket.id);
    });

    socket.on("error", err => {
        console.error("Erro:", err);
    });
});

server.listen(3000, () => {
    console.log("Servidor Express Rodando na Porta 3000");
});
