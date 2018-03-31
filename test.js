'use strict';
require('dotenv').config()
// Add the web3 node module
const redis = require('redis').createClient(6379)
const redis_pub = redis;

//connect to redis
// var io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });


// function publishUnicornEvent(event, data) {
//     redis_pub.publish("unicorn-delete-node-dev",
//         JSON.stringify({
//             event,
//             data
//         }));
//     // io.emit(event, data);
// }


function publishUnicornEvent(event, data) {
    redis_pub.publish("unicorn-delete-node-dev",
        JSON.stringify(data));
    // io.emit(event, data);
}


// setInterval(function(){
    publishUnicornEvent("crated", {
            id: 34,
            owner: '0x0234',
        }
    )
    // io.emit('time', new Date);
// }, 5000);


