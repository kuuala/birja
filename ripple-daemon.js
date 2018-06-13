const RippleAPI = require('ripple-lib').RippleAPI;
const ripple_config = require('./config').ripple_config;

const api = new RippleAPI({
    server: ripple_config.connection
});

api.connect()
    .then(() => {
    })
    .catch((error) => {
        console.error(error);
    });

api.on('connected', () => {
    console.log('connect to ' + ripple_config.connection);
});

api.on('disconnected', (code) => {
   console.error('disconnect from' + ripple_config.connection + ' with code: ' + code);
});

api.on('error', (errorCode, errorMessage, data) => {
    console.error(errorCode + ': ' + errorMessage);
});

api.on('ledger', (ledger) =>{
    let options = {
        includeTransactions: true,
    };
    api.getLedger(options)
        .then((data) => {
            data.transactionHashes.forEach((transaction) => {
                api.getTransaction(transaction)
                    .then((data) => {
                        db.query(`SELECT user_id FROM transactions WHERE transaction = '${data.address}'`, (error, result) => {
                            if (error) {
                                console.error(error);
                            } else {
                                result.forEach((users) => {
                                    pub.publish('test_channel', JSON.stringify({id_socket: users['user_id'], transaction: data.address, txid: data.id}));
                                });
                            }
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });
        })
        .catch((error) => {
            console.error(error);
        });
});
