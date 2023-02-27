import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import { Card } from "react-bootstrap";
import io from "socket.io-client";

function Maap1({ drones }) {
  const [currentLocation, setCurrentLocation] = useState({});
  const [droneList, setDroneList] = useState(drones);
  const mapRef = useRef(null);
  const [markerObjs, setMarkerObjs] = useState([]);
  let c = 0;
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
  const socket = io("http://localhost:3000", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    socket.on("locationlat", (data) => {
      const { id, location } = data;
      const LocationIndex = drones.findIndex((drone) => drone._id === id);
      if (LocationIndex === -1) return;
      handleLocationLat(id, location);
    });

    socket.on("locationlon", (data) => {
      const { id, location } = data;
      const LocationIndex = drones.findIndex((drone) => drone._id === id);
      if (LocationIndex === -1) return;
      handleLocationLon(id, location);
    });

  useEffect(() => {
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

  // const removeMarkers = () => {
  //   console.log("remove markers");
  //   setMarkerObjs((prevMarkerObjs) => {
  //     prevMarkerObjs.forEach((marker) => {
  //       marker.setMap(null);
  //     });
  //   });
  //   setMarkerObjs([]);
  // };
  const removeMarkers = () => {
    setMarkerObjs((prevMarkerObjs) => {
      prevMarkerObjs.forEach((marker) => {
        marker.setMap(null);
      });
      return [];
    });
  };
  const handleLocationLat = (id, location) => {
    let droneListnew = [...droneList];
    droneList.map((drone) => {
      if (drone._id === id) {
        drone.location = { lat: location, lon: drone.location.lon };
      }
    });
    removeMarkers();
    //renderMarkers(droneListnew);
    setDroneList(droneListnew);
  };

  const handleLocationLon = (id, location) => {
    removeMarkers()
    let droneListnew = [...drones];
    droneListnew.map((drone) => {
      if (drone._id === id) {
        drone.location = { lat: drone.location.lat, lon: location };
      }
      return drone;
    });
    setDroneList(droneListnew);
    setTimeout(() => {
      console.log("rendering", markerObjs);
      renderMarkers(droneListnew);
      console.log("after", markerObjs);
    }, 10000);
  };
  return (
    <div
      style={{ width: "100%", marginTop: "25%", height: "50%" }}
      className="pt-4"
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
