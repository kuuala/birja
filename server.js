const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 8080;

app.get('/', function(req, res) {
    res.send('hello from server');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('error', err);
    }

    console.log(`ok, port: ${port}`);
});