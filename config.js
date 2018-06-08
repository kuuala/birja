const mysql = require('mysql');
class crypto_config {
    constructor(name, connection, type){
        this.name = name;
        this.connection = connection;
        this.type = type;
    }
}

module.exports.wallets = [
    new crypto_config('zcash', 'http://username:12341234@127.0.0.1:8089', 'btc'),
    //new crypto_config('ripple', 'wss://s.altnet.rippletest.net:51233', 'xrp'),
    //new crypto_config('ethereum', '', 'eth')
];

module.exports.db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'transactions_notification'
});
