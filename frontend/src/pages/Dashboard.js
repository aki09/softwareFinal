import React from "react";

import { Container, Row, Col } from "react-bootstrap";

import ErrorList from "../components/errorlist";
import LiveMap from "../components/livemap";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";

import { user, drones } from "../components/dummydata";

const Dashboard = () => {
  return (
    <div>
      <Container fluid className="bg-light">
        <Row>
          <Topbar user={user} />
        </Row>
        <Row>
          <Col lg={4} md={4}>
            <Sidebar drones={drones} />
          </Col>
          <Col md={5}>
            <LiveMap />
          </Col>
          <Col md={3}>
            <ErrorList />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
