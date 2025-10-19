const result = document.getElementById("result");
const form = document.getElementById("getWeather");
const nameCity = document.getElementById("city");
const select = document.getElementById("country");

const apiId = "0b5ef3dc4b424b3cb6b0bb6dc52b73ea";

// Rellena el select de países (si lo quieres seguir mostrando)
const countries = [
  "", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Chile", "China", "Colombia", "Costa Rica", "Cuba", "Czech Republic",
  "Denmark", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "España",
  "Finland", "France", "Germany", "Ghana", "Greece", "Guatemala", "Honduras",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
  "Japan", "Kenya", "Kuwait", "Luxembourg", "Malaysia", "Mexico", "Morocco",
  "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "Norway", "Pakistan",
  "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Saudi Arabia", "Serbia", "Singapore", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand",
  "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Venezuela", "Vietnam"
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

// 🔍 Buscar coordenadas de cualquier tipo de lugar
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

// 🌤 Obtener el clima con coordenadas
async function callAPI(lat, lon, name, state, countryCode) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiId}&units=metric&lang=es`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.cod !== 200) {
    return showError("Error al obtener el clima");
  }

  showWeather(data, name, state, countryCode);
}

// 🌡 Mostrar datos del clima
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
  cityImg.src = `https://openweathermap.org/img/wn/${arr.icon}@2x.png`;
  cityTemp.textContent = `${Math.round(temp)}°C`;
  cityMaxTemp.textContent = `Max: ${Math.round(temp_max)}°C`;
  cityMinTemp.textContent = `Min: ${Math.round(temp_min)}°C`;

  // Colores dinámicos
  const temps = [cityTemp, cityMaxTemp, cityMinTemp];
  temps.forEach((el) => el.className = ""); // limpia clases previas

  if (temp <= 15) temps.forEach((el) => el.classList.add("color-blue"));
  else if (temp >= 35) temps.forEach((el) => el.classList.add("color-warm"));
  else temps.forEach((el) => el.classList.add("color-yellow"));
}

// ⚠ Mostrar errores
function showError(message) {
  const alert = document.createElement("p");
  alert.classList.add("alert-message");
  alert.innerText = message;
  form.appendChild(alert);

  setTimeout(() => alert.remove(), 2000);
}
