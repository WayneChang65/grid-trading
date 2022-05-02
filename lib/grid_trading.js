'use strict';

// a-Coin / b-Coin
// e.g. ETH/USDT, BTC/USDT, ETH/BTC,...
const TRADE_TYPE_BUY = -1;
const TRADE_TYPE_SELL = 1;
//const GRID_TYPE_ARITHMETIC = 0; // 等差
//const GRID_TYPE_GEOMETRIC = 1;  // 等比(Not yet)

class GridTrading {
    constructor(currentPrice, tradeParam) {
        this.grid = [];
        this.currentPrice = currentPrice;
        this.tradeParam = tradeParam;
        this.wallet = {
            b_amount: 0,
            a_amount: 0,
            profit: 0,
            tradeFee: 0,
        };

        // 網眼設置
        this.gridMesh =
            (this.tradeParam.upperBound - this.tradeParam.lowerBound) /
            this.tradeParam.numGrid;
        let buyOrSell = TRADE_TYPE_BUY;
        for (let i = 0; i <= this.tradeParam.numGrid; i++) {
            let price =
                (this.tradeParam.lowerBound + this.gridMesh * i) * buyOrSell;

            // 離現價最近的那張單略過，這樣單的總數才會正確
            if (
                Math.abs(Math.abs(price) - this.currentPrice) >
                this.gridMesh / 2
            ) {
                this.grid.push({
                    price: price,
                    b_amountTotal:
                        this.tradeParam.b_totalAmount / this.tradeParam.numGrid,
                });
            } else {
                buyOrSell = TRADE_TYPE_SELL;
            }
        }

        // 計算收益比例以及可購買的 a-coin 數量
        for (let g of this.grid) {
            if (g.price > 0) {
                // 賣單
                g.a_amount =
                    (g.b_amountTotal *
                        (1 - this.tradeParam.tradeFee_percent / 100)) /
                    this.currentPrice;
                g.a_holdingCost = this.currentPrice;
                g.b_amount = g.price * g.a_amount;
                g.profit = g.b_amount - g.b_amountTotal;
                g.profit_percent = (g.profit / g.b_amountTotal) * 100;
            } else {
                // 買單
                g.a_amount =
                    (g.b_amountTotal *
                        (1 - this.tradeParam.tradeFee_percent / 100)) /
                    Math.abs(g.price);
                g.a_holdingCost = Math.abs(g.price);
                g.profit = 0;
                g.profit_percent = 0;
            }
        }

        for (let g of this.grid) {
            this.wallet.b_amount += g.price < 0 ? g.b_amountTotal : 0;
            this.wallet.a_amount += g.price > 0 ? g.a_amount : 0;
        }

        // 因為價差(等差)都一樣，所以，越低價位相對利潤比例是高的
        let highProfit_percent =
            (this.gridMesh / Math.abs(this.grid[0].price)) * 100 -
            this.tradeParam.tradeFee_percent;
        let lowProfit_percent =
            (this.gridMesh / Math.abs(this.grid[this.grid.length - 1].price)) *
                100 -
            this.tradeParam.tradeFee_percent;
        this.showGrids();
        this.showWallet();
        console.log(lowProfit_percent, '% - ', highProfit_percent, '%');
    }

    // 反著顯示，比較像一些看到網格的習慣
    showGrids() {
        console.log('Number of grid: ', this.tradeParam.numGrid, 'grids');
        for (let i = this.grid.length - 1; i >= 0; i--) {
            console.log(this.grid[i]);
        }
        console.log('Grid Mesh: ', this.gridMesh);
    }

    showWallet() {
        console.log('Wallet: ', this.wallet);
    }

    trade(currentPrice) {
        // 交易開始，現價進來，開始確認價格落點，並判斷是否進行交易
        for (let g of this.grid) {
            if (g.price >= 0) {
                // 賣單
                if (currentPrice >= g.price) {
                    this.wallet.profit += g.profit;
                    this.wallet.a_amount -= g.a_amount;
                    this.wallet.b_amount += g.b_amount - g.profit;

                    // 下方掛 買單
                    g.price = (g.price - this.gridMesh) * TRADE_TYPE_BUY;
                    g.a_amount =
                        (g.b_amountTotal *
                            (1 - this.tradeParam.tradeFee_percent / 100)) /
                        Math.abs(g.price);

                    g.a_holdingCost = Math.abs(g.price);
                    g.b_amount = 0;
                    g.profit = 0;
                    g.profit_percent = 0;
                }
            } else {
                // 買單
                if (currentPrice <= Math.abs(g.price)) {
                    this.wallet.a_amount += g.a_amount;
                    this.wallet.b_amount -= g.b_amountTotal;

                    // 上方掛 賣單
                    g.price =
                        (Math.abs(g.price) + this.gridMesh) * TRADE_TYPE_SELL;
                    g.a_amount =
                        (g.b_amountTotal *
                            (1 - this.tradeParam.tradeFee_percent / 100)) /
                        g.price;
                    g.a_holdingCost = g.price;
                    g.b_amount = (g.price + this.gridMesh) * g.a_amount;
                    g.profit = g.b_amount - g.b_amountTotal;
                    g.profit_percent = (g.profit / g.b_amountTotal) * 100;
                }
            }
        }
        this.showGrids();
        this.showWallet();
    }
}

module.exports.GridTrading = GridTrading;
