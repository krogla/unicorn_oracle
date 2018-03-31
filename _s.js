const http = require('http').createServer();
const io = require('socket.io')(http, {
//  path: '/socket.io',
  serveClient: false,
  // below are engine.IO options
  // pingInterval: 10000,
  // pingTimeout: 5000,
  //origins: '*',
  cookie: false
});
const redis = require('socket.io-redis');
const port = 6001;
io.adapter(redis({host: 'localhost', port: 6379}));

// middleware
io.use((socket, next) => {
  let token = socket.handshake.query.token;
  //let clientId = socket.handshake.headers['x-clientid'];
  if (checkToken(token)) {
    return next();
  }
  return next(new Error('authentication error'));
});

// then
io.on('connection', (socket) => {
  console.log('Connected:', socket.id);
  socket.on('disconnect', (reason) => {
    console.log('Disconnected:', socket.id);
    // ...
  });
  let token = socket.handshake.query.token;
//  socket.to(socket.id).emit('message', 'Hello' + socket.id);
    //test events
    socket.emit('message', 'Hello ' + socket.id);
    socket.emit('unicorn.creation', 'test1');
    socket.emit('unicorn.hybridisation', 'test2');
    socket.emit('unicorn.transfer', 'test3');

   //let rooms = Objects.keys(socket.rooms);
    //console.log('Rooms: ', socket.rooms); 
  //console.log('Auth OK with token:', token);
  // ...
  //socket.on('test', function(id, msg){
//    socket.broadcast.to(id).emit('message', msg);
 // });
});

http.listen(port, '0.0.0.0', function() {
    console.log('Server Started. Listening on *:' + port);
});


function checkToken(token) {
    return true; //token=='cde';
}

