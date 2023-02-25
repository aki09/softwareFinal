import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import { Card } from "react-bootstrap";
import io from "socket.io-client";

function Maap1({ drones }) {
  const [currentLocation, setCurrentLocation] = useState({});
  const [droneList, setDroneList] = useState(drones);
  const mapRef = useRef(null);
  const [markerObjs, setMarkerObjs] = useState([]);
  const fetchlocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        console.error("Geolocation is not supported by this browser.");
        alert("Geolocation is not supported by this browser.");
      }
    );
  };

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    socket.on("locationlat", (data) => {
      const { id, location } = data;
      const LocationIndex = drones.findIndex((drone) => drone._id === id);
      if (LocationIndex === -1) return;
      handleLocationLat(id, location,markerObjs);
    });

    socket.on("locationlon", (data) => {
      const { id, location } = data;
      const LocationIndex = drones.findIndex((drone) => drone._id === id);
      if (LocationIndex === -1) return;
      handleLocationLon(id, location);
    });

    fetchlocation();
  }, []);

  const renderMarkers = (markers) => {
    const newMarkerObjs = markers.map((marker) => {
      return new window.google.maps.Marker({
        position: { lat: marker.location.lat, lng: marker.location.lon },
        map: mapRef.current,
        title: marker.name,
        icon: {
          url: `http://maps.google.com/mapfiles/ms/icons/${marker.colormap}.png`,
        },
      });
    });
    setMarkerObjs(newMarkerObjs);
  };

  const removeMarkers = () => {
    console.log("removing", markerObjs.length);
    for (let i = 0; i < markerObjs.length; i++) {
      console.log("removing", markerObjs.length);
      markerObjs[i].setMap(null);
    }
    setMarkerObjs([]);
  };

  
  const handleLocationLat = (id, location) => {
    // setDroneList((prevDroneList) =>
    //   prevDroneList.map((drone) => {
    //     if (drone._id === id) {
          
    //       return {
    //         ...drone,
    //         location: { lat: location, lon: drone.location.lon },
    //       };
    //     }
    //     return drone;
    //   })
    // );

    //removeMarkers();
    console.log("remov",markerObjs.length)
  };

  const handleLocationLon = (id, location) => {
    setDroneList((prevDroneList) =>
      prevDroneList.map((drone) => {
        if (drone._id === id) {
          return {
            ...drone,
            location: { lat: drone.location.lat, lon: location },
          };
        }
        return drone;
      })
    );
  };
  return (
    <div
      style={{ width: "100%", marginTop: "25%", height: "50%" }}
      className="pt-4"
    >
      <Card>
        <Card.Title className="ms-3 mt-3">LIVE MAP</Card.Title>
>>>>>>> Stashed changes
        <Card.Body>
          <Card.Text className="text-secondary">
            Location of all drones appears here in real time
          </Card.Text>
        </Card.Body>
      </Card>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.react_google_maps_api,
          libraries: ["places", "geometry"],
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          mapRef.current = map;
          renderMarkers(droneList);
        }}
        center={{ lat: currentLocation.lat, lng: currentLocation.lng }}
        defaultZoom={1}
        options={{
          mapTypeId: "satellite",
        }}
      ></GoogleMapReact>
    </div>
  );
}
export default Maap1;
