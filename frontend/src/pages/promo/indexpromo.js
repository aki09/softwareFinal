import "../../styles/promo/promo.css";
import "swiper/css";
import "swiper/css/effect-cards";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper";

import { BsPersonFill } from "react-icons/bs";
import { MdEmail, MdCleaningServices } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { BiVideo, BiError, BiCurrentLocation } from "react-icons/bi";
import { GiClick, GiDeliveryDrone } from "react-icons/gi";

import logo from "../../assets/logo3.png";
import logo1 from "../../assets/logo1.png";
import hexagon from "../../assets/hexagons.png";

import drone1 from "../../assets/drone1.png";
import drone2 from "../../assets/drone2.jpg";
import drone3 from "../../assets/drone3.JPG";
import drone4 from "../../assets/drone4.jpg";

import process1 from "../../assets/1.png";
import process2 from "../../assets/2.png";
import process3 from "../../assets/3.png";
import process4 from "../../assets/4.png";

import pic1 from "../../assets/pic1.png";
import pic2 from "../../assets/pic2.png";
import pic3 from "../../assets/pic3.png";
import pic4 from "../../assets/pic4.png";
import pic5 from "../../assets/pic5.png";
import pic6 from "../../assets/pic6.png";
import pic7 from "../../assets/pic7.png";
import pic8 from "../../assets/pic8.png";

import laptop from "../../assets/laptop.png";
import laptop1 from "../../assets/laptop1.png";
import laptop2 from "../../assets/laptop2.png";
import laptop3 from "../../assets/laptop3.png";
import laptop4 from "../../assets/laptop4.png";
import laptop5 from "../../assets/laptop5.png";
import laptop6 from "../../assets/laptop6.png";
import laptop7 from "../../assets/laptop7.png";

const imagesHeader = [drone1, drone2, drone3, drone4];

const services = [
  {
    id: 1,
    img_url: laptop5,
    title: "Inspection Reports",
    icon: <TbReportAnalytics className="small-circle--icon" />,
  },
  {
    id: 2,
    img_url: laptop2,
    title: "Live Video Feed",
    icon: <BiVideo className="small-circle--icon" />,
  },
  {
    id: 3,
    img_url: laptop1,
    title: "One Click TakeOff",
    icon: <GiClick className="small-circle--icon" />,
  },
  {
    id: 4,
    img_url: laptop4,
    title: "Error Detection",
    icon: <BiError className="small-circle--icon" />,
  },
  {
    id: 5,
    img_url: laptop3,
    title: "AI based Detections",
    icon: <BiCurrentLocation className="small-circle--icon" />,
  },
  {
    id: 6,
    img_url: laptop7,
    title: "Waterless Cleaning",
    icon: <MdCleaningServices className="small-circle--icon" />,
  },
  {
    id: 7,
    img_url: laptop6,
    title: "Inspection Drone",
    icon: <GiDeliveryDrone className="small-circle--icon" />,
  },
];

const ProcessIcon = ({ src, title, desc, index }) => {
  const [showDesc, setShowDesc] = useState(false);
  return (
    <div
      className="process-icon-container"
      onMouseEnter={() => setShowDesc(true)}
      onMouseLeave={() => setShowDesc(false)}
    >
      <img src={src} className="process-icon" />
      {showDesc && (
        <div className="process-description">
          <h4>{title}</h4>
          <span>{desc}</span>
        </div>
      )}
    </div>
  );
};

