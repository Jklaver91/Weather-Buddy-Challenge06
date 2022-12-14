var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#city");
var citySearchTerm = document.querySelector("#city-search-term");
var cityContainerEl = document.querySelector("#city-container");
var currentTemp = document.getElementById("temperature");
var currentHumidity = document.getElementById("humidity");
var currentWind = document.getElementById("wind");
var currentUV = document.getElementById("UV");
const currentIconEl = document.querySelector("#current-icon");
let search = JSON.parse(localStorage.getItem("search") || "[]");
const searchContainerEl = document.querySelector("#search-container")
const clearButton = document.querySelector("#clear-btn");

var getWeather = function (city) {
  // format the github api url
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8a42d43f7d7dc180da5b1e51890e67dc';


  // make a request to the url
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      tempDisplay(data, city);
      return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=8a42d43f7d7dc180da5b1e51890e67dc`)
    })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      fiveDayDisplay(data, city);
    });
};

var formSubmitHandler = function (event) {
  event.preventDefault();
  // sets inputted citry to var and trims the string
  var city = nameInputEl.value.trim();
  saveSearch(city);
  //input validation
  if (city) {
    getWeather(city);
    nameInputEl.value = "";
  } else {
    alert("Please enter a city!");
  }
};

var tempDisplay = function (data) {
  //formats and sets name and date in current temp
  var currMonthName = moment().format('MMMM');
  citySearchTerm.textContent = data.name + ": " + currMonthName + " " + moment().date() + ", " + moment().year();
  //resets on new search.
  cityContainerEl.replaceChildren();
  //creating elements 
  var currentTemp = document.createElement("h3");
  var currentHumidity = document.createElement("h3");
  var currentWind = document.createElement("h3");
  //sets the path to the current days weather icon
  let icon = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  //writes the HTML for each section.
  currentIconEl.innerHTML = "<img src=" + icon + ">";
  currentTemp.innerHTML = "Temperature: " + k2f(data.main.temp) + " &#176F";
  currentHumidity.innerHTML = "Humidity: " + data.main.humidity + " %";
  currentWind.innerHTML = "Wind Speed: " + data.wind.speed + " MPH";
  //appends data to the container
  document.getElementById("city-container").appendChild(currentIconEl);
  document.getElementById("city-container").appendChild(currentTemp);
  document.getElementById("city-container").appendChild(currentHumidity);
  document.getElementById("city-container").appendChild(currentWind);
};

var fiveDayDisplay = function (data) {
  var container = document.getElementById("cardContainer");
  // resets cards on new search
  container.replaceChildren();
  // creates 5 instances and grabs data for each days array.
  for (let i = 0; i < 5; i++) {
    var dailyTemp = data.daily[i].temp.day
    var dailyHumidity = data.daily[i].humidity
    var dailyWind = data.daily[i].wind_speed

    var card = document.createElement("div");
    var humidity = document.createElement("div");
    var wind = document.createElement("div");
    //sets up card
    card.className = "card text-center mx-3 mt-3";
    card.id = "card" + i;
    //cards data
    card.innerHTML = "Temp:" + k2f(dailyTemp) + " &#176F ";
    humidity.innerHTML = "Humidity: " + dailyHumidity + "%";
    wind.innerHTML = "Wind: " + dailyWind + " mph";
    //appends data
    container.append(card);
    card.append(humidity);
    humidity.append(wind);
  }
};

let saveSearch = function (city) {
    //pushes and saves entry into the array
    search.push(city);
    localStorage.setItem("search", JSON.stringify(search));
    loadStorage();
}

let loadStorage = function () {
  if (search.length > 0) {
    searchContainerEl.innerHTML = " ";
    for (i = 0; i < search.length; i++) {
      //adds searches as buttons to the html.
      let searchBtn = document.createElement("button");
      searchBtn.className = "btn w-100 m-0 mt-2 mb-2 pe-auto";
      searchBtn.textContent = search[i];
      searchContainerEl.appendChild(searchBtn);
    }
  } else {
    searchContainerEl.innerHTML = " ";
  }
}

let clearStorage = function () {
  //empties array.
  search = [];
  localStorage.clear();
  loadStorage();
}

let viewPast = function (event) {
  if (event.target.innerHTML.includes("<")) {
    return;
  } else {
    getWeather(event.target.innerHTML);
  }
}

function k2f(K) {
  //equation to change provided Kelvin to Fahrenheit
  return Math.floor((K - 273.15) * 1.8 + 32);
}

//sets up our buttons.
userFormEl.addEventListener("submit", formSubmitHandler);
clearButton.addEventListener("click", clearStorage);
searchContainerEl.addEventListener("click", viewPast);