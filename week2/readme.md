# Real time Spotify app
A real time depiction of what a Spotify user is listening to.
View demo on:
https://spotify-rtw.herokuapp.com/

## Description

## OAuth
To access user-specific data my app uses OAuth to ask permission from the Spotify server. When the user clicks the 'Login with Spotify' button they will be directed to `/login`. If the user already has an access token for the declared `scope` (when the user has logged in before), they will be redirected to `/whatsplaying`. Otherwise they will be redirected:
```
res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
    }));
```
This takes the unique client_id that was specified by Spotify to let the user know what application is trying to access their profile. After the user logs in they will be redirected to the redirect URI I specified on the Spotify website.
The scope I declared determines what data I will have access to:
```
var scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-read-recently-played';
```
If I change the scope the user will have to give permission again.

When the user has logged in and has been redirected to the redirect URI. The server has put a unique code in the URI which I can use to get the `access token` & `refresh token`. I use the node module `request` to call the API again and save `access_token` in a `express` property named `app.accessToken`. I didn't know you could add properties to the `app` object of `express`, they are very useful because they can be used in the global scope even though they are declared in a local scope. I can now use `app.accessToken` to get user-specific data from the Web API. After my app gets an `access token` it's redirected to `/whatsplaying`.

```
var code = req.query.code; //gets code from the URI
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

request.post(authOptions, function(error, response, body) {
  var access_token = body.access_token;
  var refresh_token = body.refresh_token;
  app.accessToken = body.access_token;

  res.redirect('/whatsplaying');
});
```


## Spotify API
This app uses the Spotify Web API. This Web API lets applications fetch data from the Spotify music catalog and manage user’s playlists and saved music. I used it to find out what the user is currently listening to. I am using `request` to do API calls.
The API needs OAuth to get user-specific information on listened to songs, `headers` is necessary to get the right authorisation.
```
var options = {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: { 'Authorization': 'Bearer ' + app.accessToken },
      json: true
    }

    request.get(options, function(error, response, body) {
      res.render('whatsplaying', {body: body});
    });
```
Using the node module `ejs` I am sending data to the `whatsplaying.ejs` file.

## Socket.io
To send data from the server to the client and back I use `socket.io`. I use it to send the current `innerHTML` (song + artist) of HTML tags to the server to compare with new data.

I used `setInterval` to make sure data is checked every second, I couldn't think of another way to check if the data changed, but I really would like to!

In `index.js`:
```
setInterval(function(){
      socket.emit('next song', {song: song.innerHTML, artist: artist.innerHTML})
    }, 2000);
```
With `socket.emit` the data (`song.innerHTML` & `artist.innerHTML`) is sent to the server as an event. The server uses this data:

In `app.js`
```
socket.on('next song', function(data) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: { 'Authorization': 'Bearer ' + app.accessToken },
    json: true
  }

  request.get(options, function(error, response, body) {
    body.item.artists.map(function(obj){
      app.artists = obj.name; // saves name of the artist in global variable app.artists
    })

    if(data.song !== body.item.name || data.artist !== app.artists) {
      console.log('update this sonnng!');
      socket.emit('update song', {body: body});
    } else {
      console.log('still listening to the same tune?');
    }
  });
})
```
If the old-artist or -song is different from the new data, the new data is sent to the client: `socket.emit('update song', {body: body});`.

In `index.js`:
```
socket.on('update song', function(data){
  song.innerHTML = data.body.item.name;
  data.body.item.artists.map(function(obj) {
    artist.innerHTML = obj.name;
  })
  data.body.item.album.images.map(function(obj) {
    image.innerHTML = `<img src="${obj.url}" alt="">`;
    image.classList.add('newsong');
  })
})
```

### Dependencies
- [Dot env](https://www.npmjs.com/package/dotenv)
- [EJS](https://www.npmjs.com/package/ejs)
- [Express](https://www.npmjs.com/package/express)
- [Query String](https://www.npmjs.com/package/querystring)
- [request](https://www.npmjs.com/package/request)
- [socket.io](https://www.npmjs.com/package/socket.io)
