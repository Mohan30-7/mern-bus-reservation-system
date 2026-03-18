import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <header className="top-nav">
      <div className="nav-left">
        <span className="brand">🚌 mohanavijayan</span>
      </div>
      <div className="nav-right">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Home
        </NavLink>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          💛 Support
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          👤 Profile
        </NavLink>
        {role === "admin" && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Admin Panel
          </NavLink>
        )}
        <button className="nav-link logout-btn" onClick={logout}>
          🚪 Logout ({username})
        </button>
      </div>
    </header>
  );
};

export default Navbar;
