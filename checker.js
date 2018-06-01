const db = require('./config').db;
db.connect(function(err) {
    if (err) {
        throw err;
    }
});

module.exports = class checker{
    static bitcoin_check(bitcoin_client, currency) {
        let last_checked_block;
        db.query(`SELECT last_block FROM last_checked_block WHERE currency = '${currency}'`, (err, res) => {
            if (err){
                throw err;
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
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    });
                                });
                            ++last_checked_block;
                            db.query(`UPDATE last_checked_block SET last_block = ${last_checked_block} WHERE currency = '${currency}'`, (err) => {
                                if (err){
                                    throw err;
                                }
                            });
                        });
                } else {
                    console.log('no new bitcoin blocks');
                }
            });
    };

    static ethereum_check(ethereum_client, currency) {
        let last_checked_block;
        db.query(`SELECT last_block FROM last_checked_block WHERE currency = '${currency}'`, (err, res) => {
            if (err){
                throw err;
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
                                console.log(element.to)
                            });
                        });
                    ++last_checked_block;
                    db.query(`UPDATE last_checked_block SET last_block = ${last_checked_block} WHERE currency = '${currency}'`, (err) => {
                        if (err){
                            throw err;
                        }
                    });
                } else {
                    console.log('no new ethereum blocks');
                }
            });
    };

    static ripple_check(ripple_client) {
        // in progress
    };
};
