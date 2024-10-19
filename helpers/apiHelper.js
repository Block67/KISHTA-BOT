const axios = require('axios');
const { coingeckoApiUrl } = require('../config/config');

async function getHistoricalPrices(crypto) {
    const url = `${coingeckoApiUrl}/coins/${crypto}/market_chart?vs_currency=usd&days=30&interval=daily`;
    const response = await axios.get(url);
    
    const prices = response.data.prices.map(price => price[1]);
    return prices;
}

module.exports = { getHistoricalPrices };
