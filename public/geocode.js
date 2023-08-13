
fetch("https://api.wigle.net//api/v2/stats/site")
.then(r=>r.json())
.then(data=> nb_total_wifi_api.textContent= data.nettotal.toLocaleString())


function displayboxregion(country, index, size) {
    let timeoutId; // Variable pour stocker l'identifiant du timeout
    clearTimeout(timeoutId);
    document.querySelectorAll(".boxregion").forEach(box => box.innerHTML="")
    if (document.querySelector(`#boxcountryregion${size}`).textContent.trim().length == 0) {
        fetch(`https://api.wigle.net//api/v2/stats/regions?country=${country}`)
            .then(response => response.json())
            .then(data => {
                var nbtotal = data.regions.length;
                document.querySelector(`#boxcountryregion${index}`).innerHTML += `<div class="card-header"><h5>Region and Postal code</h5></div>`;

                const batchSize = 10;
                let currentBatch = 0;

                function displayNextBatch() {
                    const boxRegion = document.querySelector(`#boxcountryregion${index}`);
                    const start = currentBatch * batchSize;
                    const end = Math.min(start + batchSize, nbtotal);

                    for (let i = start; i < end; i++) {
                        boxRegion.innerHTML += `
                            <div class="card-header text-dark">
                                <h8 class="mb-0">
                                    ${data.regions[i].region} : ${data.regions[i].wifiCount.toLocaleString()}
                                </h8>
                            </div>
                        `;
                    }

                    currentBatch++;

                    if (currentBatch * batchSize < nbtotal) {
                        timeoutId = setTimeout(displayNextBatch, 2000);
                    } else {
                        displayPostalCodes();
                    }
                }

                function displayPostalCodes() {
                    const boxRegion = document.querySelector(`#boxcountryregion${index}`);
                    const nbtotalPostal = data.postalCode.length;

                    for (let i = 0; i < nbtotalPostal; i++) {
                        boxRegion.innerHTML += `
                            <div class="card-header text-dark">
                                <h8>
                                    ${data.postalCode[i].postalCode} : ${data.postalCode[i].wifiCount.toLocaleString()}
                                </h8>
                            </div>
                        `;
                    }
                }

                displayNextBatch();
            })
    }
}

function displayboxcountry(){
    if(accordion.textContent.trim()==""){
fetch("https://api.wigle.net//api/v2/stats/countries")
    .then(response => response.json())
    .then(data => {
        const accordion = document.getElementById('accordion');
        data.countries.forEach((d, i) => {
            const country = d.country;
            accordion.innerHTML += `
                <div class="card" data-country="${country}" data-id="${i}" onclick="displayboxregion(this.dataset.country,this.dataset.id,${i});">
                    <div class="card-header bg-gradient-success text-white" id="heading${i}">
                        <h5 class="mb-0">
                            <h8 data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                                ${country} : ${d.wifiCount.toLocaleString()}
                            </h8>
                        </h5>
                    </div>
                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordion">
                        <div class="card-body boxregion" id="boxcountryregion${i}" style="overflow: auto;height: 400px;">
                        </div>
                    </div>
                </div>
            `;
        });
    })
  }
}
