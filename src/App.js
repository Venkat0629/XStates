import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const url = "https://crio-location-selector.onrender.com";
  const [data, setData] = useState({
    countries: [],
    states: [],
    cities: [],
    selected: { country: "", state: "", city: "" },
  });
  const fetchCountries = async () => {
    try {
      const response = await fetch(`${url}/countries`);
      const jsonData = await response.json();
      setData((prevData) => ({ ...prevData, countries: jsonData }));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchStates = async (country) => {
    try {
      const response = await fetch(`${url}/country=${country}/states`);
      const jsonData = await response.json();
      setData((prevData) => ({ ...prevData, states: jsonData }));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCities = async (country, state) => {
    try {
      const response = await fetch(
        `${url}/country=${country}/state=${state}/cities`
      );
      const jsonData = await response.json();
      setData((prevData) => ({ ...prevData, cities: jsonData }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleSelect = async (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      fetchStates(value);
      setData((prevData) => ({
        ...prevData,
        selected: { ...prevData.selected, country: value },
      }));
    } else if (name === "state") {
      fetchCities(data.selected.country, value);
      setData((prevData) => ({
        ...prevData,
        selected: { ...prevData.selected, state: value },
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        selected: { ...prevData.selected, city: value },
      }));
    }
  };

  return (
    <div className="App">
      <h1>Select Location</h1>
      {!data.countries ? (
        <p>Loading...</p>
      ) : (
        <form className="form">
          <select name="country" onChange={handleSelect} className="medium">
            <option value="">Select Country</option>
            {data.countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select
            name="state"
            onChange={handleSelect}
            disabled={!data.selected.country}
            className="medium"
          >
            <option value="">Select State</option>
            {data.states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            name="city"
            onChange={handleSelect}
            disabled={!data.selected.state}
            className="medium"
          >
            <option value="">Select City</option>
            {data.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </form>
      )}
      {data.selected.country && data.selected.state && data.selected.city && (
        <p className="subtitle">
          You selected <span className="title">{data.selected.country}</span>
          <span className="text">
            , {data.selected.state}, {data.selected.city}
          </span>
        </p>
      )}
    </div>
  );
}

export default App;
