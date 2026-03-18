import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import Navbar from "../components/Navbar";

function ContactUs() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }
    fetchComplaints();

    const intervalId = setInterval(() => {
      fetchComplaints();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [username, navigate]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/complaints/${username}`,
      );
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, subject, message }),
      });
      if (res.ok) {
        alert("Message sent successfully!");
        setSubject("");
        setMessage("");
        fetchComplaints();
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      alert("Error sending message");
    }
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="premium-page">
      <Navbar />

      <div className="premium-card">
        <h2 style={{ color: "#ff6b6b", fontSize: '28px', marginBottom: '10px' }}>Contact Support</h2>
        <p style={{ color: "#555", marginBottom: "30px", fontSize: '15px' }}>
          Our team is here to help you 24/7 with any booking or account inquiries.
        </p>

        <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
          <div className="profile-info-group">
            <label>📌 Subject</label>
            <input
              type="text"
              className="premium-input"
              placeholder="What is this regarding?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="profile-info-group">
            <label>💬 Message</label>
            <textarea
              className="premium-input"
              placeholder="Describe your issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="5"
              style={{ fontFamily: "inherit", resize: 'vertical' }}
            ></textarea>
          </div>
          <button
            type="submit"
            className="action-btn"
            style={{ width: '100%', padding: '15px', marginTop: '10px' }}
          >
            Send Message to Admin
          </button>
        </form>

        <h3
          style={{
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            paddingBottom: "15px",
            marginBottom: "25px",
            color: '#333'
          }}
        >
          Support Ticket History
        </h3>
        {complaints.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>You have no active support tickets.</p>
        ) : (
          complaints.map((c) => (
            <div
              key={c._id}
              className="section-card"
              style={{
                background: 'rgba(255,255,255,0.5)',
                borderLeft: c.isResolved
                  ? "5px solid #4caf50"
                  : "5px solid #ff9800",
                marginBottom: "20px",
                padding: '20px',
                borderRadius: '12px'
              }}
            >
              <div
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <strong style={{ fontSize: '16px' }}>{c.subject}</strong>
                <span className={`status-badge ${c.isResolved ? 'resolved' : 'pending'}`}>
                  {c.isResolved ? "✅ Resolved" : "⏳ Working on it"}
                </span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginBottom: "12px",
                }}
              >
                Submitted on {new Date(c.createdAt).toLocaleDateString()}
              </p>
              <p style={{ whiteSpace: "pre-wrap", color: '#444', fontSize: '14px' }}>{c.message}</p>
              {c.isResolved && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    background: "#f1f8e9",
                    borderRadius: "8px",
                    borderLeft: '3px solid #4caf50'
                  }}
                >
                  <strong style={{ color: "#2e7d32", fontSize: '13px' }}>
                    Reply from {c.repliedByAdmin || "Support"}:
                  </strong>
                  <p style={{ marginTop: "5px", whiteSpace: "pre-wrap", fontSize: '14px' }}>
                    {c.reply}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ContactUs;
