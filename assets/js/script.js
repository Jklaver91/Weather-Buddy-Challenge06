var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#city");
var citySearchTerm = document.querySelector("#city-search-term");
var cityContainerEl = document.querySelector("#city-container");
var currentTemp = document.getElementById("temperature");
var currentHumidity = document.getElementById("humidity");
var currentWind = document.getElementById("wind");
var currentUV = document.getElementById("UV");
const currentIconEl = document.querySelector("#current-icon");

var getWeather = function (city) {
  // format the github api url
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8a42d43f7d7dc180da5b1e51890e67dc';


  // make a request to the url
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      tempDisplay(data, city);
      return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=8a42d43f7d7dc180da5b1e51890e67dc`)
    })
    .then(function (res) {
      // currentHeadingEl.innerHTML = data[0].name + " (" + moment().format("M/D/YYYY") + ") ";
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      fiveDayDisplay(data, city);
      console.log(data.daily[0].temp.day);
    });
};

var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value from input element
  var city = nameInputEl.value.trim();
  saveSearches();
  //localStorage.setItem("city", JSON.stringify(city));
  document.getElementById("search").classList.remove("d-none");
  document.getElementById("search").innerHTML = city;
  //localStorage.getItem(city);
  if (city) {
    getWeather(city);
    nameInputEl.value = "";
  } else {
    alert("Please enter a city!");
  }
};

var tempDisplay = function (data) {
  var currMonthName  = moment().format('MMMM');
  citySearchTerm.textContent = data.name + ": " + currMonthName + " " + moment().date() + ", " + moment().year() ;
  console.log(data.main.temp);
  cityContainerEl.replaceChildren();
  var currentTemp = document.createElement("h3");
  var currentHumidity = document.createElement("h3");
  var currentWind = document.createElement("h3");
  let iconLink = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  
  window.setInterval(function () {
    $('#currentDay').html(moment().format('ddd MM/DD H:mm:ss'))
  }, 1000);


  currentIconEl.innerHTML = "<img src=" + iconLink + ">";
  currentTemp.innerHTML = "Temperature: " + k2f(data.main.temp) + " &#176F";
  currentHumidity.innerHTML = "Humidity: " + data.main.humidity + " %";
  currentWind.innerHTML = "Wind Speed: " + data.wind.speed + " MPH";

  document.getElementById("city-container").appendChild(currentIconEl);
  document.getElementById("city-container").appendChild(currentTemp);
  document.getElementById("city-container").appendChild(currentHumidity);
  document.getElementById("city-container").appendChild(currentWind);
};

var fiveDayDisplay = function (data) {
  var container = document.getElementById("cardContainer");
  container.replaceChildren();
  for (let i = 0; i < 5; i++) {
    var dailyTemp = data.daily[i].temp.day
    var dailyHumidity = data.daily[i].humidity
    var dailyWind = data.daily[i].wind_speed

    var el = document.createElement("div");
    var humidity = document.createElement("div");
    var wind = document.createElement("div");
    var icon = document.createElement("div");
    el.className = "card text-center mx-3 mt-3";
    el.id = "card" + i;
    el.innerHTML = "Temp:" + k2f(dailyTemp) + " &#176F ";
    humidity.innerHTML = "Humidity: " + dailyHumidity + "%";
    wind.innerHTML = "Wind: " + dailyWind + " mph";
    container.append(el);
    el.append(humidity);
    humidity.append(wind);
  }
};

var saveSearches = function() {
  for (let i = 0; i < 5; i++) {
    localStorage.setItem('city' + i, city) ;
  }
}

function k2f(K) {
  return Math.floor((K - 273.15) * 1.8 + 32);
}

var searchbuttonOne = function () {
  //window.location.reload();
  var city = localStorage.getItem(city);
  getWeather(city);
}

userFormEl.addEventListener("submit", formSubmitHandler);
document.getElementById("search").addEventListener("click", searchbuttonOne);