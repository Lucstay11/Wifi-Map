const wifi = [
  ["wifi-proximus", "wpa2"],
  ["WIFI-proximus", "wpa2"],
  ["wifi-Proximus", "wpa2"],
  ["WIFI-Proximus", "wpa2"]
];

const string = "Wi-Fi-Proximus";

let isMatch = true;
wifi.forEach((subArray) => {
  const regex = new RegExp(`^${subArray[0]}$`, 'i');
  if (!regex.test(string)) {
    isMatch = false;
  }
});

console.log(isMatch); // true
