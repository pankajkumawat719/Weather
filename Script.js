const userTab = document.querySelector(["[data-userWeather]"]);
const searchTab = document.querySelector(["[data-searchWeather]"]);
const userContainet = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoCOntainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");

// API key
const API_KEY = "ea8779a2086f2818897ce21d7e132421";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab) {
  if (clickedTab !== currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoCOntainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoCOntainer.classList.remove("active");
      getFromSessionStorage();
    }
  }
}

// Event When click on user tab
userTab.addEventListener("click", () => {
  // pass click tab as input parameter
  switchTab(userTab);
});

// Event When click on user tab
searchTab.addEventListener("click", () => {
  // pass click tab as input parameter
  switchTab(searchTab);
});

// check coordinates are already present in session storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    // local Coordinates are not available
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // make grantcontainer invisible
  grantAccessContainer.classList.remove("active");
  // make loader visible
  loadingScreen.classList.add("active");

  // API call

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoCOntainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  // fetch the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDiscription]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudNess]");

  // fetch weather info from object and putin into UI

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = weatherInfo?.main?.temp;
  windspeed.innertext = weatherInfo?.wind?.speed;
  humidity.innertext = weatherInfo?.main?.humidity;
  cloudiness.innerText = weatherInfo?.clouds?.all;
}

function getLocation() {
  if (navigator.geolocation) {
    // location is suported
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    window.alert("Geolocation is not Supported");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem(user - coordinates, JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}
grantAccessButton.addEventListener("click", getLocation);

// searchForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   if (searchInput.value === "") {
//     return;
//   } else {
//     fetchSearchWeatherInfo(searchInput.value);
//   }
// });
// async function fetchSearchWeatherInfo()

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoCOntainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoCOntainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    //hW
    err.alert("error aayi hai ");
  }
}
