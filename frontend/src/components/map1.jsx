import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import { Card } from "react-bootstrap";
import io from "socket.io-client";

function Maap1({ drones }) {
  const [currentLocation, setCurrentLocation] = useState({});
  const [droneList, setDroneList] = useState(drones);
  const mapRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [markerObjs, setMarkerObjs] = useState([]);
  let c = 0;
  const socket = io(process.env.REACT_APP_SERVER, {
    transports: ["websocket", "polling", "flashsocket"],
  });

  socket.on("locationlat", (data) => {
    const { id, location } = data;
    const LocationIndex = drones.findIndex((drone) => drone._id === id);
    if (LocationIndex === -1) return;
    handleLocationLat(id, location);
    renderMarkers(droneList);
  });

  socket.on("locationlon", (data) => {
    const { id, location } = data;
    const LocationIndex = drones.findIndex((drone) => drone._id === id);
    if (LocationIndex === -1) return;
    handleLocationLon(id, location);
    renderMarkers(droneList);
  });
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    setCurrentLocation({
      lat:30.3515225 ,
      lng:76.3623213 ,
    });

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
    setMarkerObjs((prevMarkerObjs) => {
      prevMarkerObjs.forEach((marker) => {
        marker.setMap(null);
      });
      return [];
    });
  };
  const handleLocationLat = (id, location) => {
    removeMarkers();
    setMarkerObjs([]);
    let droneListnew = [...drones];
    droneList.map((drone) => {
      if (drone._id === id) {
        drone.location = { lat: location, lon: drone.location.lon };
      }
      return drone;
    });
    setDroneList(droneListnew);
  };

  const handleLocationLon = (id, location) => {
    removeMarkers();
    setMarkerObjs([]);
    let droneListnew = [...drones];
    droneListnew.map((drone) => {
      if (drone._id === id) {
        drone.location = { lat: drone.location.lat, lon: location };
      }
      return drone;
    });
    setDroneList(droneListnew);
  };
  return (
    <div
      style={{
        width: `${windowWidth > 768 ? "" : "80%"}`,
        marginTop: `${windowWidth > 768 ? "23%" : "55%"}`,
        height: `${windowWidth > 768 ? "50%" : "100%"}`,
      }}
      className="pt-4 container"
    >
      <Card>
        <Card.Title
          className="ms-3 mt-3"
          style={{ fontWeight: "600", color: "#2a265f", fontSize: "25px" }}
        >
          LIVE MAP
        </Card.Title>
        <Card.Body>
          <Card.Text className="text-secondary">
            Location of all drones appears here in real time
          </Card.Text>
        </Card.Body>
      </Card>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAPS,
          libraries: ["places", "geometry"],
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          mapRef.current = map;
          renderMarkers(droneList);
        }}
        center={{ lat: currentLocation.lat, lng: currentLocation.lng }}
        defaultZoom={17}
        options={{
          mapTypeId: "satellite",
        }}
      ></GoogleMapReact>
    </div>
  );
}
export default Maap1;
