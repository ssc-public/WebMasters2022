const prefix = "http://localhost:8090/api"
const forecastButton = $('#forecast-btn');
const selectedCities = new Set();
const select = $('select');
select.selectpicker();
const liveSearchInput = $('input[type=search]');
liveSearchInput.on("input", function () {
    let query = $(this).val();
    if (query.length < 3) return;
    fetch(`${prefix}/search?q=${query}`
    ).then(response => response.json()
    ).then(function (data) {
        select.find('option').each(function () {
            let cityKey = $(this).val();
            if (!$(this).is(':selected')) {
                if (selectedCities.has(cityKey)) {
                    selectedCities.delete(cityKey);
                }
                $(this).remove();
            } else if (!selectedCities.has(cityKey)) {
                selectedCities.add(cityKey);
            }
        });
        for (const element of data) {
            if (!selectedCities.has(element.key)) {
                select.append(`<option data-subtext=${element.country} value=${element.key}>${element.name}</option>`);
            }
        }
        select.selectpicker('refresh');
    }).catch(function () {
        select.selectpicker('refresh');
        console.log("couldn't retrieve city list!");
    });
});
forecastButton.on("click", function () {
    let cityData = []
    let chart = new CanvasJS.Chart("chart-container", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
            text: "12 Hours Weather Chart"
        },
        axisY: {
            title: "Temperature (Celsius)"
        },
        toolTip: {
            shared: true,
            contentFormatter: function (data) {
                let content = `<b>Time:</b> ${data.entries[0].dataPoint.label}<br/>`;
                for (let i = 0; i < data.entries.length; i++) {
                    content += (`<b style='color: ${data.entries[i].dataSeries.color};'>` +
                        `${data.entries[i].dataSeries.name}</b><br/><b>Temperature:</b> ` +
                        `${data.entries[i].dataPoint.y} Celsius<br/><b>Weather:</b> ` +
                        `${data.entries[i].dataPoint.weatherStatus}`);
                    content += `<br/>`;
                }
                return content;
            }
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: cityData
    });
    fetch(`${prefix}/forecast?cityKeys=${select.val()}`
    ).then(response => response.json()
    ).then(response => {
        for (const halfDayForecast of response) {
            cityData.push({
                type: "spline",
                name: halfDayForecast.name,
                showInLegend: true,
                dataPoints: []
            })
            for (const hourlyForecast of halfDayForecast.forecasts) {
                cityData[cityData.length - 1].dataPoints.push({
                    label: hourlyForecast.time.slice(11, 16),
                    y: hourlyForecast.temperature,
                    weatherStatus: hourlyForecast.status,
                })
            }
        }
        chart.render();
    });

    function toggleDataSeries(e) {
        e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible);
        chart.render();
    }
});
