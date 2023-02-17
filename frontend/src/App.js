import 'bootstrap/dist/css/bootstrap.min.css';
import React,{ useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import InspectionReport from './pages/InspectionReport';
import { Routes, Switch, Route, BrowserRouter } from "react-router-dom";
import Login from './pages/userlogin';
import Register from './pages/useregister';

function App() {
  const [ user, setLoginUser] = useState({})
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Register/>} />
        <Route exact path="/home" element={<Dashboard/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
