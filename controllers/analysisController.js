const { SMA } = require('technicalindicators');

async function calculateSMA(prices, period = 14) {
    return SMA.calculate({ values: prices, period });
}

module.exports = { calculateSMA };
