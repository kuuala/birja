const RippleAPI = require('ripple-lib').RippleAPI;

module.exports = class ripple {
    //address: rwZXVGE5AgR3CDFc5sxGjokFm2VcPS7XVN
    //secret: snZtw7WXeGTDAyuvu1qcR9GfxcT9h
    //balance: 10,000 XRP
    constructor(client) {
        this.client = new RippleAPI({
            server: client
        });
    }

    connect(){
        return this.client.connect();
    }

    ledger_version() {
        return this.client.getLedgerVersion();
    }

    get_ledger(optional_object) {
        return this.client.getLedger(optional_object);
    }

    get_transactions(id, options = null) {
        return this.client.getTransaction(id, options);
    }
};