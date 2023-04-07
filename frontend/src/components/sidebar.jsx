import React, { useState, useEffect } from "react";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { FaBroom, FaCamera } from "react-icons/fa";
import { AiOutlineDustbin } from "react-icons/ai";
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

const Sidebar = ({
  user,
  drones,
  showVideoFeed,
  setShowVideoFeed,
  updateVideoUrl,
}) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [droneList, setDroneList] = useState(drones);
  const [showCleaning, setShowCleaning] = useState(false);
  const [showInspection, setShowInspection] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // const [showVideoFeed, setShowVideoFeed] = useState(false);

  const cleaningDroneList = droneList.filter(
    (drone) => drone.type === "cleaning"
  );

  const inspectionDroneList = droneList.filter(
    (drone) => drone.type === "inspection"
  );

  const showScrollbar =
    cleaningDroneList.length > 3 || inspectionDroneList.length > 3;

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER, {
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

    // socket.on("videoStreamStatus", (data) => {
    //   const { id, videoStreamStatus } = data;
    //   const batteryIndex = drones.findIndex((drone) => drone._id === id);
    //   if (batteryIndex === -1) return;
    //   handleVideoStreamstatus(id, videoStreamStatus);
    // });

    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);

    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
    const url = process.env.REACT_APP_SERVER + "/settakeoff";
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
  // const handleVideoStreamstatus = (id, videoStreamStatus) => {
  //   setDroneList((prevDroneList) =>
  //     prevDroneList.map((drone) => {
  //       if (drone._id === id) {
  //         return {
  //           ...drone,
  //           videoStreamStatus: videoStreamStatus,
  //         };
  //       }
  //       return drone;
  //     })
  //   );
  // };

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

  const handleShowLiveFeed = (serialID) => {
    const semiurl = process.env.REACT_APP_DRONEURL;
    const videourl = semiurl + "/" + serialID;
    const url = "https://www.youtube.com/embed/UTMh-_wh1xE";
    setShowVideoFeed(true);
    updateVideoUrl(url);

    // const newWindow = window.open('', '_blank');
    // newWindow.document.write(`
    //   <html>
    //     <head>
    //       <title>Live Feed</title>
    //     </head>
    //     <body>
    //       <iframe src="${url}" style="width:70%; height:70%; border:none;" autoplay></iframe>
    //     </body>
    //   </html>
    // `);
  };

  return (
    <>
      <div
        style={{
          ...styles.mainContent,
          marginTop: `${navbarHeight}px`,
          overflowY: showScrollbar ? "scroll" : "hidden",
          width: `${windowWidth > 768 ? "" : "80vw"}`,
        }}
        className={`${
          windowWidth > 768 ? "pt-2" : ""
        } d-flex justify-content-center sidebar `}
      >
        <div
          className="bg-light "
          style={{ width: `${windowWidth > 768 ? "" : "100vw"}` }}
        >
          {cleaningDroneList.length !== 0 ? (
            <>
              {windowWidth > 768 ? (
                <div
                  className="pt-2 bg-light"
                  style={{
                    position: "fixed",
                    top: `${navbarHeight}px`,
                    zIndex: 1,
                    width: "20%",
                    paddingLeft: "7vw",
                    paddingBottom: "2vh",
                  }}
                >
                  <BootstrapSwitchButton
                    checked={showInspection}
                    onlabel={<FaCamera />}
                    offlabel={
                      <img
                        width="35%"
                        src="data:image/png;base64,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"
                      />
                    }
                    onChange={handleType}
                    onstyle="outline-primary"
                    offstyle="outline-primary"
                    width={100}
                  />
                </div>
              ) : (
                <>
                  <div
                    className={` bg-light`}
                    style={{
                      position: "fixed",
                      top: `${navbarHeight}px`,
                      zIndex: 1,
                      width: "100%",
                      paddingLeft: "7vw",
                      paddingBottom: "2vh",
                    }}
                  >
                    <div className="ms-4">
                      <h1>
                        Greetings,{" "}
                        <span style={{ color: "#2a265f" }}>{user.company}</span>
                      </h1>

                      <BootstrapSwitchButton
                        checked={showInspection}
                        onlabel={<FaCamera />}
                        offlabel={
                          <img
                            width="35%"
                            src="data:image/png;base64,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"
                          />
                        }
                        onChange={handleType}
                        onstyle="outline-primary"
                        offstyle="outline-primary"
                        width={100}
                      />
                    </div>
                  </div>
                </>
              )}
              <div
                style={{ marginTop: `${windowWidth > 768 ? "30%" : "30%"}` }}
                className="container"
              >
                {filteredDrones.map((drone, i) => (
                  <div key={drone._id}>
                    <Card
                      className="mt-3 pt-3 pb-3 ms-4 mb-3"
                      style={{
                        boxShadow: "0 0 10px #ccc",
                        width: `${windowWidth > 768 ? "95%" : "50%"}`,
                      }}
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
                          {drone.takeOffStatus ? (
                            <Button
                              variant="dark"
                              size="sm"
                              className="mt-1 mb-0"
                              style={{ width: "90%" }}
                              onClick={() => handleShowLiveFeed(drone._id)}
                            >
                              Show Live Feed
                            </Button>
                          ) : (
                            <Button
                              variant="dark"
                              size="sm"
                              className="mt-1 mb-0"
                              style={{ width: "90%" }}
                            >
                              No Live Feed
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {windowWidth > 768 ? (
                <div
                  className="pt-2 bg-light"
                  style={{
                    position: "fixed",
                    top: `${navbarHeight}px`,
                    zIndex: 1,
                    width: "20%",
                    paddingLeft: "7vw",
                    paddingBottom: "2vh",
                  }}
                >
                  <BootstrapSwitchButton
                    checked={showInspection}
                    onlabel={<FaCamera />}
                    offlabel={<FaBroom />}
                    onChange={handleType}
                    onstyle="outline-primary"
                    offstyle="outline-primary"
                    width={100}
                  />
                </div>
              ) : (
                <>
                  <div
                    className={` bg-light`}
                    style={{
                      position: "fixed",
                      top: `${navbarHeight}px`,
                      zIndex: 1,
                      width: "100%",
                      paddingLeft: "7vw",
                      paddingBottom: "2vh",
                    }}
                  >
                    <div className="ms-4">
                      <h1>
                        Greetings,{" "}
                        <span style={{ color: "#2a265f" }}>{user.company}</span>
                      </h1>
                      <h6>Your Performance Report</h6>
                      <BootstrapSwitchButton
                        checked={showInspection}
                        onlabel={<FaCamera />}
                        offlabel={<FaBroom />}
                        onChange={handleType}
                        onstyle="outline-primary"
                        offstyle="outline-primary"
                        width={100}
                      />
                    </div>
                  </div>
                </>
              )}
              <div
                className="container"
                style={{ marginTop: `${windowWidth > 768 ? "30%" : "30%"}` }}
              >
                {showInspection &&
                  inspectionDroneList.map((drone, i) => (
                    <div key={drone._id}>
                      <Card
                        className="m-2 pt-3 pb-3"
                        style={{
                          boxShadow: "0 0 10px #ccc",
                          width: `${windowWidth > 768 ? "95%" : "50%"}`,
                        }}
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
                            {drone.takeOffStatus ? (
                              <Button
                                variant="dark"
                                size="sm"
                                className="mt-1 mb-0"
                                style={{ width: "90%" }}
                                onClick={() => handleShowLiveFeed(drone._id)}
                              >
                                Show Live Feed
                              </Button>
                            ) : (
                              <Button
                                variant="dark"
                                size="sm"
                                className="mt-1 mb-0"
                                style={{ width: "90%" }}
                              >
                                No Live Feed
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
              </div>
              {showCleaning && (
                <>
                  <Card
                    className="m-2 pt-3 pb-3"
                    style={{
                      boxShadow: "0 0 10px #ccc",
                      width: `${windowWidth > 768 ? "95%" : "50%"}`,
                    }}
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
