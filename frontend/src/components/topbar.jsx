import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { RiAdminFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Topbar = ({ user }) => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTake = (event) => {
    event.preventDefault();
    const url = "http://localhost:3000/set";
    const res = axios.post(url, {
      droneid: "63d9138e870ba132c5d20aa6",
      userid: "6156272d93d079ba45eab3af",
      eror: "fault",
    });
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

  return (
    <>
      <Navbar bg="light" expand="lg" fixed="top" className="navbar">
        <Container>
          <Navbar.Brand>
            <Link to="/home">
              <img src={logo} alt="" height="50" width="160" />
            </Link>
          </Navbar.Brand>

          {windowWidth > 768 && (
            <Navbar.Text>
              <div className="ms-4">
                <h1>
                  Greetings,{" "}
                  <span style={{ color: "#2a265f" }}>{user.company}</span>
                </h1>
              </div>
            </Navbar.Text>
          )}

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse
            id="basic-navbar-nav"
            className={windowWidth > 768 ? "justify-content-end" : ""}
          >
            <Nav className="mr-auto">
              <div className="pt-1 pb-2">
                <Link to="/report">
                  <Button
                    variant="outline-secondary"
                    size="md"
                    className="ps-3 pe-3 me-1"
                  >
                    Inspection Reports
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
    </>
  );
};

export default Topbar;
