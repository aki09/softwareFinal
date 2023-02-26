import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import ErrorList from "../components/errorlist";
import Maap1 from "../components/map1";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";
import { useNavigate } from "react-router-dom";
import { AiFillCloseSquare } from "react-icons/ai";

const styles = {
  mainContent: {
    marginTop: "",
  },
};

const Dashboard = () => {
  const [user, setUser] = useState([]);
  const [drones, setDrones] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const location = useLocation();
  const cookieValue = location.state.cookieValue;
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/home", {
          params: { cookieValue: cookieValue },
        });
        document.cookie = `access_token=${cookieValue}`;
        let c = 1;
        let col1 = ["red", "blue", "green", "orange", "pink"];
        let col2 = [
          "yellow-dot",
          "blue-dot",
          "green-dot",
          "ltblue-dot",
          "orange-dot",
        ];
        let col3 = ["red", "blue", "green", "orange", "pink"];
        let col4 = ["yellow", "blue", "green", "ltblue", "orange"];
        for (let i = 0; i < response.data.drones.length; i++) {
          if (response.data.drones[i].type == "inspection") {
            response.data.drones[i].name = "Drone " + c;
            response.data.drones[i].colormap = col1[c - 1];
            response.data.drones[i].color = col3[c - 1];
            c++;
          }
        }
        c = 1;
        for (let i = 0; i < response.data.drones.length; i++) {
          if (response.data.drones[i].type == "cleaning") {
            response.data.drones[i].name = "Drone " + c;
            response.data.drones[i].colormap = col2[c - 1];
            response.data.drones[i].color = col4[c - 1];
            c++;
          }
        }
        setUser(response.data.user);
        setDrones(response.data.drones);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    fetchData();

    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);
  }, []);

  function updateVideoUrl(url) {
    setVideoUrl(url);
  }

  function handleCloseVideoFeed() {
    setShowVideoFeed(false);
    setVideoUrl("");
  }

  // const handleCloseLiveFeed = () => {
  //   console.log("close");
  //   setShowVideoFeed(false);
  //   setVideoUrl("");
  //   console.log(videoUrl);
  //   console.log(showVideoFeed);
  // };

  return drones.length ? (
    <>
      {showVideoFeed ? (
        <>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 99,
            }}
          >
            <iframe width="832" height="468" src={videoUrl}></iframe>
            <button
              style={{ position: "absolute", top: 0, right: 0 }}
              onClick={handleCloseVideoFeed}
              className="btn btn-danger"
            >
              <AiFillCloseSquare
                style={{ fontSize: "24px" }}
              />
            </button>
          </div>
          <div style={{ filter: "blur(2px)" }}>
            <Container fluid className="bg-light">
              <Row>
                <Topbar user={user} />
              </Row>
              <Row>
                <Col md={3} className="justify-content-center">
                  <div
                    style={{ height: "100vh", overflowY: "scroll" }}
                    className="sidebarScroll"
                  >
                    <Sidebar
                      drones={drones}
                      showVideoFeed={showVideoFeed}
                      setShowVideoFeed={setShowVideoFeed}
                      updateVideoUrl={updateVideoUrl}
                    />
                  </div>
                </Col>
                <Col md={5}>
                  <Maap1 drones={drones} cookieValue={cookieValue} />
                </Col>
                <Col md={4}>
                  <ErrorList drones={drones} />
                </Col>
              </Row>
            </Container>
          </div>
        </>
      ) : (
        <div>
          <Container fluid className="bg-light">
            <Row>
              <Topbar user={user} />
            </Row>
            <Row>
              <Col md={3} className="justify-content-center">
                <div
                  style={{ height: "100vh", overflowY: "scroll" }}
                  className="sidebarScroll"
                >
                  <Sidebar
                    drones={drones}
                    showVideoFeed={showVideoFeed}
                    setShowVideoFeed={setShowVideoFeed}
                    updateVideoUrl={updateVideoUrl}
                  />
                </div>
              </Col>
              <Col md={5}>
                <Maap1 drones={drones} cookieValue={cookieValue} />
              </Col>
              <Col md={4}>
                <ErrorList drones={drones} />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  ) : (
    <>
      <Container
        fluid
        className="bg-light"
        style={{ ...styles.mainContent, marginTop: `${navbarHeight}px` }}
      >
        <Row>
          <Topbar user={user} />
        </Row>
        <Row className="d-flex justify-content-center">
          <h4 style={{ color: "#2a265f" }}>Flynovate</h4>
          <p className="text-dark">
            Please contact FLYNOVATE team for your DRONE requirements.
          </p>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
