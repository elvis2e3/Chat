var socket = io.connect('https://chat-2e3.herokuapp.com');
var yo;
var clientes = {};

//ennviar tu contacto
  $("#enviar").click(function(){
    var username = $("input").val();
    $("#dregistrado").text(username+" fuiste registrado correctamente :)");
    socket.emit("add-user", {"username": username});
    $("#nombre").text(username);
    yo=username;
    clientes[username] = {
      "nombre": yo
    };
  });

  //recibir ids
   socket.on("myids", function(data){
     $("#nombre").text(data);
     yo=data;
   });

//recibir mensaje
 socket.on("nuevoMensaje", function(data){
   if (clientes[data.userE]===undefined) {
     //console.log("el usuario no existe");
     clientes[data.userE] = {
       "nombre": data.userE
     };
    var cnombre="visto('"+data.userE+"')";
    $("#listaConectados").append("<li id='id"+data.userE+"'><a href='#chat"+data.userE+"' data-role='button' class='ui-link ui-btn ui-shadow ui-corner-all' role='button' onclick="+cnombre+">"+data.userE+"</a></li>");
    var fnombre="chatea('"+data.userE+"')";
    $("body").append(
      "<div id='chat"+data.userE+"' data-role='page' data-theme='a' data-url='chat"+data.userE+"'>"+
        "<div data-role='header' data-theme='b' role='banner' class='ui-header ui-bar-b'>"+
          "<h1 id='chatea' class='ui-title' role='heading' aria-level='1'>"+data.userE+"</h1>"+
          "<a href='#conectados' data-iconpos='notext' data-icon='carat-l' class='ui-link ui-btn-left ui-btn ui-icon-carat-l ui-btn-icon-notext ui-shadow ui-corner-all' data-role='button' role='button' onclick="+cnombre+">Conetados</a>"+
        "</div>"+
        "<div data-role='content' class='ui-content' role='main'>"+
          "<ul data-role='listview' id='mensajes"+data.userE+"' class='ui-listview'></ul>"+
        "</div>"+
        "<div data-role='footer' data-position='fixed' data-theme='b' role='contentinfo' class='ui-footer ui-bar-b ui-footer-fixed slideup ui-fixed-hidden'>"+
          "<input data-theme='a' id='mensaje"+data.userE+"' type='text'>"+
          "<center>"+
            "<a href='#' data-role='button' onclick="+fnombre+" class='ui-link ui-btn ui-shadow ui-corner-all' role='button'>Enviar</a>"+
          "</center>"+
        "</div>"+
      "</div>");
      $("#mensajes"+data.userE).append("<li class='ui-li-static ui-body-inherit'><h1>"+data.userE+"</h1><p>"+data.mensaje+"</p></li>");
      $("#id"+data.userE+" a").text(data.userE+" <<<>>> mensaje");
   }else{
     //console.log("usuario existente");
     $("#mensajes"+data.userE).append("<li class='ui-li-static ui-body-inherit'><h1>"+data.userE+"</h1><p>"+data.mensaje+"</p></li>");
     $("#id"+data.userE+" a").text(data.userE+" <<<>>> mensaje");
   }
 });

