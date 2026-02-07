let map;
let userLocationMarker;
let routePolylines = [];
let userLocation = null;
const destinationLocation = { lat: 14.4627, lng: 120.9645 };

// Add at the very beginning of maps.js
if (typeof google === 'undefined') {
    console.error('Google Maps API not loaded');
    document.addEventListener('DOMContentLoaded', function() {
        const mapElement = document.getElementById("map");
        if (mapElement) {
            mapElement.innerHTML = `
                <div class="map-loading">
                    <i class="material-icons" style="font-size: 48px; color: #dc3545;">error</i>
                    <h3>Google Maps API Not Loaded</h3>
                    <p>Please check your internet connection and API key.</p>
                </div>
            `;
        }
    });
    // Don't proceed if Google Maps isn't loaded
    throw new Error('Google Maps API not loaded');
}

async function initMap() {
  try {
    // Show loading state
    const mapElement = document.getElementById("map");
    mapElement.innerHTML = `
      <div class="map-loading">
        <div class="spinner"></div>
        <p>Loading map...</p>
      </div>
    `;

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { Route } = await google.maps.importLibrary("routes");

    // Clear loading state
    mapElement.innerHTML = '';

    map = new Map(mapElement, {
      center: destinationLocation,
      zoom: 15,
      mapId: "DEMO_MAP_ID",
      gestureHandling: "greedy",
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    // Add destination marker
    new AdvancedMarkerElement({
      map: map,
      position: destinationLocation,
      title: "Bacoor City Hall",
    });

    const locateMeButton = document.getElementById("locateMe");
    const getDirectionsButton = document.getElementById("getDirections");
    const messageBox = document.getElementById("message-box");

    locateMeButton.addEventListener("click", () => {
      if (navigator.geolocation) {
        messageBox.textContent = "Finding your location...";
        locateMeButton.disabled = true;
        locateMeButton.innerHTML = '<i class="material-icons">sync</i> Locating...';

        navigator.geolocation.getCurrentPosition(
          (position) => {
            userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            if (userLocationMarker) {
              userLocationMarker.position = userLocation;
            } else {
              userLocationMarker = new AdvancedMarkerElement({
                map: map,
                position: userLocation,
                title: "Your Location",
              });
            }
            
            // Center map between user and destination
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(userLocation);
            bounds.extend(destinationLocation);
            map.fitBounds(bounds);
            
            messageBox.innerHTML = `
              <div class="route-info">
                <h3>Location Found</h3>
                <p>Your location has been marked on the map.</p>
                <p>Click "Get Directions" for navigation.</p>
              </div>
            `;
            
            locateMeButton.disabled = false;
            locateMeButton.innerHTML = '<i class="material-icons">my_location</i> My Location';
          },
          (error) => {
            messageBox.textContent = "Error: Unable to get your location. Please check your browser permissions.";
            locateMeButton.disabled = false;
            locateMeButton.innerHTML = '<i class="material-icons">my_location</i> My Location';
          }
        );
      } else {
        messageBox.textContent = "Error: Your browser doesn't support geolocation.";
      }
    });

    getDirectionsButton.addEventListener("click", async () => {
      if (!userLocation) {
        messageBox.textContent = "Please find your location first using the 'My Location' button.";
        return;
      }

      messageBox.textContent = "Calculating route...";
      getDirectionsButton.disabled = true;
      getDirectionsButton.innerHTML = '<i class="material-icons">sync</i> Calculating...';

      // Clear previous routes
      routePolylines.forEach((polyline) => polyline.setMap(null));
      routePolylines = [];

      const request = {
        origin: { location: userLocation },
        destination: { location: destinationLocation },
        travelMode: 'DRIVING',
        fields: ['path', 'legs', 'viewport', 'localizedValues', 'distanceMeters', 'durationMillis'],
      };

      try {
        const { routes } = await Route.computeRoutes(request);
        if (routes && routes.length > 0) {
          const route = routes[0];
          routePolylines = route.createPolylines({
            polylineOptions: { 
              map: map,
              strokeColor: "#0056A8",
              strokeOpacity: 0.8,
              strokeWeight: 4
            },
          });
          
          // Fit map to show entire route
          map.fitBounds(route.viewport);

          const distanceText = route.localizedValues?.distance?.text ?? (route.distanceMeters ? `${(route.distanceMeters / 1000).toFixed(1)} km` : 'Not available');
          const durationText = route.localizedValues?.duration?.text ?? (route.durationMillis ? `${Math.round(route.durationMillis / 60000)} min` : 'Not available');

          messageBox.innerHTML = `
            <div class="route-info">
              <h3>Route to Bacoor City Hall</h3>
              <p><strong>Distance:</strong> ${distanceText}</p>
              <p><strong>Estimated Time:</strong> ${durationText}</p>
              <p><strong>Travel Mode:</strong> Driving</p>
              <p>Route has been plotted on the map in blue.</p>
            </div>
          `;
        } else {
          messageBox.textContent = "No route found. Please try again.";
        }
      } catch (error) {
        console.error("Error computing routes:", error);
        messageBox.textContent = "Error calculating directions. Please try again.";
      } finally {
        getDirectionsButton.disabled = false;
        getDirectionsButton.innerHTML = '<i class="material-icons">directions</i> Get Directions';
      }
    });

  } catch (error) {
    console.error("Error initializing map:", error);
    const mapElement = document.getElementById("map");
    mapElement.innerHTML = `
      <div class="map-loading">
        <i class="material-icons" style="font-size: 48px; color: #dc3545;">error</i>
        <h3>Map Loading Failed</h3>
        <p>Unable to load Google Maps. Please check your internet connection.</p>
        <p>You can still get directions using the link below:</p>
        <a href="https://www.google.com/maps/dir//Bacoor+City+Hall,+Bacoor,+Cavite/@14.4627,120.9645,16z" 
           target="_blank" class="btn btn-primary" style="margin-top: 10px;">
          <i class="material-icons">open_in_new</i> Open in Google Maps
        </a>
      </div>
    `;
  }
}

// Initialize when Google Maps API is loaded
window.initMap = initMap;