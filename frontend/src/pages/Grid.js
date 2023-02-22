import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import "../styles/Form/Form.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import logo from "../assets/logo.png";
import { AiFillDelete } from "react-icons/ai";

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const FormMap = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const location = useLocation();
  const { id } = location.state;
  const [currentLocation, setCurrentLocation] = useState({});
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [markerObjs, setMarkerObjs] = useState([]);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);
  }, []);

  const handleMapClick = (event) => {
    if (markers.length < 4) {
      const newMarker = { lat: event.lat, lng: event.lng };
      setMarkers([...markers, newMarker]);
      renderMarkers([...markers, newMarker]);
    }
  };

  const handleMarkerDelete = (index, event) => {
    event.preventDefault();
    const newMarkers = [...markers];
    const deletedMarker = newMarkers.splice(index, 1)[0];
    setMarkers(newMarkers);
    removeMarkers();
    renderMarkers(newMarkers);
  };

  const renderMarkers = (markers) => {
    const newMarkerObjs = markers.map((marker) => {
      return new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: mapRef.current,
      });
    });
    setMarkerObjs([...markerObjs, ...newMarkerObjs]);
  };

  const removeMarkers = () => {
    markerObjs.forEach((marker) => {
      marker.setMap(null);
    });
    setMarkerObjs([]);
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

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/form", {
          params: { cookieValue: cookieValue, droneid: id },
        });
        console.log(response.data);
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
    <>
      <Navbar expand="lg" fixed="top" className="navbar bg-light">
        <Container>
          <Navbar.Brand>
            <img src={logo} alt="" height="50" width="160" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="mr-auto">
              <Button variant="outline-secondary" size="md" className="me-1">
                Dashboard
              </Button>
              <Button variant="outline-secondary" size="md">
                Sign Out
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div
        className="page-content"
        style={{ ...styles.mainContent, marginTop: `${navbarHeight + 30}px` }}
      >
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
              <div className="d-flex justify-content-center align-items-center">
                <button
                  style={{ borderRadius: "50%" }}
                  onClick={(event) => handleMarkerDelete(0, event)}
                  className="m-2 btn btn-outline-danger"
                >
                  <AiFillDelete fontSize={20} />
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
              <div className="d-flex justify-content-center align-items-center">
                <button
                  style={{ borderRadius: "50%" }}
                  onClick={(event) => handleMarkerDelete(0, event)}
                  className="m-2 btn btn-outline-danger"
                >
                  <AiFillDelete fontSize={20} />
                </button>
              </div>
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
              <div className="d-flex justify-content-center align-items-center">
                <button
                  style={{ borderRadius: "50%" }}
                  onClick={(event) => handleMarkerDelete(0, event)}
                  className="m-2 btn btn-outline-danger"
                >
                  <AiFillDelete fontSize={20} />
                </button>
              </div>
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
              <div className="d-flex justify-content-center align-items-center">
                <button
                  style={{ borderRadius: "50%" }}
                  onClick={(event) => handleMarkerDelete(0, event)}
                  className="m-2 btn btn-outline-danger"
                >
                  <AiFillDelete fontSize={20} />
                </button>
              </div>
            </div>
            <div className="form-row-last">
              <button className="btn btn-outline-dark btn-md">Proceed</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormMap;
