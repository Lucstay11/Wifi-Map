const url = 'https://api.wigle.net/api/v2/stats/countries';
const username = 'AID29fc21c646b4104e1cada5b468dc0aeb';
const password = '5d9590ecc1c1cbdc5d4447670f4b64fe';

const headers = {
  'Accept': 'application/json',
  'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
};

fetch(url, { method: 'GET', headers })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
