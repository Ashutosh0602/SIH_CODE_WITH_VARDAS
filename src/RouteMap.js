import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./RouteMap.css";
import L from "leaflet";
import updatedRouteStopsMap from "./assets/updated_route_stops_map.json";

const RouteMap = () => {
  const [routes, setRoutes] = useState({});

  useEffect(() => {
    setRoutes(updatedRouteStopsMap);
  }, []);

  const getColorForRoute = (index) => {
    const colors = [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="route-map-container">
      <h1 className="heading">Optimize Path for DTC Route</h1>
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={12}
        style={{ height: "80vh", width: "90vw" }}
        className="map"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {Object.keys(routes).map((routeId, index) => {
          const routeStops = routes[routeId];
          const latLngs = routeStops.map((stop) => [
            stop.latitude,
            stop.longitude,
          ]);
          return (
            <Polyline
              key={routeId}
              positions={latLngs}
              color={getColorForRoute(index)}
              weight={1}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
