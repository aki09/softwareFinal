import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Container, Navbar, Nav, Button } from "react-bootstrap";

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const Allocation = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);
  }, []);
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
      ></div>
    </>
  );
};

export default Allocation;
