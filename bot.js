require('dotenv').config(); 
const TelegramBot = require('node-telegram-bot-api');
const { telegramToken } = require('./config/config');
const { fetchPrice } = require('./controllers/priceController');
const { calculateSMA } = require('./controllers/analysisController');

const bot = new TelegramBot(telegramToken, { polling: true });

const cryptos = {
    bitcoin: 'bitcoin',
    ethereum: 'ethereum',
    litecoin: 'litecoin',
};


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "Bienvenue sur KISHTA BOT. Choisissez une crypto-monnaie:", {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Bitcoin', callback_data: 'bitcoin' },
                    { text: 'Ethereum', callback_data: 'ethereum' },
                ],
                [
                    { text: 'Litecoin', callback_data: 'litecoin' },
                ],
            ],
        },
    });
});


bot.on('callback_query', async (callbackQuery) => {
    const crypto = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    try {
        const price = await fetchPrice(crypto);
        bot.sendMessage(chatId, `Le prix actuel de ${crypto.toUpperCase()} est de ${price} USD.`);
    } catch (error) {
        bot.sendMessage(chatId, `Erreur lors de la récupération du prix de ${crypto.toUpperCase()}: ${error.message}`);
    }
});


bot.onText(/\/price (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const crypto = match[1].toLowerCase();
    try {
        const price = await fetchPrice(crypto);
        bot.sendMessage(chatId, `Le prix actuel de ${crypto.toUpperCase()} est de ${price} USD.`);
    } catch (error) {
        bot.sendMessage(chatId, `Erreur : ${error.message}`);
    }
});


bot.onText(/\/analyse (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const crypto = match[1].toLowerCase();
    try {

        const prices = await getHistoricalPrices(crypto);
        
        if (prices.length < 14) {
            throw new Error(`Pas assez de données historiques pour calculer la SMA sur ${crypto.toUpperCase()}.`);
        }

        const sma = await calculateSMA(prices, 14);
        bot.sendMessage(chatId, `Moyenne mobile sur 14 jours pour ${crypto.toUpperCase()}: ${sma[sma.length - 1]}`);
    } catch (error) {
        bot.sendMessage(chatId, `Erreur d'analyse : ${error.message}`);
    }
});

