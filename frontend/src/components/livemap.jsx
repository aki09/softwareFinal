import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";

import map from "../assets/map.jpeg";

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const LiveMap = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);
  }, []);

  return (
    <div
      style={{ ...styles.mainContent, marginTop: `${navbarHeight}px` }}
      className="d-flex justify-content-center"
    >
      <div style={{ width: "100%" }} className="pt-4">
        <Card>
          <Card.Title className="ms-3 mt-3">
            LIVE MAP
          </Card.Title>
          <Card.Body>
            <Card.Text className="text-secondary">
              Location of all drones appears here in real time
            </Card.Text>
            <Card.Img src={map} alt="map" />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default LiveMap;
