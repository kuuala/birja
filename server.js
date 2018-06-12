const port = 1312;
const io = require('socket.io')(port);
const db = require('./config').db;
let redis = require('redis');
let sub = redis.createClient();
sub.subscribe('test_channel');

io.on('connection', function (socket) {
    console.log(socket.id);
    socket.on('disconnect', function() {
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
        let mess = JSON.parse(message);
        if ((channel === 'test_channel') && (socket.id === mess.id_socket)) {
            socket.send({address: mess.transaction, txid: mess.txid});
        }
    });
});