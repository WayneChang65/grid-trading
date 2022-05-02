'use strict';
const { GridTrading } = require('./lib/grid_trading');

(() => {
    const currentPrice = 410;   // 開單時的現價
    const tradeParam = {
        upperBound: 600,        // 上界限 (天單)
        lowerBound: 300,        // 下界限 (地單)
        numGrid: 10,            // 網格數
        gridType: 0,            // 0:等差, 1:等比 (Not yet)
        b_totalAmount: 7000,    // 投資金額
        tradeFee_percent: 0.05, // 交易手續費
    };

    let gt = new GridTrading(currentPrice, tradeParam);
    gt.trade(460);
    gt.trade(400);
    // ...
})();
