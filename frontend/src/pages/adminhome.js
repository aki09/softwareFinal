import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Table,
  Tab,
  Tabs,
} from "react-bootstrap";
import { RiAdminFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
const styles = {
  mainContent: {
    marginTop: "",
  },
};

const AdminHome = () => {
  const [admin, setAdmin] = useState([]);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [drones, setDrones] = useState([]);
  const [users, setusers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const cookieValue = location.state.cookieValue;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/adm/home", {
          params: { cookieValue: cookieValue },
        });
        document.cookie = `access_token=${cookieValue}`;
        const navbar = document.querySelector(".navbar");
        setNavbarHeight(navbar.offsetHeight);
        setAdmin(response.data.admin);
        setDrones(response.data.drones);
        setusers(response.data.users);

        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSignout=(event)=>{
    event.preventDefault();
    const url = "http://localhost:3000/adm/logout";
    const res = axios.post(url);
    document.cookie = 'access_token=';
    navigate('/pchia');
  }
  const cleaningDrones = drones.filter((drone) => drone.type === "cleaning");
  const inspectionDrones = drones.filter(
    (drone) => drone.type === "inspection"
  );
  const handleremoveuser = async (id, event) => {
    event.preventDefault();
    const url = "http://localhost:3000/adm/removeuser";
    const res = await axios.get(url, {
      params: { droneid: id },
    });
    if (res) {
      setDrones((prevDroneList) =>
        prevDroneList.map((drone) => {
          if (drone._id === id) {
            return {
              ...drone,
              userId: null,
            };
          }
          return drone;
        })
      );
    }
  };

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
              <Nav className="pt-2 pb-2">
                <Button variant="outline-secondary" className="ps-3 pe-3" onClick={(event) => handleSignout(event)}>
                  Sign Out
                </Button>
              </Nav>
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
        style={{ ...styles.mainContent, marginTop: `${navbarHeight + 30}px` }}
      >
        <div className="container fluid mb-3">
          <h2 style={{ fontWeight: "bold", color: "#2a265f" }}>
            Admin Dashboard
          </h2>
        </div>

        <Container>
          <Tabs defaultActiveKey="inspection" className="mb-3 mt-2">
            <Tab eventKey="inspection" title="Inspection">
              <div className="d-flex justify-content-center">
                <Table striped bordered hover className="m-5">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Drone Name</th>
                      <th>Drone Serial No.</th>
                      <th>Drone Battery</th>
                      <th>Drone User</th>
                      <th>Drone Allotment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionDrones.map((drone, index) => {
                      const user = users.find(
                        (user) => user._id === drone.userId
                      );
                      return (
                        <tr key={drone.id}>
                          <td>{index + 1}</td>
                          <td>Drone-{index + 1}</td>
                          <td>{drone.serial}</td>
                          <td>{drone.battery}</td>
                          <td>
                            {drone.userId ? (
                              <>
                                {user ? (
                                  <div>
                                    {user.userName},{user.company}
                                  </div>
                                ) : (
                                  "User does not exist"
                                )}
                              </>
                            ) : (
                              "free"
                            )}
                          </td>
                          <td>
                            {drone.userId ? (
                              <Link>
                                <Button
                                  variant="outline-dark"
                                  size="sm"
                                  onClick={(event) =>
                                    handleremoveuser(drone._id, event)
                                  }
                                >
                                  De-Allocate Drone
                                </Button>
                              </Link>
                            ) : (
                              <Link
                                to="/pchiaallocation"
                                state={{ id: drone._id }}
                              >
                                <Button variant="outline-dark" size="sm">
                                  Allocate Drone
                                </Button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Tab>
            <Tab eventKey="cleaning" title="Cleaning">
              <div className="d-flex justify-content-center">
                <Table striped bordered hover className="m-5">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Drone Name</th>
                      <th>Drone Serial No.</th>
                      <th>Drone Battery</th>
                      <th>Drone User</th>
                      <th>Drone Allotment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cleaningDrones.map((drone, index) => {
                      const user = users.find(
                        (user) => user._id === drone.userId
                      );
                      return (
                        <tr key={drone.id}>
                          <td>{index + 1}</td>
                          <td>Drone-{index + 1}</td>
                          <td>{drone.serial}</td>
                          <td>{drone.battery}</td>
                          <td>
                            {drone.userId ? (
                              <>
                                {user ? (
                                  <div>
                                    {user.userName},{user.company}
                                  </div>
                                ) : (
                                  "User does not exist"
                                )}
                              </>
                            ) : (
                              "free"
                            )}
                          </td>
                          <td>
                            {drone.userId ? (
                              <Link>
                                <Button
                                  variant="outline-dark"
                                  size="sm"
                                  onClick={(event) =>
                                    handleremoveuser(drone._id, event)
                                  }
                                >
                                  De-Allocate Drone
                                </Button>
                              </Link>
                            ) : (
                              <Link
                                to="/pchiaallocation"
                                state={{ id: drone._id }}
                              >
                                <Button variant="outline-dark" size="sm">
                                  Allocate Drone
                                </Button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </Container>
      </div>
    </>
  );
};

export default AdminHome;
