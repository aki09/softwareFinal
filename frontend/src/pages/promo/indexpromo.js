import "../../styles/promo/promo.css";
import "swiper/css";
import "swiper/css/effect-cards";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Container, Navbar, Nav, Alert } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper";
import emailjs from "@emailjs/browser";

import { BsPersonFill } from "react-icons/bs";
import { MdEmail, MdCleaningServices } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { BiVideo, BiError, BiCurrentLocation } from "react-icons/bi";
import { GiClick, GiDeliveryDrone } from "react-icons/gi";

import logo from "../../assets/logo3.png";
import logo1 from "../../assets/logo1.png";
import hexagon from "../../assets/hexagons.jpeg";

import drone1 from "../../assets/drone1.jpeg";
import drone2 from "../../assets/drone2.jpeg";
import drone3 from "../../assets/drone3.jpeg";
import drone4 from "../../assets/drone4.jpeg";
import drone5 from "../../assets/drone5.jpeg";

import process1 from "../../assets/1.jpeg";
import process2 from "../../assets/2.jpeg";
import process3 from "../../assets/3.jpeg";
import process4 from "../../assets/4.jpeg";

import pic1 from "../../assets/pic1.png";
import pic2 from "../../assets/pic2.png";
import pic3 from "../../assets/pic3.png";
import pic4 from "../../assets/pic4.png";
import pic5 from "../../assets/pic5.png";
import pic6 from "../../assets/pic6.png";
import pic7 from "../../assets/pic7.png";
import pic8 from "../../assets/pic8.png";
import pic9 from "../../assets/pic9.png";
import pic10 from "../../assets/pic10.png";

import laptop from "../../assets/laptop.png";
import laptop1 from "../../assets/laptop1.png";
import laptop2 from "../../assets/laptop2.png";
import laptop3 from "../../assets/laptop3.png";
import laptop4 from "../../assets/laptop4.png";
import laptop5 from "../../assets/laptop5.png";
import laptop6 from "../../assets/laptop6.png";
import laptop7 from "../../assets/laptop7.png";

import grid1 from "../../assets/grid1.jpeg";
import grid2 from "../../assets/grid2.jpeg";
import grid3 from "../../assets/grid3.jpeg";
import grid4 from "../../assets/grid4.jpeg";
import grid5 from "../../assets/grid5.jpeg";
import grid6 from "../../assets/grid6.jpeg";
import grid7 from "../../assets/grid7.jpeg";
import grid8 from "../../assets/grid8.jpeg";
import grid9 from "../../assets/grid9.jpeg";
import grid10 from "../../assets/grid10.jpeg";

const imagesHeader = [drone1, drone2, drone3, drone4, drone5];

const services = [
  {
    id: 1,
    img_url: laptop5,
    title: "Fault Isolation Report",
    icon: <TbReportAnalytics className="small-circle--icon" />,
  },
  {
    id: 2,
    img_url: laptop2,
    title: "Live Video Stream on",
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
    title: "Real-time Error Update on Dashboard",
    icon: <BiError className="small-circle--icon" />,
  },
  {
    id: 5,
    img_url: laptop3,
    title: "Real-time Drone Tracking on Dashboard",
    icon: <BiCurrentLocation className="small-circle--icon" />,
  },
  {
    id: 6,
    img_url: laptop7,
    title: "Drone Enabled Waterless Cleaning",
    icon: <MdCleaningServices className="small-circle--icon" />,
  },
  {
    id: 7,
    img_url: laptop6,
    title: "Drone Enabled Thermal Inspection",
    icon: <GiDeliveryDrone className="small-circle--icon" />,
  },
];

const ProcessIcon = ({ src, title, desc }) => {
  const [showDesc, setShowDesc] = useState(false);
  return (
    <motion.div
      className="process-icon-container"
      onMouseEnter={() => setShowDesc(true)}
      onMouseLeave={() => setShowDesc(false)}
      variants={{
        visible: { y: -50 },
        hidden: { y: 0 },
        transition: { duration: 1.5, delay: 1 },
      }}
      initial="hidden"
      whileInView="visible"
      transition="transition"
    >
      <img src={src} className="process-icon" />
      {showDesc && (
        <div className="process-description">
          <h4>{title}</h4>
          <span>{desc}</span>
        </div>
      )}
    </motion.div>
  );
};

