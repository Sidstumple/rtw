// var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var env = require('dotenv').config();
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 3000);
console.log('server listening on port 3000');

app.use('/static', express.static('./static'));

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = process.env.REDIRECT_URI; // Your redirect uri
var users = [];
var connections = [];

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
})

app.get('/login', function(req, res) {
  //It's necessary to encode the permissions string to allow for scopes like channels:read
  var permissions = encodeURIComponent('client');

  console.log("serving Spotify button with permissions: " + permissions);

  // Here we need app to access Express instance called 'app' we created
  if (app.accessToken){
    console.log("already have oauth, reroute client to /whatsplaying");
    res.redirect('/whatsplaying');
  } else {
    // your application requests authorization
    console.log("new instance");
    var scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-read-recently-played';

    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
    }));
  }
});

app.get('/callback', function(req, res) {
  var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  // use the access token to access the Spotify Web API
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token;
    var refresh_token = body.refresh_token;
    app.accessToken = body.access_token;
    // console.log(body);
    res.redirect('/whatsplaying');
  });
});

app.get('/whatsplaying', function(req, res) {
  // console.log(app.accessToken);

  if (app.accessToken){

    var options = {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: { 'Authorization': 'Bearer ' + app.accessToken },
      json: true
    }

    request.get(options, function(error, response, body) {
      // console.log(app.accessToken);
      // console.log(body.item);

      res.render('whatsplaying', {body: body});
    });
  } else {
    res.redirect('/');
  }
})

io.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // Disconnect
  socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length)
  });

  // Checks if a new song is played:
  socket.on('next song', function(data) {
    // console.log(data.song, data.artist);
    var options = {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: { 'Authorization': 'Bearer ' + app.accessToken },
      json: true
    }

    request.get(options, function(error, response, body) {
      console.log(data.song == body.item.name);
      console.log(data.artist == app.artists);
      console.log(data.song);
      console.log(body.item.name);


      body.item.artists.map(function(obj){
        app.artists = obj.name;
      })

      if(data.song !== body.item.name || data.artist !== app.artists) {
        console.log('update this sonnng!');
        socket.emit('update song', {body: body});
      } else {
        console.log('still listening to the same tune?');
      }
    });
    console.log('Check if a new song is played');
  })

});
