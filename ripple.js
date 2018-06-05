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

    

};