const PromoPage = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [service, setService] = useState(0);
  const [isRotated, setIsRotated] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_8ba3qoq",
        "template_4nrmwaq",
        form.current,
        "c-JzOyVQIMPpnQVRe"
      )
      .then(
        (result) => {
          console.log(result.text);
          setShowSuccessAlert(true);
          setShowErrorAlert(false);
          setFormData({
            name: "",
            email: "",
            company: "",
            message: "",
          });
        },
        (error) => {
          console.log(error.text);
          setShowSuccessAlert(false);
          setShowErrorAlert(true);
        }
      );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleService = (index) => {
    setService(index);
    setIsRotated(!isRotated);
  };

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

  return (
    <motion.div>
      <Navbar expand="lg" className="navbar" variant="dark" fixed="top">
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
              {/* <Nav.Link href="/news" className="nav-links text-white pt-3">
                NEWS & ARTICLES
              </Nav.Link> */}
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
              <div className="d-flex align-items-center mt-4">
                {/* <BsFillTelephoneFill size="55" className="iconButton" /> */}
                <a
                  className="text-white pe-4 py-2 rounded-pill spanButton"
                  href="#contact"
                  style={{ paddingLeft: "20px" }}
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
          <motion.div
            className="aboutus-container"
            initial="hidden"
            whileInView="visible"
            transition="transition"
            variants={{
              hidden: { x: -50 },
              visible: { x: 0 },
              transition: { duration: 1.5 },
            }}
          >
            <div className="about-card justify-content-center align-items-center">
              <p>
                Flynovate is a next-gen company in the field of robotics and
                artificial intelligence that addresses significant issues faced
                by individuals working in the unorganized sector. We strive to
                create solutions that are highly adaptable and user-friendly
                hile maintaining the highest level of service quality.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="swiper-container"
            initial="hidden"
            whileInView="visible"
            transition="transition"
            variants={{
              hidden: { x: 50 },
              visible: { x: 0 },
              transition: { duration: 1.5 },
            }}
          >
            <Swiper
              effect={"cards"}
              grabCursor={true}
              className="mySwiper"
              modules={[EffectCards, Autoplay]}
              autoplay={{
                delay: 2500,
                disableOnInteraction: true,
              }}
              loop={true}
              pagination={{ clickable: true }}
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
              <SwiperSlide>
                <img src={pic9} alt="" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={pic10} alt="" />
              </SwiperSlide>
            </Swiper>
          </motion.div>
        </div>

        <div id="process" className="process-container">
          <ProcessIcon
            src={process1}
            title="The Deployment"
            desc="Drone Deployment based on size and work speed required"
            // index={0}
          />
          <ProcessIcon
            src={process2}
            title="Drone Launch"
            desc="Scheduled or manual launch options based on user preferences"
            // index={1}
          />
          <ProcessIcon
            src={process3}
            title="Navigation & Communication"
            desc="Drone will send live data and video feed to ground station"
            // index={3}
          />
          <ProcessIcon
            src={process4}
            title="Form Efficiency & Feedback"
            desc="Detailed farm statistics post O&M processes"
            // index={2}
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
          <motion.div
            className="laptop-container"
            style={{ height: "37%", float: "top" }}
            variants={{
              hidden: { scale: 0 },
              visible: { scale: 1 },
              transition: { duration: 1.5 },
            }}
            initial="hidden"
            whileInView="visible"
            transition="transition"
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
          </motion.div>
          {windowWidth < 992 ? (
            <>
              <motion.div
                className="service-container--m"
                variants={{
                  hidden: { scale: 0 },
                  visible: { scale: 1 },
                  transition: { duration: 1.5 },
                }}
                initial="hidden"
                whileInView="visible"
                transition="transition"
              >
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
                <div className="header-container--m">
                  {service == 0 && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="heading--m"
                    >
                      {services[6].title}
                    </motion.h2>
                  )}
                  {service == 1 && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="heading--m"
                    >
                      {services[0].title}
                    </motion.h2>
                  )}
                  {service == 2 && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="heading--m"
                    >
                      {services[1].title}
                    </motion.h2>
                  )}
                  {service == 3 && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="heading--m"
                    >
                      {services[2].title}
                    </motion.h2>
                  )}
                  {service == 4 && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="heading--m"
                    >
                      {services[3].title}
                    </motion.h2>
                  )}
                  {service == 5 && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="heading--m"
                    >
                      {services[4].title}
                    </motion.h2>
                  )}
                  {service == 6 && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="heading--m"
                    >
                      {services[5].title}
                    </motion.h2>
                  )}
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div
              className="spinner-container"
              style={{ height: "63%", float: "bottom", position: "relative" }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
                transition: { duration: 1.5 },
              }}
              initial="hidden"
              whileInView="visible"
              transition="transition"
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
              <div className="small-circle" style={{ top: "55%", left: "8%" }}>
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
              <div className="small-circle" style={{ top: "34%", left: "20%" }}>
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
                style={{ top: "20%", left: "33%" }}
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
                style={{ top: "20%", right: "33%" }}
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
                style={{ top: "34%", right: "20%" }}
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
              <div className="small-circle" style={{ top: "55%", right: "8%" }}>
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
            </motion.div>
          )}
        </div>

        <div
          className="grid-container"
          style={{
            height: "120vh",
            position: "relative",
          }}
        >
          <motion.div
            className="grid-wrapper"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
              transition: { duration: 1 },
            }}
            initial="hidden"
            whileInView="visible"
            transition="transition"
          >
            <img src={grid1} alt="" className="grid-img" />
            <img src={grid2} alt="" className="grid-img" />
            <img src={grid3} alt="" className="grid-img" />
            <img src={grid4} alt="" className="grid-img" />
            <img src={grid5} alt="" className="grid-img" />
            <img src={grid6} alt="" className="grid-img" />
            <img src={grid7} alt="" className="grid-img" />
            <img src={grid8} alt="" className="grid-img" />
            <img src={grid9} alt="" className="grid-img" />
            <img src={grid10} alt="" className="grid-img" />
          </motion.div>
        </div>

        <div className="contact-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            transition="transition"
            variants={{
              hidden: { x: -50 },
              visible: { x: 0 },
              transition: { duration: 1.5 },
            }}
            className="contact-form container text-white"
            id="contact"
          >
            <div className="px-5 contact-form-container">
              <div className="contact-line"></div>
              <h1>CONTACT US</h1>
              {showSuccessAlert && (
                <Alert variant="success">Message sent successfully!!</Alert>
              )}
              {showErrorAlert && (
                <Alert variant="danger">
                  Something is wrong! Try again later.
                </Alert>
              )}
              <form ref={form} onSubmit={sendEmail}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control bg-transparent text-white"
                    id="name"
                    name="name"
                    placeholder="NAME"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control bg-transparent text-white"
                    id="email"
                    name="email"
                    placeholder="EMAIL"
                    required
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.company}
                    onChange={handleChange}
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
                    value={formData.message}
                    onChange={handleChange}
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
          </motion.div>
          <div
            className="bg-image"
            style={{ backgroundImage: `url(${hexagon})` }}
          ></div>
        </div>

        <footer>
          <motion.div
            className="footer-container"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
              transition: { duration: 1.5 },
            }}
            initial="hidden"
            whileInView="visible"
            transition="transition"
          >
            <div className="column">
              <img src={logo1} alt="" />
            </div>
            <div className="column">
              <div className="footer-line"></div>
              <h3>SOCIAL</h3>
              <ul>
                <li>
                  <a
                    href="https://www.linkedin.com/company/flynovate/"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    LinkedIn
                  </a>
                </li>
                {/* <li>
                  <a>Twitter</a>
                </li> */}
                <li>
                  <a
                    href="https://www.instagram.com/_flynovate_/"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
            <div className="column">
              <div className="footer-line"></div>
              <h3>FLYNOVATE</h3>
              <ul>
                <li>
                  <a
                    href="#aboutUs"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/news"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    News & Articles
                  </a>
                </li>
                <li>
                  <a href="#">Career</a>
                </li>
              </ul>
            </div>
            <div className="column">
              <div className="footer-line"></div>
              <h3>LEGAL</h3>
              <ul>
                <li>
                  <a href="#">Terms and Conditions</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </motion.div>
        </footer>
      </div>
    </motion.div>
  );
};

export default PromoPage;
