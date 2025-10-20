import { useEffect } from "react";
import img_font from "../img/weather.jpg";

function Weather() {
  useEffect(() => {
    const result = document.getElementById("result");
    const form = document.getElementById("getWeather");
    const nameCity = document.getElementById("city");
    const select = document.getElementById("country");

    const apiId = "0b5ef3dc4b424b3cb6b0bb6dc52b73ea";

    const countries = [
      "",
      "Argentina",
      "Australia",
      "Brazil",
      "Canada",
      "Chile",
      "China",
      "Colombia",
      "Costa Rica",
      "Ecuador",
      "Egypt",
      "España",
      "France",
      "Germany",
      "India",
      "Italy",
      "Japan",
      "Mexico",
      "Morocco",
      "Peru",
      "Philippines",
      "Portugal",
      "Russia",
      "South Korea",
      "Spain",
      "Sweden",
      "Switzerland",
      "Thailand",
      "Turkey",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Venezuela",
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

      cityImg.src =
        "https://www.gstatic.com/weather/conditions/v1/svg/drizzle_light.svg";
      cityImg.style.display = "block";

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

      cityName.textContent = `Clima de ${name}${
        state ? ", " + state : ""
      } (${countryCode})`;
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
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden font-[Ubuntu] text-white">
      {/* Fondo difuminado */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[0.7] blur-[4px]"
        style={{
          backgroundImage: `url(${img_font})`,
        }}
      ></div>

      {/* Gradiente oscuro encima */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e1f26]/80 to-[#2a2d3e]/80"></div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col md:flex-row justify-center items-center w-full h-full px-4 md:px-8 py-6 text-center animate-fadeIn">
        <section
          className="flex flex-col md:flex-row gap-6 w-full max-w-5xl bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl 
          p-6 sm:p-8 md:p-10 transition-all duration-500"
        >
          {/* Columna izquierda */}
          <div className="flex flex-col justify-center items-center gap-4 w-full md:w-1/2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-white drop-shadow-lg">
              Buscador del Clima
            </h1>

            <div
              id="result"
              className="flex flex-col items-center justify-center gap-3 w-full text-center"
            >
              <p className="font-light text-sm sm:text-base opacity-90">
                Agregue ciudad y país
              </p>
              <h5
                id="cityName"
                className="font-semibold text-xl sm:text-2xl md:text-3xl text-white/90"
              >
                Clima de -------
              </h5>

              {/* Imagen clima */}
              <div className="flex justify-center items-center w-full h-20 md:h-28">
                <img
                  id="cityImg"
                  src="https://www.gstatic.com/weather/conditions/v1/svg/drizzle_light.svg"
                  alt="icono por defecto"
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain transition-transform duration-300 hover:scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                />
              </div>

              {/* Temperaturas */}
              <h2
                id="cityTemp"
                className="font-[Jersey_10] text-5xl sm:text-6xl md:text-8xl font-bold text-[#f67280] animate-pulse"
              >
                --°C
              </h2>
              <p
                id="cityMaxTemp"
                className="font-[Jersey_10] text-3xl md:text-4xl text-yellow-300"
              >
                Max: --°C
              </p>
              <p
                id="cityMinTemp"
                className="font-[Jersey_10] text-3xl md:text-4xl text-blue-300"
              >
                Min: --°C
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form
            action=""
            method="POST"
            id="getWeather"
            className="w-full md:w-1/2 flex flex-col justify-center items-center gap-5"
          >
            <input
              className="w-[90%] bg-black/40 text-white text-lg sm:text-xl md:text-2xl rounded-xl py-2 ps-3 text-center outline-none border border-white/30 backdrop-blur-md
              focus:border-[#70c1b3] focus:scale-105 transition-all duration-300 placeholder:text-white/70"
              type="text"
              name="city"
              id="city"
              placeholder="Indique la ciudad"
            />

            <select
              className="w-[80%] bg-black/40 text-white text-lg rounded-md border border-white/30 outline-none py-2"
              id="country"
            ></select>

            <input
              type="submit"
              value="Get Weather"
              className="submit w-[90%] bg-[#70c1b3] text-black font-semibold text-lg rounded-xl py-3 cursor-pointer 
              hover:translate-y-[-2px] hover:scale-105 hover:bg-[#ffe066] hover:shadow-lg transition-all duration-300"
            />
          </form>
        </section>
      </main>
    </div>
  );
}

export default Weather;
