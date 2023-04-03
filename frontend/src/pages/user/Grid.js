import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import "../../styles/Form/Form.css";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import logo from "../../assets/logo.png";
import { MdOutlineClear } from "react-icons/md";
import Cookies from "js-cookie";
import io from "socket.io-client";
import { RiAdminFill } from "react-icons/ri";


const styles = {
  mainContent: {
    marginTop: "",
  },
};

const FormMap = () => {
  const navigate = useNavigate();
  let cookie = Cookies.get("auth-token");
  const [navbarHeight, setNavbarHeight] = useState(0);
  const location = useLocation();
  let id;
  try {
    id = location.state.id;
  } catch {
    navigate("/login");
  }
  const [currentLocation, setCurrentLocation] = useState({});
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [markerObjs, setMarkerObjs] = useState([]);
  const [arrayDist, setarrayDist] = useState("");
  const [polygon, setPolygon] = useState(null);
  const isLoggedIn = !!Cookies.get("auth-token");

  const handleMapClick = (event) => {
    if (markers.length < 4) {
      const newMarker = { lat: event.lat, lng: event.lng };
      setMarkers([...markers, newMarker]);
      renderMarkers([...markers, newMarker]);
    }
  };

  const handleSignout = (event) => {
    event.preventDefault();
    const authToken = Cookies.get("auth-token");
    if (authToken) {
      Cookies.remove("auth-token");
      if (!Cookies.get("auth-token")) {
        navigate("/login");
      }
    }
  };

  const handleMarkerDelete = (index, event) => {
    event.preventDefault();
    const newMarkers = [...markers];
    const deletedMarker = newMarkers.splice(index, 1)[0];
    setMarkers(newMarkers);
    removePolygon();
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
    if (markers.length === 4) {
      const sortedMarkers = sortMarkersAnticlockwise(markers);
      const polygon = new window.google.maps.Polygon({
        paths: sortedMarkers,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: mapRef.current,
      });
      setPolygon(polygon);
    } else {
      setPolygon(null);
    }
  };

  function sortMarkersAnticlockwise(markers) {
    const centroid = markers.reduce(
      function (acc, curr) {
        return [acc[0] + curr.lat, acc[1] + curr.lng];
      },
      [0, 0]
    );
    centroid[0] /= markers.length;
    centroid[1] /= markers.length;
    const sortedMarkers = markers.sort(function (a, b) {
      const angleA = Math.atan2(a.lng - centroid[1], a.lat - centroid[0]);
      const angleB = Math.atan2(b.lng - centroid[1], b.lat - centroid[0]);
      return angleA - angleB;
    });

    return sortedMarkers;
  }

  const handledistanceChange = ({ currentTarget: input }) => {
    const { value } = input;
    setarrayDist(value);
  };

  const removeMarkers = () => {
    markerObjs.forEach((marker) => {
      marker.setMap(null);
    });
    setMarkerObjs([]);
  };

  const removePolygon = () => {
    if (polygon) {
      polygon.setMap(null);
      setPolygon(null);
    }
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
  const handlemarkerset = (id, event) => {
    event.preventDefault();
    if (markers.length < 4) {
      setError("Please Select all the 4 points");
      return 0;
    }
    if (arrayDist.length == 0) {
      console.log("helo");
      setError("Please Enter the distance between arrays");
      return 0;
    }
    if (arrayDist < 1) {
      setError("Distance between arrays cannot be less than 1");
      return;
    }
    if ((markers.length == 4) & (arrayDist != "")) {
      const url = process.env.REACT_APP_SERVER + "/form";
      const res = axios.post(url, {
        id: id,
        markers: markers,
        arrayDist: arrayDist,
      });
      navigate("/home");
    }
  };

  useEffect(() => {
    fetchlocation();
    if (cookie) {
      fetchData();
    } else {
      navigate("/login");
    }
    const socket = io("http://localhost:3000", {
      transports: ["websocket", "polling", "flashsocket"],
    });
  }, [cookie, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const navbar = document.querySelector(".navbar");
      setNavbarHeight(navbar.offsetHeight);
      const response = await axios.get(
        process.env.REACT_APP_SERVER + "/form",
        {
          params: { cookieValue: cookie, droneid: id },
        }
      );
      setIsLoading(false);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        navigate("/login");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
    setIsLoading(false);
  };

  if (!isLoggedIn) {
    navigate("/login");
  } else {
    return (
      <>
        <Navbar expand="lg" fixed="top" className="navbar bg-light">
          <Container>
            <Navbar.Brand>
              <Link to="/home">
                <img src={logo} alt="" height="50" width="160" />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-end"
            >
              <Nav className="mr-auto">
              <div className="pt-1 pb-2">
                <Link to="/home">
                  <Button
                    variant="outline-secondary"
                    size="md"
                    className="ps-3 pe-3 me-1"
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>
              <div className="pt-1 pb-2">
                <Button
                  variant="outline-secondary"
                  size="md"
                  onClick={(event) => handleSignout(event)}
                  className="ps-3 pe-3 me-1"
                >
                  Sign Out
                </Button>
              </div>

              <Nav.Link>
                <RiAdminFill
                  style={{ fontSize: "36px" }}
                  className="ms-3"
                  color="#2a265f"
                />
              </Nav.Link>
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
                  center={{
                    lat: currentLocation.lat,
                    lng: currentLocation.lng,
                  }}
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
                    required
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
                    required
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    style={{ borderRadius: "50%" }}
                    onClick={(event) => handleMarkerDelete(0, event)}
                    className="m-2 btn btn-outline-danger"
                  >
                    <MdOutlineClear fontSize={13} />
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
                    onClick={(event) => handleMarkerDelete(1, event)}
                    className="m-2 btn btn-outline-danger"
                  >
                    <MdOutlineClear fontSize={13} />
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
                    onClick={(event) => handleMarkerDelete(2, event)}
                    className="m-2 btn btn-outline-danger"
                  >
                    <MdOutlineClear fontSize={13} />
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
                    required
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
                    required
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    style={{ borderRadius: "50%" }}
                    onClick={(event) => handleMarkerDelete(3, event)}
                    className="m-2 btn btn-outline-danger"
                  >
                    <MdOutlineClear fontSize={13} />
                  </button>
                </div>
              </div>
              <div className="form-group form-row ">
                <label
                  style={{
                    marginLeft:"100px",
                    marginRight: "50px",
                    fontSize: "1.1rem",
                    justifyContent: "center",
                  }}
                >
                  Distance between Arrays in metres
                </label>
                <div>
                  <input
                    type="number"
                    name="arrayDist"
                    className="input-text"
                    style={{ width: "80px" }}
                    min="1"
                    onChange={handledistanceChange}
                    value={arrayDist}
                    required
                  />
                </div>
              </div>
              {error && (
                    <div className="medium d-flex text-danger justify-content-center text-3xl" role="alert">
                      {error}
                    </div>
                  )}
              <div className="form-row-last d-flex justify-content-center mt-3">
                <button
                  className="btn btn-outline-dark btn-lg"
                  onClick={(event) => handlemarkerset(id, event)}
                >
                  Proceed
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
};

export default FormMap;
