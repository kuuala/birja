const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 1309;

server.listen(port);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});