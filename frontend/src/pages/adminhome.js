import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
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

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const AdminHome= () => {
    const [admin, setAdmin] = useState([]);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [drones, setDrones] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const cookieValue = location.state.cookieValue;
  
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get("http://localhost:3000/adm/home",{
            params: { cookieValue: cookieValue },
          });
          const navbar = document.querySelector(".navbar");
          setNavbarHeight(navbar.offsetHeight);
         setAdmin(response.data.admin);    
         setDrones(response.data.drones);

          setIsLoading(false);
        } catch (err) {
          setError(err);
          setIsLoading(false);
        }
      };
      fetchData();
    }, []);

    const cleaningDrones = drones.filter((drone) => drone.type === "cleaning");
    const inspectionDrones = drones.filter((drone) => drone.type === "inspection");
  
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
                      {inspectionDrones.map((drone, index) => (
                        <tr key={drone.id}>
                          <td>{index + 1}</td>
                          <td>Drone-{index + 1}</td>
                          <td>{drone.serial}</td>
                          <td>{drone.battery}</td>
                          <td>{drone.userId ? drone.userId : "free"}</td>
                          <td>
                            <Button variant="outline-dark" size="sm">
                              {drone.userId
                                ? "De-Allocate Drone"
                                : "Allocate Drone"}
                            </Button>
                          </td>
                        </tr>
                      ))}
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
                      {cleaningDrones.map((drone, index) => (
                        <tr key={drone.id}>
                          <td>{index + 1}</td>
                          <td>Drone-{index + 1}</td>
                          <td>{drone.serial}</td>
                          <td>{drone.battery}</td>
                          <td>{drone.userId ? drone.userId : "free"}</td>
                          <td>
                            <Button variant="outline-dark" size="sm">
                              {drone.userId
                                ? "De-Allocate Drone"
                                : "Allocate Drone"}
                            </Button>
                          </td>
                        </tr>
                      ))}
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

