(function() {
  var song = document.getElementById('song');
  var artist = document.getElementById('artist');
  var image = document.getElementById('image');
  console.log('hoi');
    var socket = io();

    console.log(song.innerHTML);
    setInterval(function(){
      socket.emit('next song', {song: song.innerHTML, artist: artist.innerHTML})
    }, 1000);

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
  //   var chatArea = document.getElementById('chatArea')
  //   var message = document.getElementById('message');
  //   var messageForm = document.getElementById('messageForm');
  //   var chat = document.getElementById('message-list');
  //   var username = document.getElementById('username');
  //   var userForm = document.getElementById('userForm');
  //   var userFormArea = document.getElementById('userFormArea');
  //   var users = document.getElementById('users');
  //   userForm.addEventListener('submit', function() {
  //     event.preventDefault();
  //     socket.emit('new user', username.value, function(data){
  //       if(data){
  //         userFormArea.classList.add('hide');
  //         chatArea.classList.remove('hide');
  //       }
  //     });
  //     username.value = '';
  //   })
  //   socket.on('get users', function(data) {
  //     var html = '';
  //     for(i = 0; i < data.length; i++){
  //       html += `<li>${data[i]}</li>`;
  //     }
  //     users.innerHTML = html;
  //   })
  //   messageForm.addEventListener('submit', function(){
  //     event.preventDefault();
  //     socket.emit('send message', message.value);
  //     message.value = '';
  //   });
  //   socket.on('new message', function(data) {
  //     var newMessage = document.createElement('li');
  //     var messageSender = document.createTextNode(data.user);
  //     console.log(data.user);
  //     var messageContent = document.createTextNode(data.msg);
  //     newMessage.append(messageSender, ': ' ,messageContent);
  //     chat.append(newMessage)
  //   });
  })();