const PromoPage = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [service, setService] = useState(0);
  const [isRotated, setIsRotated] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlideIndex((currentSlideIndex + 1) % imagesHeader.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentSlideIndex]);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleService = (index) => {
    setService(index);
    setIsRotated(!isRotated);
  };

  return (
    <motion.div>
      <Navbar
        expand="lg"
        style={{ backgroundColor: "#050049" }}
        variant="dark"
        fixed="top"
      >
        <Container>
          <Navbar.Brand href="#">
            <img src={logo} height="50px" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end align-items-center"
          >
            <Nav>
              <Nav.Link href="#aboutUs" className="nav-links text-white pt-3">
                ABOUT US
              </Nav.Link>
              <Nav.Link href="#process" className="nav-links text-white pt-3">
                PROCESS
              </Nav.Link>
              <Nav.Link href="#services" className="nav-links text-white pt-3">
                OUR SERVICES
              </Nav.Link>
              <Nav.Link href="/news" className="nav-links text-white pt-3">
                NEWS & ARTICLES
              </Nav.Link>
              <Nav.Link href="/login">
                <div className="d-flex align-items-center">
                  <BsPersonFill size="42" className="iconButton" />
                  <a
                    className="text-white pe-4 py-1 rounded-pill ps-5 spanButton"
                    href="/login"
                    style={{ textDecoration: "none" }}
                  >
                    LOGIN
                  </a>
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="slideshow">
        {imagesHeader.map((img, i) => (
          <div
            key={i}
            className={`slide ${currentSlideIndex === i ? "active" : ""}`}
            style={{
              backgroundImage: `url(${img})`,
              height: "100vh",
            }}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <h1>
                WE'RE
                <br />
                FLYNOVATE
              </h1>
              <h3>
                India's First Drone-Enabled Waterless
                <br />
                Cleaning Technology for Solar Panels.
              </h3>
              <div className="d-flex align-items-center mt-3">
                <BsPersonFill size="50" className="iconButton" />
                <a
                  className="text-white pe-4 py-1 rounded-pill ps-5 spanButton"
                  href="#contact"
                >
                  CONTACT US
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="main-content">
        <div id="aboutUs" className="container d-flex about-us">
          <div className="aboutus-container">
            <div className="about-card justify-content-center align-items-center">
              <p>
                Flynovate is a next-gen company in the field of robotics and
                artificial intelligence that addresses significant issues faced
                by individuals working in the unorganized sector. We strive to
                create solutions that are highly adaptable and user-friendly
                hile maintaining the highest level of service quality.
              </p>
            </div>
          </div>
          <div className="swiper-container">
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper"
            >
              <SwiperSlide>
                <img src={pic1} alt="" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={pic2} alt="" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={pic3} alt="" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={pic4} alt="" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={pic5} alt="" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={pic6} alt="" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={pic7} alt="" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={pic8} alt="" />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>

        <div
          id="process"
          className="process-container d-flex justify-content-center align-items-center"
          // style={{ marginTop: `${navbarHeight}px` }}
        >
          <ProcessIcon
            src={process1}
            title="The Deployment"
            desc="Drone Deployment based on size and work speed required"
            index={0}
          />
          <ProcessIcon
            src={process2}
            title="Drone Launch"
            desc="Scheduled or manual launch options based on user preferences"
            index={1}
          />
          <ProcessIcon
            src={process3}
            title="Navigation & Communication"
            desc="Drone will send live data and video feed to ground station"
            index={2}
          />
          <ProcessIcon
            src={process4}
            title="Form Efficiency & Feedback"
            desc="Detailed farm statistics post O&M processes"
            index={3}
          />
        </div>

        <div
          className="service"
          id="services"
          style={{
            height: `calc(100vh - ${navbarHeight}px)`,
            position: "relative",
          }}
        >
          <div
            className="laptop-container"
            style={{ height: "37%", float: "top" }}
          >
            <img className="laptop-template" src={laptop} alt="" />

            {service === 1 && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="laptop-img"
                src={services[0].img_url}
              />
            )}
            {service === 2 && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="laptop-img"
                src={services[1].img_url}
              />
            )}
            {service === 3 && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="laptop-img"
                src={services[2].img_url}
              />
            )}
            {service === 4 && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="laptop-img"
                src={services[3].img_url}
              />
            )}
            {service === 5 && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="laptop-img"
                src={services[4].img_url}
              />
            )}
            {service === 6 && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="laptop-img"
                src={services[5].img_url}
              />
            )}
            {service === 0 && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="laptop-img"
                src={services[6].img_url}
              />
            )}
          </div>
          {windowWidth < 992 ? (
            <>
              <div className="service-container--m">
                <div className="semi-circle--m">
                  <div className="circle--m">
                    <a
                      onClick={() => handleService(1)}
                      style={{ cursor: "pointer" }}
                    >
                      <TbReportAnalytics
                        className={`circle-icon--m ${
                          service === 1 ? "active--m" : ""
                        }`}
                      />
                    </a>
                  </div>
                  <div className="circle--m">
                    <a
                      onClick={() => handleService(2)}
                      style={{ cursor: "pointer" }}
                    >
                      <BiVideo
                        className={`circle-icon--m ${
                          service === 2 ? "active--m" : ""
                        }`}
                      />
                    </a>
                  </div>
                  <div className="circle--m">
                    <a
                      onClick={() => handleService(3)}
                      style={{ cursor: "pointer" }}
                    >
                      <GiClick
                        className={`circle-icon--m ${
                          service === 3 ? "active--m" : ""
                        }`}
                      />
                    </a>
                  </div>
                  <div className="circle--m">
                    <a
                      onClick={() => handleService(0)}
                      style={{ cursor: "pointer" }}
                    >
                      <GiDeliveryDrone
                        className={`circle-icon--m ${
                          service === 0 ? "active--m" : ""
                        }`}
                      />
                    </a>
                  </div>
                  <div className="circle--m">
                    <a
                      onClick={() => handleService(4)}
                      style={{ cursor: "pointer" }}
                    >
                      <BiError
                        className={`circle-icon--m ${
                          service === 4 ? "active--m" : ""
                        }`}
                      />
                    </a>
                  </div>
                  <div className="circle--m">
                    <a
                      onClick={() => handleService(5)}
                      style={{ cursor: "pointer" }}
                    >
                      <BiCurrentLocation
                        className={`circle-icon--m ${
                          service === 5 ? "active--m" : ""
                        }`}
                      />
                    </a>
                  </div>
                  <div className="circle--m">
                    <a
                      onClick={() => handleService(6)}
                      style={{ cursor: "pointer" }}
                    >
                      <MdCleaningServices
                        className={`circle-icon--m ${
                          service === 6 ? "active--m" : ""
                        }`}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              className="spinner-container"
              style={{ height: "63%", float: "bottom", position: "relative" }}
            >
              <div className="main-circle">
                {service == 0 && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="main-circle--text"
                  >
                    {services[6].title}
                  </motion.h2>
                )}
                {service == 1 && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="main-circle--text"
                  >
                    {services[0].title}
                  </motion.h2>
                )}
                {service == 2 && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="main-circle--text"
                  >
                    {services[1].title}
                  </motion.h2>
                )}
                {service == 3 && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="main-circle--text"
                  >
                    {services[2].title}
                  </motion.h2>
                )}
                {service == 4 && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="main-circle--text"
                  >
                    {services[3].title}
                  </motion.h2>
                )}
                {service == 5 && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="main-circle--text"
                  >
                    {services[4].title}
                  </motion.h2>
                )}
                {service == 6 && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="main-circle--text"
                  >
                    {services[5].title}
                  </motion.h2>
                )}
              </div>
              <div className="center-circle d-flex justify-content-center align-items-center">
                <motion.a
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isRotated ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => handleService(0)}
                  style={{ cursor: "pointer" }}
                >
                  {/* <img src={service_logo} alt="" width="100px" /> */}
                  {service === 0 && (
                    <GiDeliveryDrone className="center-circle--icon" />
                  )}
                  {service === 1 && (
                    <TbReportAnalytics className="center-circle--icon" />
                  )}
                  {service === 2 && <BiVideo className="center-circle--icon" />}
                  {service === 3 && <GiClick className="center-circle--icon" />}
                  {service === 4 && <BiError className="center-circle--icon" />}
                  {service === 5 && (
                    <BiCurrentLocation className="center-circle--icon" />
                  )}
                  {service === 6 && (
                    <MdCleaningServices className="center-circle--icon" />
                  )}
                </motion.a>
              </div>
              <div className="small-circle" style={{ top: "55%", left: "5%" }}>
                {service === 1 ? (
                  <a
                    onClick={() => handleService(0)}
                    style={{ cursor: "pointer" }}
                  >
                    <GiDeliveryDrone className="small-circle--icon" />
                  </a>
                ) : (
                  <a
                    onClick={() => handleService(1)}
                    style={{ cursor: "pointer" }}
                  >
                    <TbReportAnalytics className="small-circle--icon" />
                  </a>
                )}
              </div>
              <div className="small-circle" style={{ top: "34%", left: "17%" }}>
                {service === 2 ? (
                  <a
                    onClick={() => handleService(0)}
                    style={{ cursor: "pointer" }}
                  >
                    <GiDeliveryDrone className="small-circle--icon" />
                  </a>
                ) : (
                  <a
                    onClick={() => handleService(2)}
                    style={{ cursor: "pointer" }}
                  >
                    <BiVideo className="small-circle--icon" />
                  </a>
                )}
              </div>
              <div
                className={`small-circle`}
                style={{ top: "20%", left: "30%" }}
              >
                {service === 3 ? (
                  <a
                    onClick={() => handleService(0)}
                    style={{ cursor: "pointer" }}
                  >
                    <GiDeliveryDrone className="small-circle--icon" />
                  </a>
                ) : (
                  <a
                    onClick={() => handleService(3)}
                    style={{ cursor: "pointer" }}
                  >
                    <GiClick className="small-circle--icon" />
                  </a>
                )}
              </div>
              <div
                className={`small-circle`}
                style={{ top: "20%", right: "30%" }}
              >
                {service === 4 ? (
                  <a
                    onClick={() => handleService(0)}
                    style={{ cursor: "pointer" }}
                  >
                    <GiDeliveryDrone className="small-circle--icon" />
                  </a>
                ) : (
                  <a
                    onClick={() => handleService(4)}
                    style={{ cursor: "pointer" }}
                  >
                    <BiError className="small-circle--icon" />
                  </a>
                )}
              </div>
              <div
                className={`small-circle`}
                style={{ top: "34%", right: "17%" }}
              >
                {service === 5 ? (
                  <a
                    onClick={() => handleService(0)}
                    style={{ cursor: "pointer" }}
                  >
                    <GiDeliveryDrone className="small-circle--icon" />
                  </a>
                ) : (
                  <a
                    onClick={() => handleService(5)}
                    style={{ cursor: "pointer" }}
                  >
                    <BiCurrentLocation className="small-circle--icon" />
                  </a>
                )}
              </div>
              <div className="small-circle" style={{ top: "55%", right: "5%" }}>
                {service === 6 ? (
                  <a
                    onClick={() => handleService(0)}
                    style={{ cursor: "pointer" }}
                  >
                    <GiDeliveryDrone className="small-circle--icon" />
                  </a>
                ) : (
                  <a
                    onClick={() => handleService(6)}
                    style={{ cursor: "pointer" }}
                  >
                    <MdCleaningServices className="small-circle--icon" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          className="grid-container"
          style={{
            height: "120vh",
            position: "relative",
          }}
        >
          <div class="grid-wrapper">
            <img
              src="https://source.unsplash.com/random/600x600?water"
              alt=""
              className="grid-img"
            />
            <img
              src="https://source.unsplash.com/random/600x600?summer"
              alt=""
              className="grid-img"
            />
            <img
              src="https://source.unsplash.com/random/600x600?plants"
              alt=""
              className="grid-img"
            />
            <img
              src="https://source.unsplash.com/random/600x600?snow"
              alt=""
              className="grid-img"
            />
            <img
              src="https://source.unsplash.com/random/600x600?roses"
              alt=""
              className="grid-img"
            />
            <img
              src="https://source.unsplash.com/random/600x600?sky"
              alt=""
              className="grid-img"
            />
            <img
              src="https://source.unsplash.com/random/600x600?nature"
              alt=""
              className="grid-img"
            />
            <img
              src="https://source.unsplash.com/random/600x600?blossom"
              alt=""
              className="grid-img"
            />
            <img
              src="https://source.unsplash.com/random/600x600?ice"
              alt=""
              className="grid-img"
            />
            <img
              src="https://source.unsplash.com/random/600x600?spring"
              alt=""
              className="grid-img"
            />
          </div>
        </div>

        <div className="contact-container">
          <div className="contact-form container text-white" id="contact">
            <div className="px-5 contact-form-container">
              <div className="contact-line"></div>
              <h1>CONTACT US</h1>
              <form action="#">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control bg-transparent text-white"
                    id="name"
                    name="name"
                    placeholder="NAME"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control bg-transparent text-white"
                    id="email"
                    name="eamil"
                    placeholder="EMAIL"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control bg-transparent text-white"
                    id="company"
                    name="company"
                    placeholder="COMPANY"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    type="text"
                    className="form-control bg-transparent text-white"
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="MESSAGE"
                    required
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button type="submit" className="contact-btn">
                    <span style={{ fontWeight: "600" }}>SUBMIT</span>
                  </button>
                </div>
                <div className="contact-info">
                  <div className="pb-1">
                    <MdEmail size={35} />{" "}
                    <a
                      href="mailto:flynovate@gmail.com"
                      target="_blank"
                      className="contact--email"
                    >
                      flynovate@gmail.com
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div
            className="bg-image"
            style={{ backgroundImage: `url(${hexagon})` }}
          ></div>
        </div>

        <footer>
          <div className="footer-container">
            <div className="column">
              <img src={logo1} alt="" />
            </div>
            <div className="column">
              <div className="footer-line"></div>
              <h3>SOCIAL</h3>
              <ul>
                <li>
                  <a>LinkedIn</a>
                </li>
                <li>
                  <a>Twitter</a>
                </li>
                <li>
                  <a>Instagram</a>
                </li>
              </ul>
            </div>
            <div className="column">
              <div className="footer-line"></div>
              <h3>FLYNOVATE</h3>
              <ul>
                <li>
                  <a>About Us</a>
                </li>
                <li>
                  <a>News & Articles</a>
                </li>
                <li>
                  <a>Career</a>
                </li>
              </ul>
            </div>
            <div className="column">
              <div className="footer-line"></div>
              <h3>LEGAL</h3>
              <ul>
                <li>
                  <a>Terms and Conditions</a>
                </li>
                <li>
                  <a>Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default PromoPage;
