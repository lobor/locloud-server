const config = require('./config/config.json');
const db = require('./db/db')(process.cwd() + '/tmp/');

var http = require("http").createServer(),
    io = require("socket.io").listen(http);

io.use((socket, next) => {
  if(socket.handshake.headers.authorization === config.hash){
    next();
  }
  else{
    next(new Error('Authentication error'));
  }
});

http.listen(2700, function(){


  io.on('connection', function (socket) {
    socket.on('set', (data, cb) => {
      let table = db.use(data.table);
      let donnee =  table.findById(data.id);

      if(donnee){
        table.set(data.id, data);
      }
      else{
        table.push(data.id, data.data)
      }
      table.save();
      cb();
    });

    socket.on('get', (cb) => {
      let datas = {};
      for(let table in db.tables){
        datas[table] = db.tables[table].datas;
      }
      // console.log(db);
      // let table = db.use(data.table);
      // let donnee =  table.findById(data.id);
      //
      // if(donnee){
      //   table.set(data.id, data);
      // }
      // else{
      //   table.push(data.id, data.data)
      // }
      // table.save();
      cb(datas);
    });
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
  //   //
  //   // socket.on('disconnect', function () {
  //   //   io.emit('user disconnected');
  //   // });
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
