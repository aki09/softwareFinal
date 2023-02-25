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
  const [Droneno, setDroneno] = useState([]);
  const [time, setTime] = useState([]);
  const [error, setError] = useState([]);
  let droneidno = 0;

  const errorDiv = Droneno.map((droneno, index) => (
    <>
      <li style={{ listStyle: "disc", color: "#2a265f" }} key={index}>
        <div
          className="d-flex justify-content-between row"
          style={{ color: "#333" }}
        >
          <div className="d-flex row" key={index}>
            <span> Drone {droneno} spotted a Fault</span>
            <span className="ml-auto">1s ago</span>
          </div>
        </div>
      </li>

      <br />
    </>
  )).reverse();

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    socket.on("errorlist", (data) => {
      const error = data;

      for (let i = 0; i < drones.length; i++) {
        if (drones[i].type === "inspection") {
          droneidno++;
        }
        if (drones[i]._id == data.error.droneId) {
          setDroneno((prevdroneno) => [...prevdroneno, droneidno]);
          const tstamp = new Date(data.error.timestamps).getTime();
          // const now = new Date().getTime();
          // const timeDiff = Math.floor((now - tstamp) / 1000);
          // const minutes = Math.floor(timeDiff / 60);
          // const seconds = timeDiff % 60;
          setTime((prevtime) => [...prevtime, tstamp]);
          setError((preverror) => [...preverror, error]);
          break;
        }
      }
    });
    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);
  }, []);
  return (
    <div
      style={{ ...styles.mainContent, marginTop: `${navbarHeight + 30}px` }}
      className="d-flex justify-content-center"
    >
      {console.log(error)}
      <div style={{ width: "70%" }} className="pt-4">
        <Card>
          <Card.Title
            className="ms-3 mt-3"
            style={{ fontWeight: "600", color: "#2a265f", fontSize: "25px" }}
          >
            ERROR LIST{" "}
          </Card.Title>
          <Card.Body>
            {error.length != 0 ? (
              <>
                <div style={{ color: "#333" }}>{error.length} ERRORS FOUND</div>
                <ul>{errorDiv}</ul>
              </>
            ) : (
              <div style={{ color: "#333" }}>No errors found</div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ErrorList;
