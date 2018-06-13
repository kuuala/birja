const db = require('./config').db;
let redis = require('redis');
let pub = redis.createClient();

module.exports = class checker{
    
    static bitcoin_check(bitcoin_client, currency) {
       db.query(`SELECT last_block FROM last_checked_block WHERE currency = '${currency}'`, (error, result) => {
            if (error){
                console.error(error);
            } else {
                let last_checked_block = result[0]['last_block'];
                bitcoin_client.get_block_count()
                    .then((data) => {
                        if (data.result >= last_checked_block) {
                            bitcoin_client.get_block_hash(last_checked_block)
                                .then((hash_block) => {
                                    bitcoin_client.get_block(hash_block.result)
                                        .then((block_info) => {
                                            block_info.result.tx.forEach((element) => {
                                                bitcoin_client.get_raw_transaction(element)
                                                    .then((transaction) => {
                                                        let details = transaction.result.vout;
                                                        let txid = transaction.result.txid;
                                                        details.forEach((elem) => {
                                                            let addresses = elem.scriptPubKey.addresses;
                                                            addresses.forEach((address) => {
                                                                db.query(`SELECT user_id FROM transactions WHERE transaction = '${address}'`, (error, result) => {
                                                                    if (error) {
                                                                        console.error(error);
                                                                    } else {
                                                                        result.forEach((users) => {
                                                                            pub.publish('test_channel', JSON.stringify({id_socket: users['user_id'], transaction: address, txid: txid}));
                                                                        });
                                                                    }
                                                                });
                                                            });
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
                                    db.query(`UPDATE last_checked_block SET last_block = ${last_checked_block} WHERE currency = '${currency}'`, (error) => {
                                        if (error){
                                            console.error(error);
                                        }
                                    });
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    };

    static ethereum_check(ethereum_client, currency) {
        db.query(`SELECT last_block FROM last_checked_block WHERE currency = '${currency}'`, (error, result) => {
            if (error){
                console.error(error);
            } else {
                let last_checked_block = result[0]['last_block'];
                ethereum_client.get_block_number()
                    .then((data) => {
                        let current_block = parseInt(data.result, 16);
                        if (current_block >= last_checked_block) {
                            ethereum_client.get_block_by_number('0x' + last_checked_block.toString(16))
                                .then((block) => {
                                    block.result.transactions.forEach((element) => {
                                        db.query(`SELECT user_id FROM transactions WHERE transaction = '${element.to}'`, (error, result) => {
                                            if (error) {
                                                console.error(error);
                                            } else {
                                                result.forEach((users) => {
                                                    pub.publish('test_channel', JSON.stringify({id_socket: users['user_id'], transaction: element.to, txid: element.hash}));
                                                });
                                            }
                                        });
                                    });
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                            ++last_checked_block;
                            db.query(`UPDATE last_checked_block SET last_block = ${last_checked_block} WHERE currency = '${currency}'`, (error) => {
                                if (error){
                                    console.error(error);
                                }
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    };
};
