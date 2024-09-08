import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AllStop from "./Allstop";
import RouteMap from "./RouteMap";
import Home from "./Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detailed-stop" element={<AllStop />} />
        <Route path="/optimized-path" element={<RouteMap />} />
      </Routes>
    </Router>
  );
}

export default App;
