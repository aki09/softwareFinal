import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./pages/user/Dashboard";
import InspectionReport from "./pages/user/InspectionReport";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/user/userlogin";
import Register from "./pages/user/useregister";
import FormMap from "./pages/user/Grid";
import UserProfile from "./pages/user/profile";
import Adminlogin from "./pages/admin/adminlogin";
import AdminHome from "./pages/admin/adminhome";
import Allocation from "./pages/admin/Allocation";
import NotFound from "./pages/404";
import Cookies from "js-cookie";
import { Navigate, useNavigate} from "react-router-dom";
import PromoPage from "./pages/promo/indexpromo";
import News from "./pages/promo/news";
import Forgot from "./pages/user/userforgot"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<PromoPage />} />
        <Route exact path="/news" element={<News />} />

        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Register />} />
        <Route exact path="/forgot" element={<Forgot />} />

        <Route exact path="/home" element={<Dashboard />} />
        <Route exact path="/grid" element={<FormMap />} />
        <Route exact path="/report" element={<InspectionReport />} />
        <Route exact path="/profile" element={<UserProfile />} />

        <Route exact path="/pchia" element={<Adminlogin />} />
        <Route exact path="/pchiahome" element={<AdminHome />} />
        <Route exact path="/pchiaallocation" element={<Allocation />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
