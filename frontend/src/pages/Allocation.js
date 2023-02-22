import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Card,
  Dropdown,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const Allocation = () => {
  const location = useLocation();
  const { id } = location.state;
  const navigate = useNavigate();
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [drone, setDrone] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const user = users.find((user) => user._id === selectedItem);
  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/adm/adduser", {
          params: { cookieValue: cookieValue, droneid: id },
        });
        setUsers(response.data.users);
        setDrone(response.data.drone);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    fetchData();
    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);
  }, []);
  const handleadduser = async (id, droneid, event) => {
    event.preventDefault();
    const url = "http://localhost:3000/adm/allotdrone";
    const res = await axios.get(url, {
      params: { userid: id, droneid: droneid },
    });
    if (res) {
      navigate("/pchiahome", {
        state: { cookieValue: cookieValue },
      });
    }
  };
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];
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
            
            <div className="mt-3 d-flex justify-content-center">
              <h3>User Name: {user.userName} </h3>
              <h3 className="ms-4">Company Name: {user.company}</h3>
            </div>
          ) : (
            <></>
          )}
        </Container>
      </div>
    </>
  );
};

export default Allocation;
