var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

clients={}

io.sockets.on('connection', function (socket) {
  socket.on('add-user', function(data){
    console.log(data);
    clients[data.username] = {
      "socket": socket.id
    };
    io.sockets.emit('nuevoConectado',data.username);
  });

  socket.on('mensajePrivado', function(data){
    console.log("enviando: " + data.mensaje + " a " + data.userR);
    if (clients[data.userR]){
      console.log(data);
      io.sockets.connected[clients[data.userR].socket].emit("nuevoMensaje", data);
      //io.sockets.connected[clients[data.userE].socket].emit("nuevoMensaje", data);
    } else {
      console.log("User does not exist: " + data.userR);
    }
  });

  socket.on('disconnect', function() {
    for(var name in clients) {
      if(clients[name].socket === socket.id) {
        delete clients[name];
        break;
      }
    }
  })

});

server.listen(3000);
