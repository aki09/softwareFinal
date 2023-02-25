import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import {
  Container,
  Navbar,
  Card,
  Row,
  Col,
  Button,
  Nav,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiRefresh } from "react-icons/bi";

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const InspectionReport = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();
  const handleSignout=(event)=>{
    event.preventDefault();
    const url = "http://localhost:3000/logout";
    const res =axios.post(url);
    document.cookie = 'access_token=';
    navigate('/login', { replace: true });
  }

  useEffect(() => {

    const fetchData = async() => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/inspectionReport",
          {
            params: { cookieValue: cookieValue },
          }
        );
        setFiles(response.data.report);
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

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  return (
    <>
      <Navbar expand="lg" fixed="top" className="navbar bg-light mt-3">
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
      <Container fluid className="bg-light">
        <div
          style={{
            ...styles.mainContent,
            marginTop: `${navbarHeight}px`,
            height: "100vh",
          }}
          className="pt-5"
        >
          <div className="ms-5 me-5">
            <div className="ms-5 me-5">
              <h1 className="ms-2 pb-2" style={{ color: "#2a265f" }}>
                POST INSPECTION REPORT
              </h1>
              <h5 className="ms-2" style={{ color: "#333" }}>
                Detailed result of Thermal inspection and solar panel cleaning
              </h5>
            </div>
            <Container>
              <div
                className="d-flex justify-content-between container"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <h2 className="ms-2 mt-5 me-5">All Reports</h2>
                <a style={{ cursor: "pointer", fontSize: "43px", color: "#2a265f" }}>
                  <BiRefresh className="mb-0 pb-0 mt-5" />
                </a>
              </div>
              <Row>
                {files.map((file, index) => (
                  <Col md={3} key={index} className="mt-4">
                    <Card variant="light">
                      <Card.Body>
                        <Button variant="outline-secondary" href={file}>
                          Download PDF
                        </Button>
                      </Card.Body>
                      <Card.Footer>
                        <small className="text-muted">Report-{index + 1}</small>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
        </div>
      </Container>
    </>
  );
};

export default InspectionReport;
