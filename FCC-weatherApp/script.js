var api = "https://fcc-weather-api.glitch.me/api/current?";
var tempInC;
var tempUnit = "C";


(function weatherApp (){
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lon = "lon=" + position.coords.longitude;
      var lat = "lat=" + position.coords.latitude;
      getWeather(lon, lat);
      document.getElementById("tempUnit").addEventListener("click", changeTempUnit);
    })
  } else {
    console.log("geolocation is NOT available");
  }
})();


function getWeather(lon, lat){
  var request = new XMLHttpRequest();
  var url = api + lon + "&" + lat;
  request.open("GET", url, true);
  request.send();
  request.onload = function(){
    var result = JSON.parse(this.responseText);

    var resultObject = {
      city: result.name + ", ",
      country: result.sys.country,
      weather: result.weather[0].main,
      temp: Math.round(result.main.temp * 10) / 10 + " ",
      tempUnit: String.fromCharCode(176) + tempUnit
    };

    window.resultObject = resultObject;
    tempInC = Math.round(result.main.temp * 10) / 10;
    var icon = result.weather[0].icon;

    displayIcon(icon);
    displayObject(resultObject);
    changeBackgroundColor(resultObject.temp);
  }
};

function displayObject(resultObject) {
  for (var key in resultObject) {
    var obj = resultObject[key];
    if (resultObject.hasOwnProperty(key)) {
      var string = JSON.stringify(obj).replace(/\"/g, "");
      console.log(document.getElementById(key));
      document.getElementById(key).textContent = string;
    }
  }
}

function displayIcon(icon) {
  document.getElementById("weatherIcon").src = icon;
}

function changeBackgroundColor(temp) {
  var body = document.querySelector("body");
  if (temp > 30) {
    body.style.backgroundColor = "#c94c4c";
  } else if (temp > 25) {
    body.style.backgroundColor = "#f7cac9";
  } else if (temp > 20) {
    body.style.backgroundColor = "#d5f4e6";
  } else if (temp > 10) {
    body.style.backgroundColor = "#80ced6";
  } else {
    body.style.backgroundColor = "#deeaee";
  }
}



function changeTempUnit() {
  var temp = tempInC;
  var fahrenheit;
  if (tempUnit === "C") {
    tempUnit = "F";
    fahrenheit = temp * 9 / 5 + 35;
    document.getElementById("temp").textContent = Math.round(fahrenheit * 10) / 10 + " ";
    document.getElementById("tempUnit").textContent = String.fromCharCode(176) + tempUnit;
  } else {
    tempUnit = "C";
    document.getElementById("temp").textContent = temp;
    document.getElementById("tempUnit").textContent = String.fromCharCode(176) + tempUnit;
  }
}
