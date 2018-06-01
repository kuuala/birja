const jayson = require('jayson/promise');
const wallets = require('./config').wallets;
const checker = require('./checker');
const bitcoin = require('./bitcoin');
const ethereum = require('./etheteum');
const ripple = require('./ripple');

function check(){
    wallets.forEach(function(elem){
        switch (elem.type){
            case 'eth':
                checker.ethereum_check(new ethereum(jayson.client.http(elem.connection), elem.name));
                break;
            case 'btc':
                checker.bitcoin_check(new bitcoin(jayson.client.http(elem.connection), elem.name));
                break;
            case 'xrp':
                checker.ripple_check();
                break;
            default:
                console.error('error wallet type in ' + elem.name);
                break;
        }
    });
}

setInterval(check, 10000);