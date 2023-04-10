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
          marginTop: `${windowWidth > 768 ? "25%" : "55%"}`,
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
                    // top: `${navbarHeight}px`,
                    zIndex: 1,
                    width: "20%",
                    paddingLeft: "5vw",
                    paddingBottom: "2vh",
                  }}
                >
                  <BootstrapSwitchButton
                    checked={showInspection}
                    onlabel={<FaCamera />}
                    offlabel={
                      <img
                        width="35%"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEc0lEQVR4nNWZW4hVVRjHf9NlyHKsULqhaWQZUYgMZKQPMcykUvQShZAv9hDdILpg0ktED1FWRleNCInIsEmJCosKooLMLjTd7zQ6EeLo5EyGY9qOD/4bFqu911p7e86ZOX/4GGafdfvv9d03tB8uAd4HhoFtwNW0IaYBu4HMk9toM9xXQCLT7bQNTgXGSoj8SRvh8RISJhtoE8wBDgSI9NImeCFA4nfgaNoAFwKHA0TWuINnAf3AqGQzMI/JgdcCJEzmuyT2FAywZzMnlgOLIyS+dAf3BwZuYmLxQYTIKnfwaGDgPm/hy4EhYCewrMkkroiQOOxrTIiIH2h2Or/taCKJo4CBCJF3/UmbA4P7J4jIiggJk5X+pHkBYz/HG7tMZIzE0iaR6AR+jZD4Wwnk/zBThr1P0l9AolU4G9geIbKRSYQuoAdYLsM+0/t9EfAycKiAiDmdCcdxisajJXHhduBEL896WI7HxuwCjq2zsS20XrZxUH/X6XmdW/gkwZDHgCeAc725twKr65C4LOCe7XlfxfVWJZDIvFjxhs7RQU2cFYkxecCcXWHNE4DPKpLJJAOyp8qE1idu8HSFvMkwHXgxktFmAbHGwylViLjBLySDCWv1qDAy75RjqlRzbw0y35fFkSKMJy5qB4xhg8aaK10LnOH8thD4ogaZZ1OJ7Ehc8LeEtRYVxINPHfvqEKFrgfsT9z2oEiSKdYkLPhVYY5bz9u8E/vXmjgB3e2rSIRtK2fv6FCJzEr2WH5FzTFHMeEf5k+FiueA7vBvfD7wJ3OzMt+j9gF7ADyX7P0gi+nTYMhJlcaTTK1HfLqg2lxfcUAY8AhxfULcPF4y9hwqYLRc7KAcwKHUquwnzRq+XOIWN6hbmB12iMmK7bCaTDEu173KS1y6l949K9TY1sw10XkJBZLIVmOHNNdv4sGDskNSsdmSvgil6e/sruM/d0vElSt0NpwNbgH8Kxn+rbuNNwDXApY0k0CnPMVQjDrgyrnwqx0nKALpLir5Khh6qpxfq7RS1+OuKxZnHgAu8/ebrlvyWqXnAJEzTG+mVkd0rIx5p4OHLZAT4Gljg1TFzdabuKjbzcwsOHJO/gIfkRGrjlQYcZFy32VtSslaRvQqwbwEnVyFivv6jIyRxpfORJvRZoIpsqXMr5jm+q7HZmEPCPNDnDVS3xdSERfBfKmw04Oj0DH15DY3/GDhfkTqLiK11RDgtoUTdo6Bo3gWR+THBO+VNDEsQY0TcWFMbXUr+/I7fe8CNTgvH4swN8jihQ1nCeJXmLEiwoa00EMeoRdOttML+d9GX0CXMZbUTr2J2eKggUDYUpkYX6VBfVbCjNc7txb5IZY1IR0KYGvlIWaZO+ccZ+4D5fMKcbxy7ayp6tFnsQLucLoq1PF9KmHNAatwy2MFuUSOiSL+fcXpR00sKryK5rpUkfEIr1Iz+Sbqd1xr57aWm/GuZhJgre0rtLj7XqoqwKpaqfinrhrjypLzZpIelPBYIrQnxqvKwP9SVsTK2Fv4D4+uprmViiM0AAAAASUVORK5CYII="
                      />
                    }
                    onChange={handleType}
                    onstyle="light"
                    offstyle="light"
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
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEc0lEQVR4nNWZW4hVVRjHf9NlyHKsULqhaWQZUYgMZKQPMcykUvQShZAv9hDdILpg0ktED1FWRleNCInIsEmJCosKooLMLjTd7zQ6EeLo5EyGY9qOD/4bFqu911p7e86ZOX/4GGafdfvv9d03tB8uAd4HhoFtwNW0IaYBu4HMk9toM9xXQCLT7bQNTgXGSoj8SRvh8RISJhtoE8wBDgSI9NImeCFA4nfgaNoAFwKHA0TWuINnAf3AqGQzMI/JgdcCJEzmuyT2FAywZzMnlgOLIyS+dAf3BwZuYmLxQYTIKnfwaGDgPm/hy4EhYCewrMkkroiQOOxrTIiIH2h2Or/taCKJo4CBCJF3/UmbA4P7J4jIiggJk5X+pHkBYz/HG7tMZIzE0iaR6AR+jZD4Wwnk/zBThr1P0l9AolU4G9geIbKRSYQuoAdYLsM+0/t9EfAycKiAiDmdCcdxisajJXHhduBEL896WI7HxuwCjq2zsS20XrZxUH/X6XmdW/gkwZDHgCeAc725twKr65C4LOCe7XlfxfVWJZDIvFjxhs7RQU2cFYkxecCcXWHNE4DPKpLJJAOyp8qE1idu8HSFvMkwHXgxktFmAbHGwylViLjBLySDCWv1qDAy75RjqlRzbw0y35fFkSKMJy5qB4xhg8aaK10LnOH8thD4ogaZZ1OJ7Ehc8LeEtRYVxINPHfvqEKFrgfsT9z2oEiSKdYkLPhVYY5bz9u8E/vXmjgB3e2rSIRtK2fv6FCJzEr2WH5FzTFHMeEf5k+FiueA7vBvfD7wJ3OzMt+j9gF7ADyX7P0gi+nTYMhJlcaTTK1HfLqg2lxfcUAY8AhxfULcPF4y9hwqYLRc7KAcwKHUquwnzRq+XOIWN6hbmB12iMmK7bCaTDEu173KS1y6l949K9TY1sw10XkJBZLIVmOHNNdv4sGDskNSsdmSvgil6e/sruM/d0vElSt0NpwNbgH8Kxn+rbuNNwDXApY0k0CnPMVQjDrgyrnwqx0nKALpLir5Khh6qpxfq7RS1+OuKxZnHgAu8/ebrlvyWqXnAJEzTG+mVkd0rIx5p4OHLZAT4Gljg1TFzdabuKjbzcwsOHJO/gIfkRGrjlQYcZFy32VtSslaRvQqwbwEnVyFivv6jIyRxpfORJvRZoIpsqXMr5jm+q7HZmEPCPNDnDVS3xdSERfBfKmw04Oj0DH15DY3/GDhfkTqLiK11RDgtoUTdo6Bo3gWR+THBO+VNDEsQY0TcWFMbXUr+/I7fe8CNTgvH4swN8jihQ1nCeJXmLEiwoa00EMeoRdOttML+d9GX0CXMZbUTr2J2eKggUDYUpkYX6VBfVbCjNc7txb5IZY1IR0KYGvlIWaZO+ccZ+4D5fMKcbxy7ayp6tFnsQLucLoq1PF9KmHNAatwy2MFuUSOiSL+fcXpR00sKryK5rpUkfEIr1Iz+Sbqd1xr57aWm/GuZhJgre0rtLj7XqoqwKpaqfinrhrjypLzZpIelPBYIrQnxqvKwP9SVsTK2Fv4D4+uprmViiM0AAAAASUVORK5CYII="
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
                    paddingLeft: "5vw",
                    paddingBottom: "2vh",
                  }}
                >
                  <BootstrapSwitchButton
                    checked={showInspection}
                    onlabel={<FaCamera />}
                    offlabel={
                      <img
                        width="35%"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEc0lEQVR4nNWZW4hVVRjHf9NlyHKsULqhaWQZUYgMZKQPMcykUvQShZAv9hDdILpg0ktED1FWRleNCInIsEmJCosKooLMLjTd7zQ6EeLo5EyGY9qOD/4bFqu911p7e86ZOX/4GGafdfvv9d03tB8uAd4HhoFtwNW0IaYBu4HMk9toM9xXQCLT7bQNTgXGSoj8SRvh8RISJhtoE8wBDgSI9NImeCFA4nfgaNoAFwKHA0TWuINnAf3AqGQzMI/JgdcCJEzmuyT2FAywZzMnlgOLIyS+dAf3BwZuYmLxQYTIKnfwaGDgPm/hy4EhYCewrMkkroiQOOxrTIiIH2h2Or/taCKJo4CBCJF3/UmbA4P7J4jIiggJk5X+pHkBYz/HG7tMZIzE0iaR6AR+jZD4Wwnk/zBThr1P0l9AolU4G9geIbKRSYQuoAdYLsM+0/t9EfAycKiAiDmdCcdxisajJXHhduBEL896WI7HxuwCjq2zsS20XrZxUH/X6XmdW/gkwZDHgCeAc725twKr65C4LOCe7XlfxfVWJZDIvFjxhs7RQU2cFYkxecCcXWHNE4DPKpLJJAOyp8qE1idu8HSFvMkwHXgxktFmAbHGwylViLjBLySDCWv1qDAy75RjqlRzbw0y35fFkSKMJy5qB4xhg8aaK10LnOH8thD4ogaZZ1OJ7Ehc8LeEtRYVxINPHfvqEKFrgfsT9z2oEiSKdYkLPhVYY5bz9u8E/vXmjgB3e2rSIRtK2fv6FCJzEr2WH5FzTFHMeEf5k+FiueA7vBvfD7wJ3OzMt+j9gF7ADyX7P0gi+nTYMhJlcaTTK1HfLqg2lxfcUAY8AhxfULcPF4y9hwqYLRc7KAcwKHUquwnzRq+XOIWN6hbmB12iMmK7bCaTDEu173KS1y6l949K9TY1sw10XkJBZLIVmOHNNdv4sGDskNSsdmSvgil6e/sruM/d0vElSt0NpwNbgH8Kxn+rbuNNwDXApY0k0CnPMVQjDrgyrnwqx0nKALpLir5Khh6qpxfq7RS1+OuKxZnHgAu8/ebrlvyWqXnAJEzTG+mVkd0rIx5p4OHLZAT4Gljg1TFzdabuKjbzcwsOHJO/gIfkRGrjlQYcZFy32VtSslaRvQqwbwEnVyFivv6jIyRxpfORJvRZoIpsqXMr5jm+q7HZmEPCPNDnDVS3xdSERfBfKmw04Oj0DH15DY3/GDhfkTqLiK11RDgtoUTdo6Bo3gWR+THBO+VNDEsQY0TcWFMbXUr+/I7fe8CNTgvH4swN8jihQ1nCeJXmLEiwoa00EMeoRdOttML+d9GX0CXMZbUTr2J2eKggUDYUpkYX6VBfVbCjNc7txb5IZY1IR0KYGvlIWaZO+ccZ+4D5fMKcbxy7ayp6tFnsQLucLoq1PF9KmHNAatwy2MFuUSOiSL+fcXpR00sKryK5rpUkfEIr1Iz+Sbqd1xr57aWm/GuZhJgre0rtLj7XqoqwKpaqfinrhrjypLzZpIelPBYIrQnxqvKwP9SVsTK2Fv4D4+uprmViiM0AAAAASUVORK5CYII="
                      />
                    }
                    onChange={handleType}
                    onstyle="light"
                    offstyle="light"
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
                        <span style={{ color: "#2a265f", textTransform: "capitalize" }}>{user.company}</span>
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
                          width: `${windowWidth > 768 ? "100%" : "50%"}`,
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
