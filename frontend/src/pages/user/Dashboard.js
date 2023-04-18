import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import ErrorList from "../../components/errorlist";
import Maap1 from "../../components/map1";
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";
import { useNavigate } from "react-router-dom";
import { AiFillCloseSquare } from "react-icons/ai";
import Cookies from "js-cookie";
import { Button } from "react-bootstrap";
import { Spinner } from "react-bootstrap";

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
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  let cookie = Cookies.get("auth-token");
  const isLoggedIn = !!Cookies.get("auth-token");

  useEffect(() => {
    if (cookie) {
      fetchData();
    } else {
      setTimeout(() => {
        navigate("/login");
      }, 0);
    }
  }, [cookie, navigate]);

  useEffect(() => {
    function handleResize() {
      const navbar = document.querySelector(".navbar");
      setNavbarHeight(navbar.offsetHeight);
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER + "/home", {
        params: { cookieValue: cookie },
      });
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
      setDrones(response.data.drones);
      setUser(response.data.user);
      setIsLoading(false);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        navigate("/login");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
    setIsLoading(false);
  };

  function updateVideoUrl(url) {
    setVideoUrl(url);
  }

  function handleCloseVideoFeed() {
    setShowVideoFeed(false);
    setVideoUrl("");
  }

  if (!isLoggedIn) {
    navigate("/login");
  }else if(isLoading)
  {
    return <div
    className="loading d-flex justify-content-center align-items-center"
    style={{ marginTop: "25%" }}
  >
    <Spinner
      as="span"
      animation="border"
      size="lg"
      role="status"
      aria-hidden="true"
    />
    <h1>Loading...</h1>
  </div>

  }else {
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
              <iframe
                width="832"
                height="468"
                src={videoUrl}
                style={{
                  borderRadius: "10px",
                }}
              ></iframe>
              <button
                style={{ position: "absolute", top: 0, right: 0 }}
                onClick={handleCloseVideoFeed}
                className="btn btn-danger"
              >
                <AiFillCloseSquare style={{ fontSize: "24px" }} />
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
                      style={{ height: "100vh" }}
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
                    <Maap1 drones={drones} />
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
                <Col lg={3} className="order-1 order-lg-1">
                  <div
                    style={{ height: "100vh", overflowY: "scroll" }}
                    className="sidebarScroll"
                  >
                    <Sidebar
                      user={user}
                      drones={drones}
                      showVideoFeed={showVideoFeed}
                      setShowVideoFeed={setShowVideoFeed}
                      updateVideoUrl={updateVideoUrl}
                    />
                  </div>
                </Col>
                <Col lg={5} md={12} className="order-2 order-lg-2">
                  <Maap1 drones={drones} />
                </Col>
                <Col lg={4} md={12} className="order-3 order-lg-3">
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
          className=" "
          style={{
            ...styles.mainContent,
            marginTop: `${navbarHeight}px`,
            minHeight: "60vh",
          }}
        >
          <Row>
            <Topbar user={user} />
          </Row>
          <Row
            className="d-flex align-items-center "
            style={{ height: "calc(65vh - 70px)" }}
          >
            <Col xs={15} md={8} lg={12} className="text-center">
              <h4
                style={{
                  color: "#2a265f",
                  fontSize: "36px",
                  fontWeight: "bold",
                  marginBottom: "24px",
                }}
              >
                Please contact Flynovate team for your drone requirements
              </h4>
              <p className="text-dark" style={{ fontSize: "24px" }}>
                Our experts will help you find the right drone for your needs.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="mt-4"
                href="mailto:flynovate@gmail.com?subject=Drone Requirement"
              >
                Contact Us
              </Button>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
};

export default Dashboard;
