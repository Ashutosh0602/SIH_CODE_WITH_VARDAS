import React, { useState } from "react";
import Papa from "papaparse";

const Routes = () => {
  const [routeTripMap, setRouteTripMap] = useState({});
  const [routesFile, setRoutesFile] = useState(null);
  const [tripsFile, setTripsFile] = useState(null);

  // Function to parse a CSV file
  const parseCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true, // To ensure we get objects with key-value pairs
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => reject(error),
      });
    });
  };

  // Handle the file upload and parsing
  const handleFileUpload = async () => {
    if (!routesFile || !tripsFile) {
      alert("Please upload both routes and trips CSV files.");
      return;
    }

    try {
      // Parse the routes.csv and trips.csv files
      const routes = await parseCSVFile(routesFile);
      const trips = await parseCSVFile(tripsFile);

      // Create the map of route_id to the first trip_id
      const routeTripMap = {};
      routes.forEach((route) => {
        const firstTrip = trips.find(
          (trip) => trip.route_id === route.route_id
        );
        if (firstTrip) {
          routeTripMap[route.route_id] = firstTrip.trip_id;
        }
      });

      // Set the state with the map
      setRouteTripMap(routeTripMap);
    } catch (error) {
      console.error("Error processing CSV files:", error);
    }
  };

  // Handle file selection for routes
  const handleRoutesFileChange = (e) => {
    setRoutesFile(e.target.files[0]);
  };

  // Handle file selection for trips
  const handleTripsFileChange = (e) => {
    setTripsFile(e.target.files[0]);
  };

  return (
    <div>
      <h1>Upload Routes and Trips Files</h1>

      {/* Input for routes.csv */}
      <input type="file" accept=".csv" onChange={handleRoutesFileChange} />
      <br />

      {/* Input for trips.csv */}
      <input type="file" accept=".csv" onChange={handleTripsFileChange} />
      <br />

      {/* Button to trigger the file processing */}
      <button onClick={handleFileUpload}>Process Files</button>

      {/* Displaying the routeTripMap */}
      {Object.keys(routeTripMap).length > 0 && (
        <div>
          <h2>Route Trip Map</h2>
          <pre>{JSON.stringify(routeTripMap, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Routes;
