import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { RiAdminFill } from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Cookies from "js-cookie";
import axios from "axios";
import { Spinner } from "react-bootstrap";

const UserProfile = () => {
  const [user, setUser] = useState([]);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    company: "",
  });

  let cookie = Cookies.get("auth-token");
  const isLoggedIn = !!Cookies.get("auth-token");
  const navigate = useNavigate();

  const handleSignout = (event) => {
    event.preventDefault();
    const authToken = Cookies.get("auth-token");
    if (authToken) {
      Cookies.remove("auth-token");
      if (!Cookies.get("auth-token")) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (cookie) {
      fetchData();
      console.log(user);
    } else {
      setTimeout(() => {
        navigate("/login");
      }, 0);
    }
  }, [cookie, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER + "/home", {
        params: { cookieValue: cookie },
      });
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

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    setNavbarHeight(navbar.offsetHeight);
  }, []);

  if (!isLoggedIn) {
    navigate("/login");
  } else {
    return (
      <>
        {isLoading ? (
          <div
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
        ) : (
          <>
            <Navbar expand="lg" fixed="top" className="navbar bg-light">
              <Container>
                <Navbar.Brand>
                  <Link to="/home">
                    <img src={logo} alt="" height="50" width="160" />
                  </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse
                  id="basic-navbar-nav"
                  className="justify-content-end"
                >
                  <Nav className="mr-auto">
                    <div className="pt-1 pb-2">
                      <Link to="/home">
                        <Button
                          variant="outline-secondary"
                          size="md"
                          className="ps-3 pe-3 me-1"
                        >
                          Dashboard
                        </Button>
                      </Link>
                    </div>
                    <div className="pt-1 pb-2">
                      <Link to="/report">
                        <Button
                          variant="outline-secondary"
                          size="md"
                          className="ps-3 pe-3 me-1"
                        >
                          Inspection Reports
                        </Button>
                      </Link>
                    </div>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <div
              className="container"
              style={{ marginTop: `${navbarHeight}px` }}
            >
              <div className="row">
                <div className="col-md-3 border-right">
                  <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                    <img
                      className="rounded-circle"
                      width="150px"
                      src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                      alt="pfp"
                    />
                    <span
                      className="font-weight-bold"
                      style={{ textTransform: "capitalize" }}
                    >
                      {user.company}
                    </span>
                    <span className="text-black-50">{user.email}</span>
                    <span> </span>
                  </div>
                </div>
                <div className="col-md-5 border-right">
                  <div className="p-3 py-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="text-right">Profile Settings</h4>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-12">
                        <label className="labels">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user.userName}
                          onChange={(event) =>
                            setFormValues({
                              ...formValues,
                              userName: event.target.value,
                            })
                          }
                          placeholder={`${user.userName}`}
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="labels">Company</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user.company}
                          onChange={(event) =>
                            setFormValues({
                              ...formValues,
                              company: event.target.value,
                            })
                          }
                          placeholder={`${user.company}`}
                        />
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      <button
                        className="btn btn-primary profile-button"
                        type="button"
                      >
                        Save Profile
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 py-5">
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 className="text-right">Manage Profile</h3>
                    </div>
                    <div className="mt-3">
                      <div className="w-full">
                        <Button
                          variant="outline-secondary"
                          size="md"
                          className="px-5 py-2"
                        >
                          Change Password
                        </Button>
                      </div>
                      <div className="w-full my-1">
                        <Button
                          variant="outline-secondary"
                          size="md"
                          className="px-5 py-2"
                        >
                          Delete Account
                        </Button>
                      </div>
                      <div className="w-full">
                        <Button
                          variant="outline-secondary"
                          size="md"
                          className="px-5 py-2"
                          onClick={(event) => handleSignout(event)}
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
};

export default UserProfile;
