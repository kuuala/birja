const port = 1312;
const io = require('socket.io')(port);
const db = require('./config').db;
let redis = require("redis");
let client = redis.createClient();
let all_clients = [];

io.on('connection', function (socket) {
    all_clients.push(socket);
    client.rpush.apply(client, ['test'].concat(JSON.stringify(socket)));
    console.log(socket.id);
    socket.on('disconnect', function() {
        let i = all_clients.indexOf(socket);
        all_clients.splice(i, 1);
        client.del(client, ['test']);
        all_clients.forEach((element) => {
            client.rpush.apply(client, ['test'].concat(JSON.stringify(element)));
        });
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
        console.log(socket.id, JSON.parse(message));
    });
});