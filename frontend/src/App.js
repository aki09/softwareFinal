import 'bootstrap/dist/css/bootstrap.min.css';
import React,{ useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import InspectionReport from './pages/InspectionReport';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './pages/userlogin';
import Register from './pages/useregister';
import FormMap from './pages/Grid';
import Adminlogin from './pages/admin/adminlogin'
import AdminHome from './pages/admin/adminhome'
import Allocation from './pages/admin/Allocation';
import NotFound from './pages/404';
import Cookies from 'js-cookie';
import { Navigate,useNavigate } from "react-router-dom";


function App() {
  const isLoggedIn = !!Cookies.get('auth-token');
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />
        <Route exact path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <Register />} />
        <Route exact path="/home" element={<Dashboard/>}/>
        <Route exact path="/grid" element={<FormMap/>} />
        <Route exact path="/report" element={<InspectionReport/>} />

        <Route exact path="/pchia" element={<Adminlogin/>} />
        <Route exact path="/pchiahome" element={<AdminHome/>} />
        <Route exact path="/pchiaallocation" element={<Allocation/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
