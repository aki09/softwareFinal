import React,{ useEffect } from "react";
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

const Topbar = ({ user }) => {
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const onPopState = () => {
    window.history.pushState(null, null, window.location.pathname);
  };
  const navigate = useNavigate();

  const handleTake=(event)=>{
    event.preventDefault();
    const url = "http://localhost:3000/set";
    const res = axios.post(url, {
         droneid:"63d9138e870ba132c5d20aa6",
         userid:"6156272d93d079ba45eab3af",
         eror:"fault"
      });
  }
  const handleSignout=(event)=>{
    event.preventDefault();
    const url = "http://localhost:3000/logout";
    const res = axios.post(url);
    document.cookie = 'access_token=';
    // navigate('/login', { replace: true });
    window.location.replace('/login');
  }
  
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
                <Button variant="outline-secondary" size="md" className="me-1">
                  Inspection Reports
                </Button>
              </Link>
              {/* <Link> */}
                <Button variant="outline-secondary" size="md" onClick={(event) => handleSignout(event)}>
                  Sign Out
                </Button>
              {/* </Link> */}

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
