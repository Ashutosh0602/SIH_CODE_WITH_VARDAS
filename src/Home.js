import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [startStation, setStartStation] = useState("");
  const [endStation, setEndStation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (startStation && endStation) {
      alert(`Searching best route from ${startStation} to ${endStation}`);
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
            value={startStation}
            onChange={(e) => setStartStation(e.target.value)}
            placeholder="Enter starting station"
            className="input"
          />
        </div>

        <div className="input-group">
          <label>Destination Station:</label>
          <input
            type="text"
            value={endStation}
            onChange={(e) => setEndStation(e.target.value)}
            placeholder="Enter destination station"
            className="input"
          />
        </div>

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
