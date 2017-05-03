(function() {
  var playlist = document.getElementById('playlist')
  var socket = io();

  socket.on('start', function (data) {
    // console.log(data.body.item.artists);
    // console.log(Object.keys(data.users));

    Object.keys(data.users).forEach(function(obj){
      console.log(data.users[obj]);
      playlist.innerHTML +=
      `<div class="info empty" id="${data.users[obj]._id}">
        <div id="image" class="image"><img src="${data.users[obj].albumImage}" alt=""></div>
        <div class="text">
          <p><strong>Artist: </strong> <span id="artist">${data.users[obj].artist}</span></p>
          <p><strong>Song: </strong> <span id="song">${data.users[obj].song}</span></p>
        </div>
      </div>`
      var info = document.getElementById('info');
      document.getElementById(data.users[obj]._id).classList.remove('empty');
    })
  })

  setInterval(function(){
    socket.emit('next song')
  }, 3000);

  socket.on('update song', function(data){
    var song = document.getElementById('song');
    var artist = document.getElementById('artist');
    var image = document.getElementById('image');
    console.log(Object.keys(data.users, "update song"));

    Object.keys(data.users).forEach(function(obj){
      var info = document.getElementById('info');
      console.log(data.users[obj]);
      if(data.users[obj]._id == document.getElementById(data.users[obj]._id).id){
        image.innerHTML = `<img src="${data.users[obj].albumImage}" alt="">`
        artist.innerHTML = data.users[obj].artist;
        song.innerHTML = data.users[obj].song;
      }
      document.getElementById(data.users[obj]._id).classList.remove('empty');
    })
  })
})();
