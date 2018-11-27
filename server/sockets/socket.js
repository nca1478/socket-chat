const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

// Manejar eventos de conexión
io.on('connection', (client) => {

  // Listener del evento entrarChat
  client.on('entrarChat', (data, callback) => {

    // Si no viene el nombre, retornar error
    if(!data.nombre || !data.sala){
      return callback({
        error: true,
        mensaje: 'El nombre/data son necesarios'
      });
    }

    //Conectar a una sala de chat
    client.join(data.sala);

    // Si viene el nombre, agregar persona al array de usuarios conectados
    usuarios.agregarPersona(client.id, data.nombre, data.sala);

    // Notificar a todos los usuarios (de la sala de chat), las personas conectadas
    client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

    // Enviar personas conectadas
    callback(usuarios.getPersonasPorSala(data.sala));

  })

  // Escucha mensaje de cualquier usuario y lo muestra a todos los usuarios
  client.on('crearMensaje', (data) => {

    let persona = usuarios.getPersona(client.id);
    let mensaje = crearMensaje(persona.nombre, data.mensaje);

    // Enviar mensaje a todos los usuarios (de la sala de chat)
    client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

  })

  // Evento cuando un usuario se desconecta del chat
  client.on('disconnect', () => {
    
    // Borrar persona
    let personaBorrada = usuarios.borrarPersona(client.id);

    // Notificar a los usuarios conectados el usuario que se desconectó
    client.broadcast.to(personaBorrada.sala).emit(
      'crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`)
    );

    // Notificar a todos los usuarios (por sala), las personas conectadas
    client.broadcast.to(personaBorrada.sala).emit(
      'listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala)
    );

  })

  // Mensajes privados
  client.on('mensajePrivado', (data) => {
    
    let persona = usuarios.getPersona(client.id);

    // Envia mensaje a persona (id) especificado (data.para)
    client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

  })

})