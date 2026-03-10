import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Signup failed");
      } else {
        alert("Signup successful");
        navigate("/");
      }
    } catch (err) {
      setMessage("Backend not reachable");
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 420,
          background: "#fff",
          padding: 35,
          borderRadius: 20,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#e53935", marginBottom: 5, fontSize: "28px" }}>
          🚌 MV Bus
        </h1>
        <h2 style={{ marginBottom: 10, color: "#333" }}>Create Account</h2>
        <p style={{ marginBottom: 25, color: "#666" }}>
          Sign up to book bus tickets
        </p>
        {message && <p style={{ color: "red", marginBottom: 15 }}>{message}</p>}
        <form onSubmit={handleSignup}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Phone Number (+91 ...)"
            value={phone}
            style={inputStyle}
            onChange={(e) => {
              let val = e.target.value;
              if (!val.startsWith("+91 ")) {
                val = "+91 " + val.replace(/^\+91\s*/, "");
              }
              const digitsOnly = val.substring(4).replace(/\D/g, "");
              if (digitsOnly.length <= 10) {
                setPhone("+91 " + digitsOnly);
              }
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Create Account
          </button>
        </form>
        <p style={{ marginTop: 20 }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#e53935", fontWeight: "bold" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "14px",
};
const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#ff6b6b",
  color: "#fff",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
};
export default Signup;
