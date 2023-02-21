import React from "react";
import logo from "../assets/logo.png";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { RiAdminFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const Topbar = ({ user }) => {
  return (
    <>
      <Navbar bg="light" expand="lg" fixed="top" className="navbar">
        <Container>
          <Navbar.Brand>
            <img src={logo} alt="" height="50" width="160" />
          </Navbar.Brand>

          <Navbar.Text>
            <div className="ms-4">
              <h1>
                Greetings,{" "}
                <span style={{ color: "#2a265f" }}>{user.company}</span>
              </h1>
              <h6>Your Performance Report</h6>
            </div>
          </Navbar.Text>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="mr-auto">
              {/* <ButtonGroup> */}
              <Link to="/report">
                <Button variant="outline-secondary" size="md" className="me-1" >
                  Inspection Reports
                </Button>
              </Link>
                <Button variant="outline-secondary" size="md">
                  Sign Out
                </Button>
              {/* </ButtonGroup> */}
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
