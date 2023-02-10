import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Container, Navbar, Card } from "react-bootstrap";

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const InspectionReport = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);
  }, []);

  return (
    <>
      <Navbar
        bg="light"
        expand="lg"
        fixed="top"
        className="navbar"
        style={{ borderBottom: "1px solid #ccc" }}
      >
        <Container>
          <Navbar.Brand>
            <img src={logo} alt="" height="50" width="160" />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end me-5">
            <Navbar.Text>
              <a
                href="/"
                className="text-bold"
                style={{
                  color: "#2a265f",
                  textDecoration: "none",
                  fontSize: "20px",
                }}
              >
                Home
              </a>
            </Navbar.Text>
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
            <div className="ms-5">
              <h2 className="ms-2 mt-5 me-5" style={{ borderBottom: "1px solid #ccc" }}>
                All Reports
              </h2>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default InspectionReport;
