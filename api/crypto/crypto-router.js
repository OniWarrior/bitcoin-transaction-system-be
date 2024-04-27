
const router = require('express').Router()
const axios = require('axios');

router.get('/api/crypto/latest', async (req, res) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
            },
        });
        const bitcoinData = response.data.data.find(crypto => crypto.symbol === 'BTC');
        const bitcoinPrice = bitcoinData ? bitcoinData.quote.USD.price : null;

        if (bitcoinPrice) {
            res.status(200).json({ price: bitcoinPrice });
        } else {
            res.status(404).send('Bitcoin data not found');
        }
    } catch (error) {

        res.status(500).send(`Server Error: ${error.message}`);
    }
});

module.exports = router