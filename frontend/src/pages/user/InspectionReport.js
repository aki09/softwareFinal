import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
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
import { useNavigate, Link } from "react-router-dom";
import { BiRefresh } from "react-icons/bi";
import Cookies from "js-cookie";
import { RiAdminFill } from "react-icons/ri";
import { Spinner } from "react-bootstrap";

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
  const [isLoadingreport, setIsLoadingreport] = useState(false);
  let cookie = Cookies.get("auth-token");
  const isLoggedIn = !!Cookies.get("auth-token");

  const navigate = useNavigate();

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

  useEffect(() => {
    const url =
      process.env.REACT_APP_SERVER +
      "/inspectionReport" +
      "?cache-bust=" +
      Date.now();
    if (cookie) {
      fetchData(url);
    } else {
      navigate("/");
    }
  }, [navigate]);



  const fetchData = async (url) => {
    setIsLoading(true);
    try {
      const navbar = document.querySelector(".navbar");
      setNavbarHeight(navbar.offsetHeight);
      const response = await axios.get(url, {
        params: { cookieValue: cookie },
      });
      setFiles(response.data.report);
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

  const handlereport = async () => {
    setIsLoadingreport(true);
    const url = process.env.REACT_APP_SERVER + "/generate";
    try {
      const response = await axios.post(url, { cookieValue: cookie });
      setFiles(response.data.report);
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoadingreport(false);
    }
  };

  if (!isLoggedIn) {
    navigate("/login");
  } else {
    return (
      <>
        {isLoading ? (
          <div
            className="loading d-flex justify-content-center align-items-center"
            style={{ marginTop: "25%" }}
          >
            <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
            />
            <h1>Loading...</h1>
          </div>
        ) : (
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
                  <div className="ms-5 me-5 d-flex flex-column justify-content-center align-items-center">
                    <h1 className="ms-5 pb-2" style={{ color: "#2a265f" }}>
                      POST INSPECTION REPORT
                    </h1>
                    <h5 className="ms-5" style={{ color: "#333" }}>
                      Detailed result of Thermal inspection and solar panel
                      cleaning
                    </h5>
                  </div>
                  <Container>
                    <div
                      className="d-flex justify-content-between container"
                      style={{ borderBottom: "1px solid #ccc" }}
                    >
                      <h2 className="ms-1 mt-5 me-5">All Reports</h2>
                      <a
                        className="mb-0 pb-0 mt-5"
                        style={{
                          cursor: "pointer",
                          fontSize: "28px",
                          color: "#2a265f",
                          textDecoration: "none",
                        }}
                        onClick={handlereport}
                      >
                        {isLoadingreport ? (
                          "Loading..."
                        ) : (
                          <BiRefresh className="mb-0 pb-0 mt-5" />
                        )}
                      </a>
                    </div>
                    {files.length ? (
                      <Row>
                        {files.slice().reverse().map((file, index) => (
                          <Col md={3} key={index} className="mt-4">
                            <Card className="text-center" variant="light">
                              <Card.Header className="bg-white text-#2a265f font-weight-bold">
                                <h5 className="my-2">Report {files.length - index}</h5>
                              </Card.Header>
                              <Card.Body>
                                <Button
                                  variant="outline-secondary"
                                  href={file.url}
                                >
                                  Download PDF
                                </Button>
                              </Card.Body>
                              <Card.Footer>
                                <small className="text-muted center">
                                  <em>{file.name}</em>
                                </small>
                              </Card.Footer>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "50vh" }}
                      >
                        <h4
                          style={{
                            color: "#2a265f",
                            fontSize: "36px",
                            fontWeight: "700",
                          }}
                        >
                          No Reports generated yet. Get your first inspection
                          Drone quickly.
                        </h4>
                      </div>
                    )}
                  </Container>
                </div>
              </div>
            </Container>
          </>
        )}
      </>
    );
  }
};

export default InspectionReport;
