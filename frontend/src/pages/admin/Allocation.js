import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Card,
  Dropdown,
  Overlay,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const Allocation = () => {
  const navigate = useNavigate();
  let cookie = Cookies.get("admin-auth-token");
  const [navbarHeight, setNavbarHeight] = useState(0);
  const location = useLocation();
  let id;
  try {
    id = location.state.id;
  } catch {
    navigate("/pchia");
  }
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [drone, setDrone] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const user = users.find((user) => user._id === selectedItem);
  const [showOverlay, setShowOverlay] = useState(false);
  const isLoggedIn = !!Cookies.get("admin-auth-token");

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
    setShowOverlay(true);
  };

  const handleOverlay = () => {
    setShowOverlay(false);
  };

  useEffect(() => {
    let isLoggedInUser = !!Cookies.get('auth-token');
    if(isLoggedInUser){
        navigate("/home");
    }
    if (cookie) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [cookie, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const navbar = document.querySelector(".navbar");
      setNavbarHeight(navbar.offsetHeight);
      const response = await axios.get(process.env.REACT_APP_SERVER+"/adm/adduser", {
        params: { cookieValue: cookie, droneid: id },
      });
      setUsers(response.data.users);
      setDrone(response.data.drone);
      setIsLoading(false);
    } catch (err) {
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

  const handleadduser = async (id, droneid, event) => {
    event.preventDefault();
    const url = process.env.REACT_APP_SERVER+"/adm/allotdrone";
    const res = await axios.get(url, {
      params: { userid: id, droneid: droneid },
    });
    if (res) {
      navigate("/pchiahome");
    }
  };
  
  const handleSignout=(event)=>{
    event.preventDefault();
    const authToken = Cookies.get("admin-auth-token");
    if (authToken) {
      Cookies.remove("admin-auth-token");
      if (!Cookies.get("admin-auth-token")) {
        navigate("/pchia");
      }
    }
  }

  return (
    <>
      <Navbar expand="lg" fixed="top" className="navbar">
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
              <Button
                variant="outline-secondary"
                size="md"
                className="me-1"
                onClick={() => navigate(-1)}
              >
                Dashboard
              </Button>
              <Button variant="outline-secondary" size="md" onClick={(event) => handleSignout(event)}>
                Sign Out
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div
        style={{ ...styles.mainContent, marginTop: `${navbarHeight + 30}px` }}
      >
        <div className="container fluid mb-3">
          <h2 style={{ fontWeight: "bold", color: "#2a265f" }}>
            Admin Dashboard
          </h2>
        </div>

        <Container>
          <Card className="d-block">
            <Card.Header>Allocate a Drone</Card.Header>
            <Card.Body>
              <h5 className="d-flex">
                Drone Serial No: <div className="ps-3">{drone.serial}</div>
              </h5>
              <h5>
                Drone Type: <span className="ps-3">{drone.type}</span>
              </h5>
              <h5>
                Drone Battery: <span className="ps-3">{drone.battery}%</span>{" "}
              </h5>
            </Card.Body>
          </Card>

          <div
            className="d-flex flex-col justify-content-center"
            style={{ marginTop: "30px" }}
          >
            <h3 className="pt-1 me-3">Select a user: </h3>
            <div className="ps-2">
              <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {selectedItem ? `${selectedItem}` : "Select a User"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {users.map((user, index) => (
                    <Dropdown.Item key={index} eventKey={user._id}>
                      {user.userName},{user.company}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="ms-5">
              <Button
                variant="outline-secondary"
                onClick={(event) => handleadduser(selectedItem, id, event)}
              >
                Allocate
              </Button>
            </div>
          </div>
          {selectedItem ? (
            <>
              <Overlay
                show={showOverlay}
                placement="bottom"
                target={() => document.getElementById("dropdown-basic")}
                onHide={handleOverlay}
              >
                <div className="mt-3 bg-dark text-light p-4 text-center" style={{borderRadius:"20px"}}>
                  <h5>User Name: {user.userName} </h5>
                  <h5>Company Name: {user.company}</h5>
                </div>
              </Overlay>
            </>
          ) : (
            <></>
          )}
        </Container>
      </div>
    </>
  );
};

export default Allocation;
