const result = document.getElementById("result");
const form = document.getElementById("getWeather");
const nameCity = document.getElementById("city");
const select = document.getElementById("country");

const apiId = "0b5ef3dc4b424b3cb6b0bb6dc52b73ea";

// Lista de países opcional (para el <select>)
const countries = [
  "", "Afghanistan", "Argentina", "Australia", "Brazil", "Canada", "Chile",
  "China", "Colombia", "Costa Rica", "Cuba", "Ecuador", "Egypt", "España",
  "France", "Germany", "India", "Italy", "Japan", "Mexico", "Morocco",
  "Netherlands", "Peru", "Philippines", "Portugal", "Russia", "South Africa",
  "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey",
  "Ukraine", "United Kingdom", "United States", "Uruguay", "Venezuela"
];

countries.forEach((allCountry) => {
  const option = document.createElement("option");
  option.value = allCountry;
  option.textContent = allCountry;
  select.appendChild(option);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = nameCity.value.trim();
  const country = select.value.trim();

  if (city === "" && country === "") {
    return showError("Por favor, ingresa una ubicación o selecciona un país");
  }

  try {
    await getCoordinates(city, country);
  } catch (error) {
    showError("No se pudo obtener la información del clima");
    console.error(error);
  }
});

// 🔍 Obtener coordenadas (permite cualquier lugar del mundo)
async function getCoordinates(city, country) {
  const query = [city, country].filter(Boolean).join(",");
  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiId}`;

  const res = await fetch(geoURL);
  const data = await res.json();

  if (!data || data.length === 0) {
    return showError("Ubicación no encontrada. Intenta con otro nombre.");
  }

  const { lat, lon, name, country: countryCode, state } = data[0];
  callAPI(lat, lon, name, state, countryCode);
}

// 🌤 Obtener clima actual con coordenadas
async function callAPI(lat, lon, name, state, countryCode) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiId}&units=metric&lang=es`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.cod !== 200) {
    return showError("Error al obtener el clima");
  }

  showWeather(data, name, state, countryCode);
}

// 🌈 Mostrar datos del clima
function showWeather(data, name, state, countryCode) {
  const {
    main: { temp, temp_max, temp_min },
    weather: [arr],
  } = data;

  // Referencias a los elementos
  const cityName = document.getElementById("cityName");
  const cityImg = document.getElementById("cityImg");
  const cityTemp = document.getElementById("cityTemp");
  const cityMaxTemp = document.getElementById("cityMaxTemp");
  const cityMinTemp = document.getElementById("cityMinTemp");

  // Mostrar ubicación
  cityName.textContent = `Clima de ${name}${state ? ", " + state : ""} (${countryCode})`;

  // Mostrar ícono del clima ☀️⛅🌧️
  cityImg.src = `https://openweathermap.org/img/wn/${arr.icon}@2x.png`;
  cityImg.alt = arr.description;
  cityImg.classList.add("city-img"); // asegúrate que tu CSS tenga esta clase

  // Mostrar temperaturas
  cityTemp.textContent = `${Math.round(temp)}°C`;
  cityMaxTemp.textContent = `Max: ${Math.round(temp_max)}°C`;
  cityMinTemp.textContent = `Min: ${Math.round(temp_min)}°C`;

  // Limpiar clases previas
  [cityTemp, cityMaxTemp, cityMinTemp].forEach(el => {
    el.classList.remove("color-blue", "color-warm", "color-yellow");
  });

  // Aplicar color dinámico
  if (temp <= 15) {
    [cityTemp, cityMaxTemp, cityMinTemp].forEach(el => el.classList.add("color-blue"));
  } else if (temp >= 30) {
    [cityTemp, cityMaxTemp, cityMinTemp].forEach(el => el.classList.add("color-warm"));
  } else {
    [cityTemp, cityMaxTemp, cityMinTemp].forEach(el => el.classList.add("color-yellow"));
  }
}

// ⚠ Mostrar errores
function showError(message) {
  const alert = document.createElement("p");
  alert.classList.add("alert-message");
  alert.innerText = message;
  form.appendChild(alert);

  setTimeout(() => alert.remove(), 2000);
}
