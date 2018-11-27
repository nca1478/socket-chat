// Dependencias
const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

// Correr express
const app = express();

// Correr servidor para socket.io
let server = http.createServer(app);

// Configuración
const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

// Habilitar carpeta public
app.use(express.static(publicPath));

// Inicializar el socket.io - comunicación del backend
module.exports.io = socketIO(server);
require('./sockets/socket');

// Puerto del servidor
server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});