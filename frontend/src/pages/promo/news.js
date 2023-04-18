import React, { useCallback, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../../assets/logo3.png";
import {
  MdKeyboardArrowRight,
  MdWorkspacesOutline,
  MdOutlineArrowBack,
} from "react-icons/md";
import { GiVendingMachine, GiSolarPower } from "react-icons/gi";
import { FaSolarPanel } from "react-icons/fa";
import "../../styles/promo/news.css";

const News = () => {
  const [showArticles, setShowArticles] = useState(false);
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  const containerVariants = {
    initial: { opacity: 0, x: "-100%" },
    animate: { opacity: 1, x: "0%", transition: { duration: 0.5 } },
    exit: { opacity: 0, x: "100%" },
  };

  const articleVariants = {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: "0%", opacity: 1, transition: { duration: 0.5 } },
    exit: { x: "100%", opacity: 0 },
  };

  return (
    <div
      className="bg-banner bg-no-repeat bg-center bg-cover position-relative"
      style={{ backgroundColor: "#050049" }}
    >
      <div className="position-absolute top-0 left-0 w-100 h-100">
        <Particles
          className="w-full h-full"
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            fullScreen: false,
            background: {
              color: {
                value: "#050049",
              },
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",

                  distance: 400,
                },
                resize: true,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 150,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#87cefa",
              },
              links: {
                color: "#87cefa",
                distance: 120,
                enable: true,
                opacity: 0.4,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                directions: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 2.5,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 1200,
                },
                value: 100,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 2 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      <div class="max-w-6xl mx-auto text-white position-relative">
        <Navbar variant="dark" className={`${showArticles ? '' : 'mb-3'}`} style={{backgroundColor:"#050049"}}>
          <Container className="d-flex flex-col">
            <Navbar.Brand href="/">
              <img
                alt=""
                src={logo}
                height="50px"
                className="d-inline-block align-top me-5"
              />{" "}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end align-items-center">
            <Nav>
              <Nav.Link href="/" className="nav-links text-white pt-3">
                HOME PAGE
              </Nav.Link>
              <Nav.Link href="/login" className="nav-links text-white pt-3">
                LOGIN
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </Container>
        </Navbar>

        {showArticles && (
          <button
            onClick={() => setShowArticles(false)}
            className="show-button"
          >
            <MdOutlineArrowBack />
          </button>
        )}

        <div className="container">
          <div className="row">
            {!showArticles && (
              <motion.div
                className="col-md-6 justify-content-center align-items-center d-flex"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="news-container">
                  <h1 className="news-heading">
                    Latest Tech News in Solar Industry
                  </h1>
                  <p className="news-content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    euismod, nunc ut aliquam aliquet, nisl nisl aliquet nunc,
                    eget aliquam nisl nunc sit amet nisl. Sed euismod, nunc ut
                    aliquam aliquet, nisl nisl aliquet nunc, eget aliquam nisl
                    nunc sit amet nisl.
                  </p>
                  <button
                    onClick={() => setShowArticles(true)}
                    className="view-more--button"
                  >
                    View More <MdKeyboardArrowRight size={30} />
                  </button>
                </div>
              </motion.div>
            )}
            <motion.div
              className="col-md-6 justify-content-center align-items-center d-flex"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                className="news-article row row-cols-md-2"
                variants={articleVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="news-cardWrap col">
                  <div className="news-card"></div>
                  <div className="news-card--content">
                    <GiSolarPower className="news-content--icon" />
                    <h4 className="news-content--heading">Article 1</h4>
                    <span className="news-content--description">
                      Insert detail to{" "}
                      <a className="news-content--link">Learn More</a>
                    </span>
                  </div>
                </div>
                <div className="news-cardWrap col">
                  <div className="news-card"></div>
                  <div className="news-card--content">
                    <GiVendingMachine className="news-content--icon" />
                    <h4 className="news-content--heading">Article 2</h4>
                    <span className="news-content--description">
                      Insert detail to{" "}
                      <a className="news-content--link">Learn More</a>
                    </span>
                  </div>
                </div>
                <div className="news-cardWrap col">
                  <div className="news-card"></div>
                  <div className="news-card--content">
                    <MdWorkspacesOutline className="news-content--icon" />
                    <h4 className="news-content--heading">Article 3</h4>
                    <span className="news-content--description">
                      Insert detail to{" "}
                      <a className="news-content--link">Learn More</a>
                    </span>
                  </div>
                </div>
                <div className="news-cardWrap col">
                  <div className="news-card"></div>
                  <div className="news-card--content">
                    <FaSolarPanel className="news-content--icon" />
                    <h4 className="news-content--heading">Article 4</h4>
                    <span className="news-content--description">
                      Insert detail to{" "}
                      <a className="news-content--link">Learn More</a>
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            {showArticles && (
              <>
                <motion.div
                  className="col-md-6 justify-content-center align-items-center d-flex"
                  variants={containerVariants}
                  initial="exit"
                  animate="animate"
                  exit="initial"
                >
                  <motion.div
                    className="news-article row row-cols-md-2"
                    variants={articleVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="news-cardWrap col">
                      <div className="news-card"></div>
                      <div className="news-card--content">
                        <GiSolarPower className="news-content--icon" />
                        <h4 className="news-content--heading">Article 5</h4>
                        <span className="news-content--description">
                          Insert detail to{" "}
                          <a className="news-content--link">Learn More</a>
                        </span>
                      </div>
                    </div>
                    <div className="news-cardWrap col">
                      <div className="news-card"></div>
                      <div className="news-card--content">
                        <GiVendingMachine className="news-content--icon" />
                        <h4 className="news-content--heading">Article 6</h4>
                        <span className="news-content--description">
                          Insert detail to{" "}
                          <a className="news-content--link">Learn More</a>
                        </span>
                      </div>
                    </div>
                    <div className="news-cardWrap col">
                      <div className="news-card"></div>
                      <div className="news-card--content">
                        <MdWorkspacesOutline className="news-content--icon" />
                        <h4 className="news-content--heading">Article 7</h4>
                        <span className="news-content--description">
                          Insert detail to{" "}
                          <a className="news-content--link">Learn More</a>
                        </span>
                      </div>
                    </div>
                    <div className="news-cardWrap col">
                      <div className="news-card"></div>
                      <div className="news-card--content">
                        <FaSolarPanel className="news-content--icon" />
                        <h4 className="news-content--heading">Article 8</h4>
                        <span className="news-content--description">
                          Insert detail to{" "}
                          <a className="news-content--link">Learn More</a>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
