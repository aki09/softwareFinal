import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import "../styles/Form/Form.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

const FormMap = () => {
  const location = useLocation();
  const { id } = location.state;
  const [currentLocation, setCurrentLocation] = useState({});
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMapClick = (event) => {
    if (markers.length < 4) {
      const newMarker = { lat: event.lat, lng: event.lng };
      setMarkers([...markers, newMarker]);
      renderMarkers([...markers, newMarker]);
    }
  };

  const cookieValue = document.cookie
  .split("; ")
  .find((row) => row.startsWith("access_token="))
  ?.split("=")[1];

  // const handleMarkerDelete = (index, event) => {
  //   event.preventDefault();
  //   const newMarkers = [...markers];
  //   newMarkers.splice(index, 1);
  //   setMarkers(newMarkers);
  //   markers[index].setMap(null);
  //   renderMarkers(newMarkers);
  // };
  const handleMarkerDelete = (index, event) => {
    event.preventDefault();
    const newMarkers = [...markers];
    const deletedMarker = newMarkers.splice(index, 1)[0];
    setMarkers(newMarkers);
    renderMarkers(newMarkers);
  };

  const renderMarkers = (markers) => {
    markers.forEach((marker) => {
      const newMarker = new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: mapRef.current,
      });
    });
  };

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
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/form", {
          params: { cookieValue: cookieValue,droneid:id},
        });
        console.log(response.data)
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    fetchlocation();
    fetchData();
  }, []);

  return (
    <div className="page-content">
      <div className="form-v4-content">
        <div className="form-detail">
          <div
            style={{ width: "100%", marginTop: "5%", height: "90%" }}
            className="pt-4"
          >
            <GoogleMapReact
              bootstrapURLKeys={{
                key: process.env.react_google_maps_api,
                libraries: ["places", "geometry"],
              }}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => {
                mapRef.current = map;
                renderMarkers(markers);
              }}
              onClick={handleMapClick}
              center={{ lat: currentLocation.lat, lng: currentLocation.lng }}
              defaultZoom={18}
              options={{
                mapTypeId: "satellite",
              }}
            ></GoogleMapReact>
          </div>
        </div>
        <form className="form-detail">
          <h2>CO_ORDINATES</h2>
          <div className="form-group">
            <div className="hello">
              <label>POINT - 1</label>
            </div>
            <div className="form-row form-row-1">
              <label>Latitude</label>
              <input
                type="text"
                name="lat_1"
                id="lat_1"
                className="input-text"
                value={markers.length > 0 ? markers[0].lat : ""}
                readOnly
              />
            </div>
            <div className="form-row form-row-1">
              <label>Longitude</label>
              <input
                type="text"
                name="lon_1"
                id="lon_1"
                className="input-text"
                value={markers.length > 0 ? markers[0].lng : ""}
                readOnly
              />
            </div>
            <div>
              <button
                style={{ color: "red", marginTop: "55%" }}
                onClick={(event) => handleMarkerDelete(0, event)}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="form-group">
            <div className="hello">
              <label>POINT - 2</label>
            </div>
            <div className="form-row form-row-1">
              <label>Latitude</label>
              <input
                type="text"
                name="lat_2"
                id="lat_2"
                className="input-text"
                value={markers.length > 1 ? markers[1].lat : ""}
                readOnly
              />
            </div>
            <div className="form-row form-row-1">
              <label>Longitude</label>
              <input
                type="text"
                name="lon_2"
                id="lon_2"
                className="input-text"
                value={markers.length > 1 ? markers[1].lng : ""}
                readOnly
              />
            </div>
            <button
              style={{ color: "red", margin: "4%" }}
              onClick={(event) => handleMarkerDelete(1, event)}
            >
              Delete
            </button>
          </div>
          <div className="form-group">
            <div className="hello">
              <label>POINT - 3</label>
            </div>
            <div className="form-row form-row-1">
              <label>Latitude</label>
              <input
                type="text"
                name="lat_3"
                id="lat_3"
                className="input-text"
                value={markers.length > 2 ? markers[2].lat : ""}
                readOnly
              />
            </div>
            <div className="form-row form-row-1">
              <label>Longitude</label>
              <input
                type="text"
                name="lon_3"
                id="lon_3"
                className="input-text"
                value={markers.length > 2 ? markers[2].lng : ""}
                readOnly
              />
            </div>
            <button
              style={{ color: "red", margin: "4%" }}
              onClick={(event) => handleMarkerDelete(2, event)}
            >
              Delete
            </button>
          </div>
          <div className="form-group">
            <div className="hello">
              <label>POINT - 4</label>
            </div>
            <div className="form-row form-row-1">
              <label>Latitude</label>
              <input
                type="text"
                name="lat_4"
                id="lat_4"
                className="input-text"
                value={markers.length > 3 ? markers[3].lat : ""}
                readOnly
              />
            </div>
            <div className="form-row form-row-1">
              <label>Longitude</label>
              <input
                type="text"
                name="lon_4"
                id="lon_4"
                className="input-text"
                value={markers.length > 3 ? markers[3].lat : ""}
                readOnly
              />
            </div>
            <button
              style={{ color: "red", margin: "4%" }}
              onClick={(event) => handleMarkerDelete(3, event)}
            >
              Delete
            </button>
          </div>
          <div className="form-row-last">
            <button className="btn btn-outline-dark btn-md">Proceed</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormMap;
