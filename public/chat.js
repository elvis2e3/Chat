var socket = io.connect('http://192.168.0.11:3000');
var yo;
  $("#enviar").click(function(){
    var username = $("input").val();
    socket.emit("add-user", {"username": username});
    $("#nombre").text(username);
    yo=username;
  });

 socket.on("nuevoMensaje", function(data){
  $("#mensajes"+data.userE).append("<li class='ui-li-static ui-body-inherit'><h1>"+data.userE+"</h1><p>"+data.mensaje+"</p></li>");
 });

 socket.on("nuevoConectado", function(nombre){
  $("#dregistrado").text(nombre+" fuiste registrado correctamente :)");
  $("#listaConectados").append("<li><a href='#chat"+nombre+"' data-role='button' class='ui-link ui-btn ui-shadow ui-corner-all' role='button'>"+nombre+"</a></li>");
  var fnombre="chatea('"+nombre+"')";
  $("body").append(
    "<div id='chat"+nombre+"' data-role='page' data-theme='a' data-url='chat"+nombre+"'>"+
      "<div data-role='header' data-theme='b' role='banner' class='ui-header ui-bar-b'>"+
        "<h1 id='chatea' class='ui-title' role='heading' aria-level='1'>"+nombre+"</h1>"+
        "<a href='#conectados' data-iconpos='notext' data-icon='carat-l' class='ui-link ui-btn-left ui-btn ui-icon-carat-l ui-btn-icon-notext ui-shadow ui-corner-all' data-role='button' role='button'>Conetados</a>"+
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
 });

 function chatea(nombre) {
   $("#mensajes"+nombre).append($("<li class='ui-li-static ui-body-inherit'><h1>"+yo+"</h1><p>"+$("#mensaje"+nombre).val()+"</p></li>"));
   socket.emit("mensajePrivado", {
     "userR": nombre,
     "userE": yo,
     "mensaje": $("#mensaje"+nombre).val()
   });
   $("#mensaje"+nombre).val('');
 }
