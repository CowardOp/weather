const result = document.getElementById("result");
const form = document.getElementById("getWeather");
const nameCity = document.getElementById("city");
const select = document.getElementById("country");

const apiId = "0b5ef3dc4b424b3cb6b0bb6dc52b73ea";

const countries = [
  "", "Argentina", "Australia", "Brazil", "Canada", "Chile",
  "China", "Colombia", "Costa Rica", "Ecuador", "Egypt",
  "España", "France", "Germany", "India", "Italy", "Japan",
  "Mexico", "Morocco", "Peru", "Philippines", "Portugal",
  "Russia", "South Korea", "Spain", "Sweden", "Switzerland",
  "Thailand", "Turkey", "United Kingdom", "United States", "Uruguay", "Venezuela"
];

countries.forEach((country) => {
  const option = document.createElement("option");
  option.value = country;
  option.textContent = country;
  select.appendChild(option);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = nameCity.value.trim();
  const country = select.value.trim();
  const cityImg = document.getElementById("cityImg");
  cityImg.style.display = "none"; // Ocultar mientras carga

  if (!city && !country) {
    return showError("Por favor, ingresa una ciudad o selecciona un país");
  }

  try {
    await getCoordinates(city, country);
  } catch (error) {
    showError("No se pudo obtener el clima");
    console.error(error);
  }
});

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

async function callAPI(lat, lon, name, state, countryCode) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiId}&units=metric&lang=es`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.cod !== 200) {
    return showError("Error al obtener el clima");
  }

  showWeather(data, name, state, countryCode);
}

function showWeather(data, name, state, countryCode) {
  const {
    main: { temp, temp_max, temp_min },
    weather: [arr],
  } = data;

  const cityName = document.getElementById("cityName");
  const cityImg = document.getElementById("cityImg");
  const cityTemp = document.getElementById("cityTemp");
  const cityMaxTemp = document.getElementById("cityMaxTemp");
  const cityMinTemp = document.getElementById("cityMinTemp");

  cityName.textContent = `Clima de ${name}${state ? ", " + state : ""} (${countryCode})`;

  // ✅ Muestra solo cuando tenga icono
  cityImg.src = `https://openweathermap.org/img/wn/${arr.icon}@2x.png`;
  cityImg.alt = arr.description;
  cityImg.style.display = "block";

  cityTemp.textContent = `${Math.round(temp)}°C`;
  cityMaxTemp.textContent = `Max: ${Math.round(temp_max)}°C`;
  cityMinTemp.textContent = `Min: ${Math.round(temp_min)}°C`;
}

function showError(message) {
  const alert = document.createElement("p");
  alert.classList.add("alert-message", "text-red-400", "mt-2");
  alert.innerText = message;
  form.appendChild(alert);

  setTimeout(() => alert.remove(), 2000);
}
