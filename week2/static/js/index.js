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
      like.addEventListener('click', function(e){
        like.classList.add('liked');
        console.log(e.target.id);
        socket.emit('like', {id: e.target.id})
      })
      socket.emit('new user', {playlist: playlist.innerHTML})

      var info = document.getElementById('info');
      document.getElementById(data.users[obj]._id).classList.remove('empty');
    })
  })

  socket.on('check song', function() {
    socket.emit('next song');
    // console.log('[CHEEECK]');
  })

  socket.on('liked', function(id) {
    console.log(id.target);
    document.getElementById(id.target).classList.add('liked');
  })


  socket.on('update song', function(data){
    Object.keys(data.users).forEach(function(obj){
      var song = document.getElementById(`${data.users[obj]._id}-song`);
      var artist = document.getElementById(`${data.users[obj]._id}-artist`);
      var image = document.getElementById(`${data.users[obj]._id}-image`);
      var info = document.getElementById('info');

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
        var like = document.getElementById(data.users[obj]._id+'-like');
        like.addEventListener('click', function(e){
          like.classList.add('liked');
          console.log(e.target.id);
          socket.emit('like', {id: e.target.id})
        })
      } else {
        image.innerHTML = `<img src="${data.users[obj].albumImage}" alt="">`
        artist.innerHTML = data.users[obj].artist;
        song.innerHTML = data.users[obj].song;
      }
      document.getElementById(data.users[obj]._id).classList.remove('empty');
    })
  })
})();
