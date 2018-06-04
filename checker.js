let all_clients = require('./server').all_clients;
const db = require('./config').db;
db.connect(function(err) {
    if (err) {
        throw err;
    }
});

function find_socket_by_id(socket_arr, id){
    return socket_arr.filter((elem) => { return elem.id === id; });
}

module.exports = class checker{
    static bitcoin_check(bitcoin_client, currency) {
        let last_checked_block;
        db.query(`SELECT last_block FROM last_checked_block WHERE currency = '${currency}'`, (err, res) => {
            if (err){
                console.error(err);
            }
            last_checked_block = res[0]['last_block'];
        });
        bitcoin_client.get_block_count()
            .then((data) => {
                if (data.result > last_checked_block) {
                    bitcoin_client.get_block_hash(last_checked_block)
                        .then((hash_block) => {
                            bitcoin_client.get_block(hash_block.result)
                                .then((block_info) => {
                                    block_info.result.tx.forEach(function(element){
                                        bitcoin_client.get_transaction(element)
                                            .then((transaction) => {
                                                console.log(transaction.result.toString());
                                                let details = transaction.result.details;
                                                details.forEach((elem) => {
                                                    db.query(`SELECT user_id FROM transactions WHERE transaction = '${elem.address}'`, (err, res) => {
                                                        if (err) {
                                                            console.error(err);
                                                        }
                                                        res.forEach((users) => {
                                                            find_socket_by_id(all_clients, users['user_id']).send(JSON.stringify({transaction: transaction.result.details.address}));
                                                        })
                                                    })
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
                            ++last_checked_block;
                            db.query(`UPDATE last_checked_block SET last_block = ${last_checked_block} WHERE currency = '${currency}'`, (err) => {
                                if (err){
                                    console.error(err);
                                }
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                } else {
                    console.log('no new bitcoin blocks');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    static ethereum_check(ethereum_client, currency) {
        let last_checked_block;
        db.query(`SELECT last_block FROM last_checked_block WHERE currency = '${currency}'`, (err, res) => {
            if (err){
                console.error(err);
            }
            last_checked_block = res[0]['last_block'];
        });
        ethereum_client.get_block_number()
            .then((data) => {
                let current_block = parseInt(data.result, 16);
                if (current_block > last_checked_block) {
                    ethereum_client.get_block_by_number('0x' + last_checked_block.toString(16))
                        .then((block) => {
                            block.result.transactions.forEach((element) => {
                                db.query(`SELECT user_id FROM transactions WHERE transaction = '${element.to}'`, (err, res) => {
                                    if (err) {
                                        console.error(err);
                                    }
                                    res.forEach((users) => {
                                        find_socket_by_id(all_clients, users['user_id']).send(JSON.stringify({transaction: element.to}));
                                    })
                                })
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    ++last_checked_block;
                    db.query(`UPDATE last_checked_block SET last_block = ${last_checked_block} WHERE currency = '${currency}'`, (err) => {
                        if (err){
                            console.error(err);
                        }
                    });
                } else {
                    console.log('no new ethereum blocks');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    static ripple_check(ripple_client) {

        /*db.query(`SELECT user_id FROM transactions WHERE transaction = '${transaction.destination.address}'`, (err, res) => {
            if (err) {
                console.error(err);
            }
            res.forEach((users) => {
                find_socket_by_id(all_clients, users['user_id']).send(JSON.stringify({transaction: transaction.destination.address}));
            })
        })*/
    };
};
