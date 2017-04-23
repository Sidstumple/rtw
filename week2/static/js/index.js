(function() {
  var song = document.getElementById('song');
  var artist = document.getElementById('artist');
  var image = document.getElementById('image');
  console.log('hoi');
    var socket = io();

    setInterval(function(){
      socket.emit('next song', {song: song.innerHTML, artist: artist.innerHTML})
    }, 2000);

    socket.on('update song', function(data){
      console.log(data.body.item.artists);
        song.innerHTML = data.body.item.name;
        data.body.item.artists.map(function(obj) {
          artist.innerHTML = obj.name;
        })
        data.body.item.album.images.map(function(obj) {
          image.innerHTML = `<img src="${obj.url}" alt="">`;
          image.classList.add('newsong');
        })
    })
  })();
