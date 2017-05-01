(function() {
  var song = document.getElementById('song');
  var artist = document.getElementById('artist');
  var image = document.getElementById('image');
  var socket = io();

  socket.on('connection', function (data) {
    
  })

  setInterval(function(){
    socket.emit('next song', {song: song.innerHTML, artist: artist.innerHTML})
  }, 2000);

  socket.on('update song', function(data){
    // console.log(data.body.item.artists);
      song.innerHTML = data.body.item.name;
      artist.innerHTML = data.artist;
      image.innerHTML = `<img src="${data.image}" alt="">`;
  })
})();
