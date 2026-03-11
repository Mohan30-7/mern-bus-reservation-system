import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../apiConfig";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Password has been successfully reset!");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to reset password");
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
        <h2 style={{ marginBottom: 10, color: "#333" }}>Set New Password</h2>
        <p style={{ marginBottom: 25, color: "#666" }}>
          Enter your new password below
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

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>
            Update Password
          </button>
        </form>

        <p style={{ marginTop: 20 }}>
          <Link to="/" style={{ color: "#e53935", fontWeight: "bold" }}>
            Return to Login
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

export default ResetPassword;
