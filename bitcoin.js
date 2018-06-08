module.exports = class bitcoin {
    constructor(client) {
        this.client = client;
    }

    get_block_count() {
        return this.client.request('getblockcount', []);
    }

    get_block_hash(id_block) {
        return this.client.request('getblockhash', [id_block]);
    }

    get_block(hash) {
        return this.client.request('getblock', [hash]);
    }

    get_transaction(element) {
        return this.client.request('gettransaction', [element]);
    }

    import_address(address) {
        return this.client.request('importaddress', [address]);
    }
};