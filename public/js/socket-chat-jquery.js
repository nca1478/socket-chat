// Funciones para renderizar usuarios

// Parametros del frontend
var params = new URLSearchParams(window.location.params);

// Referencias de jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

// Referencias parametros del frontend
var nombre = params.get('nombre');
var sala = params.get('sala');

// Renderizar usuarios conectados (personas es un array)
function renderizarUsuarios(personas) {
  console.log(personas);

  var html = '';

  // Html que se mostrara en el frontend
  html += '<li>';
  html += '<a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
  html += '</li>';

  for (let i = 0; i < personas.length; i++) {

    html += '<li>';
    html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
    html += '</li>';

  }

  // Inserta todo el contenido de la variable html, en el divUsuarios del front
  divUsuarios.html(html);

}

// Mostrar los mensajes en la sala de chat
function renderizarMensajes(mensaje, yo) {

  // Contenido del mensaje en formato html
  var html = '';
  var fecha = new Date(mensaje.fecha);
  var hora = fecha.getHours() + ';' + fecha.getMinutes();

  // Bandera estilos mensajes del administrador
  var adminClass = 'inverse';
  if( mensaje.nombre === 'Administrador' ){
    adminClass = 'danger';
  }

  // Renderiza dependiendo si soy yo o los otros usuarios
  if(yo){
    html += '<li class="animated fadeIn">';
    html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    html += '<div class="chat-content">';
    html += '<h5>' + mensaje.nombre + '</h5>';
    html += '<div class="box bg-light-info">' + mensaje.mensaje + '</div>';
    html += '</div>';
    html += '<div class="chat-time">' + hora + '</div>';
    html += '</li>';
  }
  else{
    html += '<li class="reverse">';    
    html += '<div class="chat-content">';
    html += '<h5>' + mensaje.nombre + '</h5>';
    html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
    html += '</div>';
    
    // Si es administrador, no muestra ningún avatar
    if( mensaje.nombre != 'Administrador' ){
      html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';      
    }
    html += '<div class="chat-time">' + hora + '</div>';
    html += '</li>';
  }

  // Agregando el mensaje a la caja de mensajes
  divChatbox.append(html);
}

// Mover el scroll si es necesario
function scrollBottom() {

  // selectors
  var newMessage = divChatbox.children('li:last-child');

  // heights
  var clientHeight = divChatbox.prop('clientHeight');
  var scrollTop = divChatbox.prop('scrollTop');
  var scrollHeight = divChatbox.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      divChatbox.scrollTop(scrollHeight);
  }
}

// Listeners
// Cuando se de click en el usuario, mostrar el id
divUsuarios.on('click', 'a', function () {

  // Extraer el contenido del atributo data-id
  var id = $(this).data('id');

  // Si viene el id, entonces mostrarlo
  if (id) {
    console.log(id);
  }

});

// Submit del formulario de enviar mensaje
formEnviar.on('submit', function (e) {
  e.preventDefault();

  // Validar que el mensaje no venga vacio
  if (txtMensaje.val().trim().length === 0) {
    return;
  }

  // Crear mensaje
  socket.emit('crearMensaje', {
    nombre: nombre,
    mensaje: txtMensaje.val()
  }, function (mensaje) {
    txtMensaje.val('').focus();
    renderizarMensajes(mensaje, true);
    scrollBottom();
  });


})