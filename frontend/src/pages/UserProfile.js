import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
import Navbar from "../components/Navbar";

const UserProfile = () => {
  const [profile, setProfile] = useState({ email: "", phone: "" });
  const user = localStorage.getItem("username");

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
    }
    fetch(`${API_BASE}/api/user/${user}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          setProfile({ email: data.email || "", phone: data.phone || "" });
        }
      });
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/user/${user}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      alert("Profile updated successfully!");
    } else {
      alert("Error updating profile");
    }
  };

  return (
    <div className="premium-page">
      <Navbar />

      <div className="premium-card" style={{ maxWidth: '600px' }}>
        <div className="profile-header">
          <div className="avatar-circle">
            {user ? user.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '5px' }}>{user}</h2>
          <span className="profile-badge">Verified Member</span>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="profile-info-group">
            <label>📧 Email Address</label>
            <input
              type="email"
              className="premium-input"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder="your-email@example.com"
            />
          </div>

          <div className="profile-info-group">
            <label>📱 Phone Number</label>
            <input
              type="text"
              className="premium-input"
              value={profile.phone}
              onChange={(e) => {
                let val = e.target.value;
                if (!val.startsWith("+91 ")) {
                  val = "+91 " + val.replace(/^\+91\s*/, "");
                }
                const digitsOnly = val.substring(4).replace(/\D/g, "");
                if (digitsOnly.length <= 10) {
                  setProfile({ ...profile, phone: "+91 " + digitsOnly });
                }
              }}
              placeholder="+91 9876543210"
            />
          </div>

          <button type="submit" className="action-btn" style={{ width: '100%', padding: '15px', marginTop: '10px' }}>
            Apply Profile Changes
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '30px', color: '#888', fontSize: '12px' }}>
          MV Bus secure profile management system
        </p>
      </div>
    </div>
  );
};
export default UserProfile;
