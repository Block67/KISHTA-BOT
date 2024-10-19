const axios = require('axios');
const { coingeckoApiUrl } = require('../config/config');

async function fetchPrice(crypto) {
    const url = `${coingeckoApiUrl}/simple/price?ids=${crypto}&vs_currencies=usd`;
    const response = await axios.get(url);
    
    if (response.data[crypto]) {
        return response.data[crypto].usd;
    } else {
        throw new Error(`Crypto ${crypto} non trouvée.`);
    }
}

module.exports = { fetchPrice };
