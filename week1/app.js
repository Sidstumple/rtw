var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

app.set('view engine', 'ejs'); // Render all html via ejs
app.use('/static', express.static('./static'));

app.get('/', function(req, res){
  res.render('index');
});

io.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // Disconnect
  socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length)
  });

  // New user
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(data);
    updateUsernames();
  })
  function updateUsernames(){
    io.sockets.emit('get users', users)
  }

  // Send message
  socket.on('send message', function(message){
    console.log(message);
    io.sockets.emit('new message', {msg: message, user: socket.username})
  });

});

server.listen(process.env.PORT || 3004);
console.log('listening on *:3004');
