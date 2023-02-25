import React, { useState, useEffect } from "react";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { FaBroom, FaCamera } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import { CgCircleci } from "react-icons/cg";
import { Button, ListGroup, Card } from "react-bootstrap";
import BatteryGauge from "react-battery-gauge";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import axios from "axios";

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const Sidebar = ({ drones }) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [droneList, setDroneList] = useState(drones);
  const [showCleaning, setShowCleaning] = useState(false);
  const [showInspection, setShowInspection] = useState(true);

  const cleaningDroneList = droneList.filter(
    (drone) => drone.type === "cleaning"
  );
  const inspectionDroneList = droneList.filter(
    (drone) => drone.type === "inspection"
  );

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    socket.on("battery", (data) => {
      const { id, battery } = data;
      const batteryIndex = drones.findIndex((drone) => drone._id === id);
      if (batteryIndex === -1) return;
      handleBattery(id, battery);
    });

    socket.on("takeoff", (data) => {
      const { id, takeoff } = data;
      const batteryIndex = drones.findIndex((drone) => drone._id === id);
      if (batteryIndex === -1) return;
      handletakeoff(id, takeoff);
    });

    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);
  }, []);

  const filteredDrones = droneList.filter((drone) => {
    if (drone.type === "cleaning" && showCleaning) {
      return true;
    } else if (drone.type === "inspection" && showInspection) {
      return true;
    }
    return false;
  });

  const handleType = () => {
    setShowCleaning((prevShowCleaning) => !prevShowCleaning);
    setShowInspection((prevShowInspection) => !prevShowInspection);
  };

  const handleTakeoffStatus = async (id) => {
    const url = "http://localhost:3000/settakeoff";
    const res = await axios.get(url, {
      params: { droneid: id },
    });
  };

  const handleBattery = (id, battery) => {
    setDroneList((prevDroneList) =>
      prevDroneList.map((drone) => {
        if (drone._id === id) {
          return {
            ...drone,
            battery: battery,
          };
        }
        return drone;
      })
    );
  };
  const handletakeoff = (id, takeoff) => {
    setDroneList((prevDroneList) =>
      prevDroneList.map((drone) => {
        if (drone._id === id) {
          return {
            ...drone,
            takeOffStatus: takeoff,
          };
        }
        return drone;
      })
    );
  };

  // const showVideoFeed = (id) => {
  //   setDroneList((prevDroneList) =>
  //     prevDroneList.map((drone) => {
  //       if (drone.id === id) {
  //         return {
  //           ...drone,
  //           videoStreamStatus: !drone.videoStreamStatus,
  //         };
  //       }
  //     })
  //   );
  // };

  return (
    <>
      <div
        style={{ ...styles.mainContent, marginTop: `${navbarHeight}px` }}
        className="d-flex justify-content-center sidebar pt-2"
      >
        <div className="bg-light " style={{ height: "100vh", width: "40vw" }}>
          {/* <h3
            style={{ color: "#333" }}
            className="d-flex justify-content-center"
          >
            DRONES
          </h3> */}
          {/* <div className="d-flex justify-content-center mt-2">
            <BootstrapSwitchButton
              checked={true}
              onlabel={<FaCamera fontSize={20} />}
              offlabel={<FaBroom />}
              onChange={handleType}
              onstyle="outline-info"
              offstyle="outline-primary"
              width={100}
            />
          </div> */}

          {cleaningDroneList.length !== 0 ? (
            <>
              <div className="d-flex justify-content-center mt-2">
                <BootstrapSwitchButton
                  checked={true}
                  onlabel={<FaCamera fontSize={20} />}
                  offlabel={<FaBroom />}
                  onChange={handleType}
                  onstyle="outline-info"
                  offstyle="outline-primary"
                  width={100}
                />
              </div>
              <div className="pt-3">
                {filteredDrones.map((drone, i) => (
                  <div key={drone._id}>
                    <ListGroup>
                      <Card
                        className="m-2 pt-3 pb-3"
                        style={{ boxShadow: "0 0 10px #ccc" }}
                        variant="light"
                      >
                        <Card.Body>
                          <Card.Subtitle
                            className="d-flex justify-content-start"
                            style={{ color: "black" }}
                          >
                            {drone.type === "cleaning" ? (
                              <CgCircleci
                                className="me-2 mt-1"
                                fontSize="11px"
                                style={{ color: drone.color }}
                              />
                            ) : (
                              <BsCircleFill
                                className="me-2 mt-1"
                                fontSize="11px"
                                style={{ color: drone.color }}
                              />
                            )}

                            {drone.name}
                          </Card.Subtitle>
                          <Card.Text className="battery-gauge d-flex justify-content-end">
                            <BatteryGauge
                              value={filteredDrones[i].battery}
                              size={45}
                            />
                          </Card.Text>
                          <div className="m-auto">
                            {drone.takeOffStatus ? (
                              <Button
                                variant="outline-dark"
                                size="sm"
                                className="me-1 mb-0"
                                onClick={() => handleTakeoffStatus(drone._id)}
                                style={{ width: "90%" }}
                              >
                                Land
                              </Button>
                            ) : (
                              <Link to="/grid" state={{ id: drone._id }}>
                                <Button
                                  variant="outline-dark"
                                  size="sm"
                                  className="me-1 mb-0"
                                  style={{ width: "90%" }}
                                >
                                  TakeOff
                                </Button>
                              </Link>
                            )}

                            <Button
                              variant="dark"
                              size="sm"
                              className="mt-1 mb-0"
                              style={{ width: "90%" }}
                            >
                              Show Live Feed
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </ListGroup>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-center mt-2">
                <BootstrapSwitchButton
                  checked={true}
                  onlabel={<FaCamera fontSize={20} />}
                  offlabel={<FaBroom />}
                  onChange={handleType}
                  onstyle="outline-info"
                  offstyle="outline-primary"
                  width={100}
                />
              </div>
              <div className="pt-3">
                {showInspection &&
                  inspectionDroneList.map((drone, i) => (
                    <div key={drone._id}>
                      <ListGroup>
                        <Card
                          className="m-2 pt-3 pb-3"
                          style={{ boxShadow: "0 0 10px #ccc" }}
                          variant="light"
                        >
                          <Card.Body>
                            <Card.Subtitle
                              className="d-flex justify-content-start"
                              style={{ color: "black" }}
                            >
                              <BsCircleFill
                                className="me-2 mt-1"
                                fontSize="11px"
                                style={{ color: drone.color }}
                              />

                              {drone.name}
                            </Card.Subtitle>
                            <Card.Text className="battery-gauge d-flex justify-content-end">
                              <BatteryGauge
                                value={filteredDrones[i].battery}
                                size={45}
                              />
                            </Card.Text>
                            <div className="m-auto">
                              {drone.takeOffStatus ? (
                                <Button
                                  variant="outline-dark"
                                  size="sm"
                                  className="me-1 mb-0"
                                  onClick={() => handleTakeoffStatus(drone._id)}
                                  style={{ width: "90%" }}
                                >
                                  Land
                                </Button>
                              ) : (
                                <Link to="/grid" state={{ id: drone._id }}>
                                  <Button
                                    variant="outline-dark"
                                    size="sm"
                                    className="me-1 mb-0"
                                    style={{ width: "90%" }}
                                  >
                                    TakeOff
                                  </Button>
                                </Link>
                              )}

                              <Button
                                variant="dark"
                                size="sm"
                                className="mt-1 mb-0"
                                style={{ width: "90%" }}
                              >
                                Show Live Feed
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </ListGroup>
                    </div>
                  ))}
              </div>
              {showCleaning && (
                <>
                  <Card
                    className="m-2 pt-3 pb-3"
                    style={{ boxShadow: "0 0 10px #ccc" }}
                    variant="light"
                  >
                    <Card.Body>
                      <Card.Title style={{ fontWeight: "500" }}>
                        No Cleaning Drones
                      </Card.Title>
                      <Card.Text>
                        Switch the above button to switch to see inspection
                        drones
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </>
              )}
            </>
          )}

          {/* <ul>
            {filteredDrones.map((drone) => (
              <li key={drone.id}>
                <button onClick={() => handleTakeoffStatus(drone.id)}>
                  Toggle Takeoff Status
                </button>
                <p>ID: {drone.id}</p>
                <p>Type: {drone.type}</p>
                <p>Battery: {drone.battery}</p>
                <p>
                  Takeoff Status: {drone.takeoffStatus ? "Land" : "Takeoff"}
                </p>
                <p>Serial Number: {drone.serial}</p>
                <p>
                  Location: ({drone.location.lat}, {drone.location.lon})
                </p>
              </li>
            ))}
          </ul> */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;