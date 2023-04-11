const Api_Key = "bb4a1b568b127289c6d9c3faa7e36c69";

let data = {
  city: "",
  current: {},
  forecast: [],
};

let history = [];
let err;
let cityName;

//
const getDate = (date) => {
  const newdate = new Date(date * 1000);
  return `${
    newdate.getMonth() + 1
  }/${newdate.getDate()}/${newdate.getFullYear()}`;
};

function getWeather(city) {
  let lat;
  let lon;

  const query1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_Key}&units=metric`; //current

  fetch(query1)
    .then((res) => res.json())
    .then((res) => {
      if (!res) {
        return null;
      }

      lat = res.coord.lat;
      lon = res.coord.lon;
      // console.log(lat);
      // console.log(lon);
      data.current.temp = res.main.temp;
      data.current.humidity = res.main.humidity;
      data.current.wind = res.wind.speed;
      cityName = res.name;

      const query2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${Api_Key}&units=metric`; //5 days 3 hourly forecast
      fetch(query2)
        .then((res) => res.json())
        .then((res) => {
          // data.forecast.length = 0
          console.log(data);
          console.log(res.list[0].weather);
          console.log(res.list[0]);
          data.current.icon = res.list[0].weather[0].icon;
          data.current.date = getDate(res.list[0].dt);

          data.forecast = [];
          for (let i = 0; i < 40; i = i + 8) {
            let day = {
              date: getDate(res.list[i].dt),
              temp: res.list[i].main.temp,
              icon: res.list[i].weather[0].icon,
              wind: res.list[i].wind.speed,
              humidity: res.list[i].main.humidity,
            };
            data.forecast.push(day);
            // console.log(day);
            // return data
          }
          // return data

          const record = { ...data, city: cityName };
          history.push(record);
          showWeather(record);
          displayHistory(record.city);
          saveSearchedData(history);
          // document.querySelectorAll('.search-entry').forEach((entry) => entry.addEventListener('click', historyBtn))
        })
        .catch((error) => {
          console.log("Error", error);
          return; //res.json()
        });
    })
    .catch((error) => {
      console.log("Error", error);
      return; //res.json()
    });
}

const showWeather = (weatherData) => {
  const currentWeather = document.getElementById("current-weather");
  currentWeather.innerHTML = `
    <div class="card-body">
        <h2 class="d-inline-block mr-3">${weatherData.city} ${weatherData.current.date}</h2>
        <img class="d-inline-block" src=" http://openweathermap.org/img/wn/${weatherData.current.icon}@2x.png" alt="weather icon"></img>
        <p>Temperature: ${weatherData.current.temp} &#8451;</p>
        <p>Humidity: ${weatherData.current.humidity} %</p>
        <p>Wind Speed: ${weatherData.current.wind} km/h</p>
    </div>`;

  const fiveDayForecast = document.getElementById("five-day-forecast");
  fiveDayForecast.innerHTML = ``;
  weatherData.forecast.forEach((day) => {
    fiveDayForecast.innerHTML += `
        <div class="col-lg">
            <div class="d-flex flex-row bg-light">
                <p class="d-inline m-1 b-1 text-center h5">${day.date}</p>
                <div class="text-center d-inline mb-0 mx-1">
                    <img class="d-inline-block" src=" http://openweathermap.org/img/wn/${day.icon}@2x.png" alt="weather icon">
                    <p>Temp: ${day.temp} &#8451;</p>
                    <p>Humidity: ${day.humidity} %<p>
                    <p>Wind: ${day.wind} km/h</p>
                </div>
            </div>
        </div>`;
  });
};

//show history
const displayHistory = (cityName) => {
  const searchHistory = document.getElementById("search-history");
  searchHistory.innerHTML += `
    <li class="list-group-item p-0">
        <button class="search-entry w-100 h100 btn btn-default" data-city-name = ${cityName}>${cityName}</button>
    </li>`;
};

function saveSearchedData(history) {
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

// const historyBtn = (event) => {
//     const historyCity = event.target.getAttribute('data-city-name')
//     history.forEach((record) => {
//         if(record === historyCity) {
//             showWeather(record)
//         }
//     })
// }

function init() {
  const receive = localStorage.getItem("searchHistory");
  if (receive) {
    history = JSON.parse(receive);
    history.forEach((record) => {
      displayHistory(record.city);
    });
    showWeather(history[history.length - 1]);
  }
}

const checkBad = (data) => {
  if (!data) {
    document.getElementById(
      "error"
    ).innerHTML = `Error, please type in a valid city name`;
    return true;
  } else {
    return false;
  }
};

function submitSearch(event) {
  event.preventDefault();
  const city = document
    .getElementById("city-input")
    .value.trim()
    .replace(/\s+/g, " ");

  console.log(city);

  let render = {};
  render = getWeather(city);
  console.log(render);
  // if(checkBad(!render)){
  //     return
  // }else{
  //     const record = {...data, city: cityName}
  //     history.push(record)
  //     showWeather(record)
  //     displayHistory(record.city)
  //     saveSearchedData(history)
  //     document.querySelectorAll('.search-entry').forEach((entry) => entry.addEventListener('click', historyBtn))
  // }
}

init();

document.getElementById("search-city").addEventListener("submit", submitSearch);
// document.querySelectorAll('.search-entry').forEach((entry) => entry.addEventListener('click', historyBtn))

const searchHistory = document.getElementById("search-history");

searchHistory.addEventListener("click", (event) => {
  if (event.target.classList.contains("search-entry")) {
    const historyCity = event.target.getAttribute("data-city-name");
    history.forEach((record) => {
      if (record.city === historyCity) {
        showWeather(record);
      }
    });
  }
});
