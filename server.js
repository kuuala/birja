const port = 1309;
const io = require('socket.io')(port);
const db = require('./config').db;
db.connect(function(err) {
    if (err) {
        throw err;
    }
});

let all_clients = [];
module.exports.all_clients = all_clients;

io.on('connection', function (socket) {
    all_clients.push(socket);
    console.log(socket.id);
    socket.on('disconnect', function() {
        let i = all_clients.indexOf(socket);
        all_clients.splice(i, 1);
        db.query(`DELETE FROM transactions WHERE user_id = '${socket.id}'`, (err) => {
            if (err) {
                throw err;
            }
        });
    });

    socket.on('message', function(message){
        db.query(`INSERT INTO transactions VALUES ('${socket.id}', '${JSON.parse(message)}')`, (err) => {
            if (err) {
                throw err;
            }
        });
        console.log(socket.id, JSON.parse(message));
    });
});