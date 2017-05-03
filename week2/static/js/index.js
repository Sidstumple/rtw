(function() {
  var html = {}
  var playlist = document.getElementById('playlist')
  var socket = io();

  socket.on('start', function (data) {
    Object.keys(data.users).forEach(function(obj){
      console.log(data.users[obj]);

      playlist.innerHTML +=
      `<div class="info empty" id="${data.users[obj]._id}">
        <div id="${data.users[obj]._id}-image" class="image"><img src="${data.users[obj].albumImage}" alt=""></div>
        <div class="text">
          <p><strong>Artist: </strong> <span id="${data.users[obj]._id}-artist">${data.users[obj].artist}</span></p>
          <p><strong>Song: </strong> <span id="${data.users[obj]._id}-song">${data.users[obj].song}</span></p>
        </div>
        <div class="profile">
          <img src="${data.users[obj].profileImage}" alt="profile picture" class="profile-image">
          <p>${data.users[obj].name}</p>
        </div>
        <div id="${data.users[obj]._id}-like" class="like"></div>
      </div>`
      var like = document.getElementById(data.users[obj]._id+'-like');
      like.addEventListener('click', function(){
        console.log('clicked');
        like.classList.add('liked');
      })

      html.inner = playlist.innerHTML;
      var info = document.getElementById('info');
      document.getElementById(data.users[obj]._id).classList.remove('empty');
    })
  })





  setInterval(function(){
    socket.emit('next song')
  }, 1000);

  socket.on('update song', function(data){
    Object.keys(data.users).forEach(function(obj){
      console.log(data.users, '[THIS]');
      var song = document.getElementById(`${data.users[obj]._id}-song`);
      var artist = document.getElementById(`${data.users[obj]._id}-artist`);
      var image = document.getElementById(`${data.users[obj]._id}-image`);
      var info = document.getElementById('info');
      console.log('///////');
      console.log(data.users[obj]);

      if (document.getElementById(data.users[obj]._id) == null) {
        console.log('[NEW] song');
        playlist.innerHTML +=
        `<div class="info empty" id="${data.users[obj]._id}">
          <div id="${data.users[obj]._id}-image" class="image"><img src="${data.users[obj].albumImage}" alt=""></div>
          <div class="text">
            <p><strong>Artist: </strong> <span id="${data.users[obj]._id}-artist">${data.users[obj].artist}</span></p>
            <p><strong>Song: </strong> <span id="${data.users[obj]._id}-song">${data.users[obj].song}</span></p>
          </div>
          <div class="profile">
            <img src="${data.users[obj].profileImage}" alt="profile picture" class="profile-image">
            <p>${data.users[obj].name}</p>
          </div>
          <div id="${data.users[obj]._id}-like" class="like"></div>
        </div>`
      } else {
        console.log();
        image.innerHTML = `<img src="${data.users[obj].albumImage}" alt="">`
        artist.innerHTML = data.users[obj].artist;
        song.innerHTML = data.users[obj].song;
      }
      document.getElementById(data.users[obj]._id).classList.remove('empty');
    })
  })
})();
