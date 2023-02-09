import React from "react";

import { Container, Row, Col } from "react-bootstrap";

import ErrorList from "../components/errorlist";
import LiveMap from "../components/livemap";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";

import { user, drones } from "../components/dummydata";

const Dashboard = () => {
  return drones.length ? (
    <div>
      <Container fluid className="bg-light">
        <Row>
          <Topbar user={user} />
        </Row>
        <Row>
          <Col md={3} className="justify-content-center">
            <Sidebar drones={drones} />
          </Col>
          <Col md={5}>
            <LiveMap />
          </Col>
          <Col md={4}>
            <ErrorList drones={drones} />
          </Col>
        </Row>
      </Container>
    </div>
  ) : (
    <Container fluid className="bg-light">
      <Row>
        <Topbar user={user} />
      </Row>
      <Row className="d-flex justify-content-center">
        <h4 style={{color: "#2a265f"}}>Flynovate</h4>
        <p className="text-dark">
          Please contact FLYNOVATE team for your DRONE requirements.
        </p>
      </Row>
    </Container>
  );
};

export default Dashboard;
