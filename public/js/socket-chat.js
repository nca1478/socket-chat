var socket = io();

// Leer el nombre del usuario por parametro de URL
var params = new URLSearchParams(window.location.search);

// Si no viene el nombre por params, redirecciona a index.html
if(!params.has('nombre') || !params.has('sala')) {
  window.location = 'index.html';
  throw new error('El nombre y la sala son necesarios');
}

// Nombre de usuario via params
var usuario = {
  nombre: params.get('nombre'), 
  sala: params.get('sala')
}

// Manejar evento de conexión (escuchar)
socket.on('connect', function () {

  console.log('Conectado al servidor');

  // Cuento se entre al chat, enviar del servidor los usuarios conectados
  socket.emit('entrarChat', usuario, function(resp){
    //console.log('Usuarios conectados', resp);
    renderizarUsuarios(resp);
  });

})

// Manejar evento de desconexión (escuchar)
socket.on('disconnect', function () {

  console.log('Perdimos conexión con el servidor');

})

// Enviar información al servidor
// socket.emit('crearMensaje', {
//   nombre: 'Nelson',
//   mensaje: 'Hola mundo'
// }, function (resp) {
//   console.log('Respuesta server: ', resp);
// });

// Crear mensaje del servidor
socket.on('crearMensaje', function (mensaje) {
  //console.log('Servidor:', mensaje)
  renderizarMensajes(mensaje, false);
  scrollBottom();
})

// Escuchar cambios de usuarios
socket.on('listaPersona', function (personas) {
  //console.log(personas);
  renderizarUsuarios(personas);
})

// Mensajes Privados
socket.on('mensajePrivado', function(mensaje){
  console.log('Mensaje privado:', mensaje);
})


