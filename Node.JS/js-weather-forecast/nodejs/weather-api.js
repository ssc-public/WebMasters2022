const fetch = require('node-fetch')
const redis = require("redis")
const redisClient = redis.createClient({host: "172.17.0.1", port: 6379, db: 0});

const weatherStatus = {
    0: "clear sky",
    1: "mainly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "fog",
    48: "depositing rime fog",
    51: "light drizzle",
    53: "moderate drizzle",
    55: "dense drizzle",
    56: "light freezing drizzle",
    57: "dense freezing drizzle",
    61: "slight rain",
    63: "moderate rain",
    65: "heavy rain",
    66: "light freezing rain",
    67: "heavy freezing rain",
    71: "slight snow fall",
    73: "moderate snow fall",
    75: "heavy snow fall",
    77: "snow grains",
    80: "slight rain showers",
    81: "moderate rain showers",
    82: "violent rain showers",
    85: "slight snow showers",
    86: "heavy snow showers",
    95: "thunderstorm",
    96: "thunderstorm with slight hail",
    99: "thunderstorm with heavy hail",
}

exports.search = function (query) {
    return fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`
    ).catch(err => {
            console.log(err)
            return {error: "couldn't resolve search results"};
        }
    ).then(response => response.json()
    ).catch(function (err) {
        console.log(err)
        return {error: "couldn't resolve search results"};
    }).then(function (data) {
        if ('error' in data) return data;
        let results = [];
        let limitCounter = 0;
        for (const element of data.results) {
            results.push({
                key: element.latitude + '|' + element.longitude,
                country: element.country,
                name: element.name,
            });
            redisClient.set(element.latitude + '|' + element.longitude, element.name);
            limitCounter++;
            if (limitCounter === 10) break;
        }
        return results;
    }).catch(function (err) {
        console.log(err)
        return {error: "couldn't resolve search results"};
    });
};
exports.forecast = async function (cityKeys) {
    if (!cityKeys) return
    let cityData = [];
    for (const cityKey of cityKeys) {
        let [latitude, longitude] = cityKey.split("|");
        latitude = (+latitude).toFixed(4);
        longitude = (+longitude).toFixed(4);
        let name;
        await redisClient.get(cityKey, function (err, cached) {
            if (err) throw err;
            name = cached;
        });
        cityData.push(
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode`
            ).catch(err => console.log(err)
            ).then(response => response.json()
            ).catch(err => console.log(err)
            ).then(function (response) {
                let forecast = {
                    name: name,
                    forecasts: []
                }
                if (response) {
                    let currentDate = new Date().toISOString();
                    let limitCounter = 0;
                    for (const i in response.hourly.time) {
                        if (response.hourly.time[i] < currentDate) continue;
                        forecast.forecasts.push({
                            time: response.hourly.time[i],
                            temperature: response.hourly.temperature_2m[i],
                            status: weatherStatus[response.hourly.weathercode[i]],
                        })
                        limitCounter++;
                        if (limitCounter === 13) break;
                    }
                }
                return forecast;
            }).catch(err => {
                console.log(err)
                return {
                    name: name,
                    forecasts: []
                }
            }))
    }
    return Promise.all(cityData);
};
