const express = require('express')
const app = express()
const weatherAPI = require('./weather-api')

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


const port = 5000

app.get('/search', async (req, res) => {
    const query = req.query.q
    if (query.length < 3) {
        res.status(400).send({error: "query too short"});
        return;
    }
    weatherAPI.search(query).then(response => {
        if ('error' in response) {
            res.status(400).send(response);
        } else {
            res.send(response);
        }
    })
})

app.get('/forecast', async (req, res) => {
    const cityKeys = req.query.cityKeys
    const keys = cityKeys.split(",");
    let results = await weatherAPI.forecast(keys);
    res.send(results);
})

app.listen(port, () => {
    console.log(`listening at http://127.0.0.1:${port}`)
})
