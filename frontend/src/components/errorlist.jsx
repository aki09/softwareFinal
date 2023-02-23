import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import io from "socket.io-client";

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const ErrorList = ({ drones }) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const[ErrorList,serErrorList]=useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    socket.on("errorlist", (data) => {
      const error  = data;
      serErrorList([...ErrorList,error]);
    });
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
