import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import stopsData from "./assets/stops.json"; // Import your stops.json file
import "./Home.css";

// Haversine formula to calculate distance between two latitude/longitude points
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dlat = ((lat2 - lat1) * Math.PI) / 180;
  const dlon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
};

const findShortestRouteAndDistance = (startId, endId) => {
  const startIndex = stopsData.findIndex((stop) => stop.stop_id === startId);
  const endIndex = stopsData.findIndex((stop) => stop.stop_id === endId);

  if (startIndex !== -1 && endIndex !== -1) {
    const route = stopsData.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1
    );
    const totalDistance = route.reduce((acc, stop, index) => {
      if (index < route.length - 1) {
        return (
          acc +
          haversine(
            stop.stop_lat,
            stop.stop_lon,
            route[index + 1].stop_lat,
            route[index + 1].stop_lon
          )
        );
      }
      return acc;
    }, 0);

    const coordinates = route.map((stop) => ({
      lat: stop.stop_lat,
      lon: stop.stop_lon,
    }));
    return { totalDistance, coordinates };
  }

  return null;
};

const Home = () => {
  const [startStation, setStartStation] = useState("");
  const [endStation, setEndStation] = useState("");
  const [startStopId, setStartStopId] = useState(null);
  const [endStopId, setEndStopId] = useState(null);
  const [filteredStops, setFilteredStops] = useState(stopsData);
  const [distance, setDistance] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (
      startStation &&
      endStation &&
      startStopId !== null &&
      endStopId !== null
    ) {
      const result = findShortestRouteAndDistance(startStopId, endStopId);
      if (result) {
        setDistance(result.totalDistance);
        setCoordinates(result.coordinates);
      } else {
        alert("One of the stop IDs is not found.");
      }
    } else {
      alert("Please select both stations");
    }
  };

  const goToDetailedStop = () => {
    navigate("/detailed-stop");
  };

  const goToOptimizedPath = () => {
    navigate("/optimized-path");
  };

  const handleFilter = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = stopsData.filter((stop) =>
      stop.stop_name.toLowerCase().includes(query)
    );
    setFilteredStops(filtered);
  };

  return (
    <div className="home-container">
      <div className="">
        <img
          src="https://cracku.in/latest-govt-jobs/wp-content/uploads/2022/04/DTC-Logo.png"
          alt="DTC Logo"
          className=""
        />
      </div>
      <h1 className="heading">Delhi Transport Corporation</h1>
      <p className="subheading">Find the best route between two stations</p>

      <div className="form">
        <div className="input-group">
          <label>Starting Station:</label>
          <input
            type="text"
            onChange={handleFilter}
            placeholder="Enter starting station"
            className="input"
          />
          <ul className="dropdown">
            {filteredStops.map((stop) => (
              <li
                key={stop.stop_id}
                onClick={() => {
                  setStartStation(stop.stop_name);
                  setStartStopId(stop.stop_id);
                  setFilteredStops(stopsData); // Reset the list after selection
                }}
              >
                {stop.stop_name} (ID: {stop.stop_id})
              </li>
            ))}
          </ul>
        </div>

        <div className="input-group">
          <label>Destination Station:</label>
          <input
            type="text"
            onChange={handleFilter}
            placeholder="Enter destination station"
            className="input"
          />
          <ul className="dropdown">
            {filteredStops.map((stop) => (
              <li
                key={stop.stop_id}
                onClick={() => {
                  setEndStation(stop.stop_name);
                  setEndStopId(stop.stop_id);
                  setFilteredStops(stopsData); // Reset the list after selection
                }}
              >
                {stop.stop_name} (ID: {stop.stop_id})
              </li>
            ))}
          </ul>
        </div>

        {distance !== null && (
          <div className="result">
            <h2>Route Information</h2>
            <p className="total-distance">
              Total Distance: {distance.toFixed(2)} km
            </p>
            <h3>Route Coordinates:</h3>
            <ul style={{ height: "5rem", overflow: "scroll" }}>
              {coordinates.map((coord, index) => (
                <li key={index}>
                  Latitude: {coord.lat}, Longitude: {coord.lon}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={handleSearch} className="search-button">
          Find Route
        </button>

        <div className="navigation-buttons">
          <button onClick={goToDetailedStop} className="nav-button">
            Detailed Stop
          </button>
          <button onClick={goToOptimizedPath} className="nav-button">
            Optimized Path
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
