import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { RiAdminFill } from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Cookies from "js-cookie";
import axios from "axios";
import { Spinner } from "react-bootstrap";

const UserProfile = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
            <Navbar expand="lg" fixed="top" className="navbar bg-light mt-3">
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
            <div className="container"></div>
          </>
        )}
      </>
    );
  }
};

export default UserProfile;
