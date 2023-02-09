import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const ErrorList = ({ drones }) => {
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
      <div style={{ width: "70%" }} className="pt-4">
        <Card>
          <Card.Title className="ms-3 mt-3">ERROR LIST</Card.Title>
          <Card.Body>

          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ErrorList;
