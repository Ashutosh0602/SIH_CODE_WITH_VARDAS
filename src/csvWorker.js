/* eslint-disable no-restricted-globals */

// Helper function to process chunks of stopTimes
function processStopTimesChunk(stopTimesChunk, routeTripMap, routeStopMap) {
  stopTimesChunk.forEach((stopTime) => {
    const routeId = Object.keys(routeTripMap).find(
      (route_id) => routeTripMap[route_id] === stopTime.trip_id
    );
    if (routeId) {
      if (!routeStopMap[routeId]) {
        routeStopMap[routeId] = [];
      }
      routeStopMap[routeId].push(stopTime.stop_id);
    }
  });
}

self.onmessage = async (e) => {
  const { routes, trips, stopTimes } = e.data;

  // Create the map of route_id to the first trip_id
  const routeTripMap = {};
  routes.forEach((route) => {
    const firstTrip = trips.find((trip) => trip.route_id === route.route_id);
    if (firstTrip) {
      routeTripMap[route.route_id] = firstTrip.trip_id;
    }
  });

  const routeStopMap = {};
  const chunkSize = 10000; // Define chunk size to avoid memory overflow

  for (let i = 0; i < stopTimes.length; i += chunkSize) {
    const stopTimesChunk = stopTimes.slice(i, i + chunkSize);

    // Process the chunk of stopTimes
    processStopTimesChunk(stopTimesChunk, routeTripMap, routeStopMap);

    // Post progress back to the main thread (you can optionally update the progress)
    self.postMessage({ routeStopMap, progress: (i / stopTimes.length) * 100 });
  }

  // After all chunks have been processed, send the final result
  self.postMessage({ routeStopMap, done: true });
};
