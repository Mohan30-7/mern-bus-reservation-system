import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(
          "Reset link generated! Please check the backend terminal console to find your link.",
        );
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to request reset");
      }
    } catch (err) {
      setStatus("error");
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
        <h2 style={{ marginBottom: 10, color: "#333" }}>Forgot Password</h2>
        <p style={{ marginBottom: 25, color: "#666" }}>
          Enter your username to reset your password
        </p>

        {message && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              background: status === "success" ? "#e8f5e9" : "#ffebee",
              color: status === "success" ? "#2e7d32" : "#c62828",
              border: `1px solid ${status === "success" ? "#c8e6c9" : "#ffcdd2"}`,
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleForgot}>
          <input
            placeholder="Enter your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>
            Request Reset Link
          </button>
        </form>

        <p style={{ marginTop: 20 }}>
          Remembered it?{" "}
          <Link to="/" style={{ color: "#e53935", fontWeight: "bold" }}>
            Back to Login
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
  boxSizing: "border-box",
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

export default ForgotPassword;
