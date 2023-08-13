fetch(`https://api.wigle.net//api/v2/stats/regions?country=BE`)
        .then(response => response.json())
        .then(data => {
            console.log(data.regions.length)
        })
