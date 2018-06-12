module.exports = class ethereum {
    constructor(client) {
        this.client = client;
    }

    get_block_number() {
        return this.client.request('eth_blockNumber', []);
    }

    get_block_by_number(hash, full_inf = true) {
        return this.client.request('eth_getBlockByNumber', [hash, full_inf]);
    }
};