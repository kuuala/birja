class crypto_config {
    constructor(name, connection, type){
        this.name = name;
        this.connection = connection;
        this.type = type;
    }
}

module.exports.wallets = [
    new crypto_config('zcash', 'http://username:12341234@127.0.0.1:8089', 'btc')
];
