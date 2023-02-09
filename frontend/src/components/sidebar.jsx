import React, { useState, useEffect } from "react";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { FaBroom, FaCamera } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import { Button, ListGroup, Card } from "react-bootstrap";
import BatteryGauge from "react-battery-gauge";

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

  useEffect(() => {
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

  const handleTakeoffStatus = (id) => {
    setDroneList((prevDroneList) =>
      prevDroneList.map((drone) => {
        if (drone.id === id) {
          return {
            ...drone,
            takeoffStatus: !drone.takeoffStatus,
          };
        }
        return drone;
      })
    );
  };

  const showVideoFeed = (id) => {
    setDroneList((prevDroneList) =>
      prevDroneList.map((drone) => {
        if (drone.id === id) {
          return {
            ...drone,
            videoStreamStatus: !drone.videoStreamStatus,
          };
        }
      })
    );
  };

  return (
    <>
      <div
        style={{ ...styles.mainContent, marginTop: `${navbarHeight}px` }}
        className="d-flex justify-content-center sidebar"
      >
        <div className="bg-light " style={{ height: "100vh", width:"40vw" }}>
          <h3
            style={{ color: "#333" }}
            className="d-flex justify-content-center"
          >
            DRONES
          </h3>
          <div className="d-flex justify-content-center">
            <BootstrapSwitchButton
              checked={true}
              onlabel={<FaCamera />}
              offlabel={<FaBroom />}
              onChange={handleType}
              onstyle="outline-info"
              offstyle="outline-primary"
              width={100}
            />
          </div>

          <div className="pt-3">
            {filteredDrones.map((drone, index) => (
              <ListGroup>
                <Card
                  className="m-2 pt-3 pb-3"
                  style={{ boxShadow: "0 0 10px #ccc" }}
                  variant="light"
                >
                  <Card.Body>
                    <Card.Subtitle
                      className="d-flex justify-content-start"
                      style={{ color: "#2a265f" }}
                    >
                      <BsCircleFill className="me-2 mt-1" fontSize="11px" />
                      Drone {index + 1}
                    </Card.Subtitle>
                    <Card.Text className="battery-gauge d-flex justify-content-end">
                      <BatteryGauge value={drone.battery} size={45} />
                    </Card.Text>
                    <div className="m-auto">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      className="me-1 mb-0"
                      onClick={() => handleTakeoffStatus(drone.id)}
                      style={{width:"90%"}}
                    >
                      {drone.takeoffStatus ? "Takeoff" : "Land"}
                    </Button>
                    <Button variant="dark" size="sm" className="mt-1 mb-0" onClick={() => showVideoFeed(drone.id)} style={{width:"90%"}} >
                      Show Live Feed
                    </Button>
                    </div>
                    
                  </Card.Body>
                </Card>
              </ListGroup>
            ))}
          </div>

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