//nuevo contacto
 socket.on("nuevoConectado", function(nombre){
   if(nombre != yo) {
     clientes[nombre] = {
       "nombre": nombre
     };
    var cnombre="visto('"+nombre+"')";
    $("#listaConectados").append("<li id='id"+nombre+"'><a href='#chat"+nombre+"' data-role='button' class='ui-link ui-btn ui-shadow ui-corner-all' role='button' onclick="+cnombre+">"+nombre+"</a></li>");
    var fnombre="chatea('"+nombre+"')";
    $("body").append(
      "<div id='chat"+nombre+"' data-role='page' data-theme='a' data-url='chat"+nombre+"'>"+
        "<div data-role='header' data-theme='b' role='banner' class='ui-header ui-bar-b'>"+
          "<h1 id='chatea' class='ui-title' role='heading' aria-level='1'>"+nombre+"</h1>"+
          "<a href='#conectados' data-iconpos='notext' data-icon='carat-l' class='ui-link ui-btn-left ui-btn ui-icon-carat-l ui-btn-icon-notext ui-shadow ui-corner-all' data-role='button' role='button' onclick="+cnombre+">Conetados</a>"+
        "</div>"+
        "<div data-role='content' class='ui-content' role='main'>"+
          "<ul data-role='listview' id='mensajes"+nombre+"' class='ui-listview'></ul>"+
        "</div>"+
        "<div data-role='footer' data-position='fixed' data-theme='b' role='contentinfo' class='ui-footer ui-bar-b ui-footer-fixed slideup ui-fixed-hidden'>"+
          "<input data-theme='a' id='mensaje"+nombre+"' type='text'>"+
          "<center>"+
            "<a href='#' data-role='button' onclick="+fnombre+" class='ui-link ui-btn ui-shadow ui-corner-all' role='button'>Enviar</a>"+
          "</center>"+
        "</div>"+
      "</div>");
    }
 });

//enviar mensaje
 function chatea(nombre) {
   $("#mensajes"+nombre).append($("<li class='ui-li-static ui-body-inherit'><h1>"+yo+"</h1><p>"+$("#mensaje"+nombre).val()+"</p></li>"));
   socket.emit("mensajePrivado", {
     "userR": nombre,
     "userE": yo,
     "mensaje": $("#mensaje"+nombre).val()
   });
   $("#mensaje"+nombre).val('');
 }

function actualizar() {
  //console.log("actualizar");
  socket.emit("actualizarLista", yo);
}

//actulizar lista
socket.on("lista", function(data){
  for(var name in data) {
    if (clientes[name]===undefined && name!=yo) {
      //console.log(">>> "+name);
      clientes[name] = {
        "nombre": name
      };
    var cnombre="visto('"+name+"')";
     $("#listaConectados").append("<li id='id"+name+"'><a href='#chat"+name+"' data-role='button' class='ui-link ui-btn ui-shadow ui-corner-all' role='button' onclick="+cnombre+">"+name+"</a></li>");
     var fnombre="chatea('"+name+"')";
     $("body").append(
       "<div id='chat"+name+"' data-role='page' data-theme='a' data-url='chat"+name+"'>"+
         "<div data-role='header' data-theme='b' role='banner' class='ui-header ui-bar-b'>"+
           "<h1 id='chatea' class='ui-title' role='heading' aria-level='1'>"+name+"</h1>"+
           "<a href='#conectados' data-iconpos='notext' data-icon='carat-l' class='ui-link ui-btn-left ui-btn ui-icon-carat-l ui-btn-icon-notext ui-shadow ui-corner-all' data-role='button' role='button' onclick="+cnombre+">Conetados</a>"+
         "</div>"+
         "<div data-role='content' class='ui-content' role='main'>"+
           "<ul data-role='listview' id='mensajes"+name+"' class='ui-listview'></ul>"+
         "</div>"+
         "<div data-role='footer' data-position='fixed' data-theme='b' role='contentinfo' class='ui-footer ui-bar-b ui-footer-fixed slideup ui-fixed-hidden'>"+
           "<input data-theme='a' id='mensaje"+name+"' type='text'>"+
           "<center>"+
             "<a href='#' data-role='button' onclick="+fnombre+" class='ui-link ui-btn ui-shadow ui-corner-all' role='button'>Enviar</a>"+
           "</center>"+
         "</div>"+
       "</div>");
    }
  }
});

///usuario eliminado
socket.on("clienteEliminado", function(data){
  $("#id"+data).remove();
  $("#chat"+data).remove();
});

function apagar() {
  console.log("apagar");
  socket.emit("salir", yo);
}

function visto(nombre) {
  $("#id"+nombre+" a").text(nombre);
}
