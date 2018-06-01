const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const port = 1309;
const db = require('./config').db;
db.connect(function(err) {
    if (err) {
        throw err;
    }
});

server.listen(port);

let urlencodedParser = bodyParser.urlencoded({extended: false});

app.get('/', function (request, response) {
    response.sendfile(__dirname + '/index.html');
});

app.post("/follownewtransaction", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    /*db.query(`INSERT into transactions VALUES ('${request.body.ID}', '${request.body.transaction}')`, (err) => {
        if (err) {
            throw err;
        }
    });*/
    response.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});