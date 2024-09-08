import React, { useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import "./AllStop.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const AllStop = () => {
  const [stopsData, setStopsData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const jsonData = result.data.map((row) => ({
            stop_code: row.stop_code,
            stop_lat: parseFloat(row.stop_lat),
            stop_lon: parseFloat(row.stop_lon),
            stop_name: row.stop_name,
            zone_id: parseInt(row.zone_id, 10),
          }));
          setStopsData(jsonData);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };

  return (
    <div className="all-stop-container">
      <h1 className="heading">All the Optimized Stops of DTC BUS</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="upload-btn"
      />
      <MapContainer
        center={[28.851958, 77.088107]}
        zoom={12}
        style={{ height: "80vh", width: "90vw" }}
        className="map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {stopsData.map((stop, index) => (
          <Circle
            key={index}
            center={[stop.stop_lat, stop.stop_lon]}
            radius={1}
            color="blue"
            fillColor="blue"
            fillOpacity={0.5}
          >
            <Popup>{stop.stop_name}</Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default AllStop;
