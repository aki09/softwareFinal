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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  let droneidno = 0;

  const errorDiv = Droneno.map((droneno, index) => {
    const tstamp = time[index];
    const now = new Date().getTime();
    const timeDiff = Math.floor((now - tstamp) / 1000);
    const minutes = Math.floor(timeDiff / 60);
    const seconds = timeDiff % 60;
    return (
      <>
        <li style={{ listStyle: "disc", color: "#2a265f" }} key={index}>
          <div
            className="d-flex justify-content-between row"
            style={{ color: "#333" }}
          >
            <div className="d-flex justify-content-between mb-3" key={index}>
              <span> Drone {droneno} spotted a Fault</span>
              <span className="ml-auto">
                {minutes}m {seconds}s ago
              </span>
            </div>
          </div>
        </li>
      </>
    );
  }).reverse();

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    socket.on("errorlist", (data) => {
      const error = data;
      droneidno = 0;
      for (let i = 0; i < drones.length; i++) {
        if (drones[i].type === "inspection") {
          droneidno++;
        }
        if (drones[i]._id == data.error.droneId) {
          setDroneno((prevdroneno) => [...prevdroneno, droneidno]);
          const tstamp = new Date(data.error.timestamps).getTime();
          setTime((prevtime) => [...prevtime, tstamp]);
          setError((preverror) => [...preverror, error]);
          break;
        }
      }

      function handleResize() {
        setWindowWidth(window.innerWidth);
      }

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    });
    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);
  }, []);
  return (
    <div
      style={{
        ...styles.mainContent,
        marginTop: `${windowWidth > 768 ? "25%" : "55%"}`,
        marginBottom: `${windowWidth > 768 ? "25%" : "15%"}`,
      }}
      className="d-flex justify-content-center"
    >
      <div
        style={{ width: "70%", overflowY: "scroll" }}
        className="pt-4 sidebarScroll"
      >
        <Card style={{ height: "500px" }}>
          <Card.Title
            className="ms-3 mt-3"
            style={{ fontWeight: "600", color: "#2a265f", fontSize: "25px" }}
          >
            ERROR LIST{" "}
          </Card.Title>
          <Card.Body>
            {error.length != 0 ? (
              <>
                <div style={{ color: "#333", textAlign: "right" }}>
                  {error.length} ERRORS FOUND
                </div>
                <ul>{errorDiv}</ul>
              </>
            ) : (
              <div style={{ color: "#333", textAlign: "right" }} className="">
                No errors found
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ErrorList;
