var io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });

io.emit('unicorn.creation', 'test1');
io.emit('unicorn.hybridisation', 'test2');
io.emit('unicorn.transfer', 'test3');
// setInterval(function(){
//   io.emit('time', new Date);
// }, 5000);
