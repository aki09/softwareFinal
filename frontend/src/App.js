import 'bootstrap/dist/css/bootstrap.min.css';
import React,{ useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import InspectionReport from './pages/InspectionReport';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './pages/userlogin';
import Register from './pages/useregister';
import FormMap from './pages/Grid';
import Adminlogin from './pages/adminlogin'
import AdminHome from './pages/adminhome'
import Allocation from './pages/Allocation';

function App() {
  const [ user, setLoginUser] = useState({})
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Register/>} />
        <Route exact path="/home" element={<Dashboard/>} />
        <Route exact path="/grid" element={<FormMap/>} />
        <Route exact path="/pchia" element={<Adminlogin/>} />
        <Route exact path="/pchiahome" element={<AdminHome/>} />
        <Route exact path="/report" element={<InspectionReport/>} />
        <Route exact path="/pchiaallocation" element={<Allocation/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
