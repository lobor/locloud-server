// note, io(<port>) will create a http server for you
var io = require('socket.io')(2700);

io.on('connection', function (socket) {
  socket.on('testConnection', function (cb) {
    console.log('connect ok');
    cb();
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
});
