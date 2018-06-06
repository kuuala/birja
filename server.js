const port = 1312;
const io = require('socket.io')(port);
const db = require('./config').db;
let redis = require("redis");
let sub = redis.createClient();
let all_clients = [];
sub.subscribe('test_channel');

io.on('connection', function (socket) {
    all_clients.push(socket);
    console.log(socket.id);
    socket.on('disconnect', function() {
        let i = all_clients.indexOf(socket);
        all_clients.splice(i, 1);
        db.query(`DELETE FROM transactions WHERE user_id = '${socket.id}'`, (error) => {
            if (error) {
                console.error(error);
            }
        });
    });

    socket.on('message', function(message){
        db.query(`INSERT INTO transactions VALUES ('${socket.id}', '${JSON.parse(message)}')`, (error) => {
            if (error) {
                console.error(error);
            }
        });
    });

    sub.on('message', (channel, message) => {
        if (channel === 'test_channel') {
            console.log(message, socket.id);
            console.log(all_clients.length);
            socket.send(message);
        }
    })
});