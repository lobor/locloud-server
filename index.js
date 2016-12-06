// const config = require('./config/config.json');
//
// var PeerServer = require('peer').PeerServer;
// var server = PeerServer({port: 2700, key: config.hash});
//
// let Peer = require('peerjs');
//
// server.on('connection', function(id) {
//   console.log('connecting', id);
//   server.send('helloWorld')
// });
//
// server.on('disconnect', function(id) { console.log('disconnect'); });
//
//
// server.on('data', function(data){
//   console.log(data);
// })

var http = require("http").createServer(),
    io = require("socket.io").listen(http);
//
http.listen(2700, function(){
  io.on('connection', function (socket) {
    console.log('connection');

    socket.emit('etablish');
    //
    // socket.on('testHash', function (data, cb) {
    //   console.log(data);
    //   if(config.hash === data.hash){
    //     cb(true);
    //   }
    //   else{
    //     cb(false);
    //   }
    // });
    //
    // socket.on('disconnect', function () {
    //   io.emit('user disconnected');
    // });
  });
});

// var io = require('socket.io').listen(2700);
//
// io.on('connection', function (socket) {
//   console.log('connection');
//
//   socket.emit('etablish');
//
//   socket.on('testHash', function (data, cb) {
//     console.log(data);
//     if(config.hash === data.hash){
//       cb(true);
//     }
//     else{
//       cb(false);
//     }
//   });
//
//   socket.on('disconnect', function () {
//     io.emit('user disconnected');
//   });
// });
