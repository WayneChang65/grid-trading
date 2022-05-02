# grid-trading

grid-trading 是一個網格交易演算法的簡單實作。(只有演算法，沒有使用任何第三方函式庫)  

grid-trading is a simple implementation of grid trading method.(Algorithm only without any dependencies)  

## 如何跑範例程式？ (How to run the example ?)  

* 從Github下載grid-trading專案程式碼。  
Clone grid-trading from GitHub

```bash
git clone https://github.com/WayneChang65/grid-trading.git
```

* 進入grid-trading專案目錄  
Get into grid-trading directory

```bash
cd grid-trading
```

* 直接透過 node.js 執行。  
Run it with node.js.  

```bash
node main.js
```

## 如何使用本演算法？ (How to us it ?)  

* constructor(currentPrice, tradeParam), 類別建構式，建立一個網格交易單  
 * currentPrice: 開單的現價  
 * tradeParam: 網格參數  

* trade(currentPrice), 交易函式，只要把目前現價持續輸入，程式自動判斷是否進行買賣交易  
 * currentPrice: 現價，持續輸入  

* showProfitPercent(), 顯示網格單的利潤範圍  

* showGrids(), 顯示網格單內容  

* showWallet(), 顯示目前網格單內的a-coin, b-coin 以及利潤狀態 (交易對為 a-coin/b-coin)  