import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("buses");

  const [newBus, setNewBus] = useState({
    sourceCity: "",
    destinationCity: "",
    journeyDate: "",
    departureTime: "",
    price: "",
    busNumber: "",
    image: null,
  });

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "admin",
  });
  const [complaints, setComplaints] = useState([]);
  const [replyText, setReplyText] = useState({});

  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/dashboard");
      return;
    }
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [role, navigate]);

  const fetchData = async () => {
    try {
      const busRes = await fetch("http://localhost:5000/api/buses");
      const bData = await busRes.json();
      setBuses(bData);

      const bookRes = await fetch("http://localhost:5000/api/admin/bookings");
      const bookData = await bookRes.json();
      setBookings(bookData);

      const userRes = await fetch("http://localhost:5000/api/admin/users");
      const uData = await userRes.json();
      setUsers(uData);

      const compRes = await fetch("http://localhost:5000/api/admin/complaints");
      const cData = await compRes.json();
      setComplaints(cData);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleDeleteBus = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/buses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      alert("Failed to delete bus");
    }
  };

  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("sourceCity", newBus.sourceCity);
      formData.append("destinationCity", newBus.destinationCity);
      formData.append("journeyDate", newBus.journeyDate);
      formData.append("departureTime", newBus.departureTime);
      formData.append("price", newBus.price);
      formData.append("busNumber", newBus.busNumber);
      if (newBus.image) {
        formData.append("image", newBus.image);
      }

      const res = await fetch("http://localhost:5000/api/admin/buses", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Bus added successfully!");
        setNewBus({
          sourceCity: "",
          destinationCity: "",
          journeyDate: "",
          departureTime: "",
          price: "",
          busNumber: "",
          image: null,
        });
        fetchData();
      } else {
        alert("Failed to add bus");
      }
    } catch (error) {
      console.error("Error adding bus", error);
      alert("Error adding bus");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        alert("Account created successfully!");
        setNewUser({
          username: "",
          password: "",
          email: "",
          phone: "",
          role: "admin",
        });
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to add account");
      }
    } catch (error) {
      alert("Error adding account");
    }
  };

  const handleReply = async (complaintId) => {
    if (!replyText[complaintId]) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/complaints/${complaintId}/reply`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reply: replyText[complaintId],
            repliedByAdmin: username,
          }),
        },
      );
      if (res.ok) {
        alert("Reply sent!");
        setReplyText((prev) => ({ ...prev, [complaintId]: "" }));
        fetchData();
      } else {
        alert("Failed to send reply");
      }
    } catch (error) {
      alert("Error sending reply");
    }
  };

  return (
    <>
      <header className="top-nav" style={{ marginBottom: '20px' }}>
        <div className="nav-left">
          <span className="brand" style={{ color: '#e53935', fontWeight: 'bold' }}>🚌 Admin Panel</span>
        </div>
        <div className="nav-right">
          <button className="nav-link" onClick={handleLogout}>
            🚪 Logout ({username})
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-sidebar">
          <button
            className={activeTab === "buses" ? "active" : ""}
            onClick={() => setActiveTab("buses")}
          >
            Manage Buses
          </button>
          <button
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            All Bookings
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={activeTab === "complaints" ? "active" : ""}
            onClick={() => setActiveTab("complaints")}
          >
            User Complaints
          </button>
        </div>

        <div className="admin-main">
          {activeTab === "buses" && (
            <div>
              <h3>Add New Bus</h3>
              <form onSubmit={handleAddBus} className="admin-form">
                <input
                  type="text"
                  placeholder="Source City"
                  value={newBus.sourceCity}
                  onChange={(e) =>
                    setNewBus({ ...newBus, sourceCity: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Destination City"
                  value={newBus.destinationCity}
                  onChange={(e) =>
                    setNewBus({ ...newBus, destinationCity: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  value={newBus.journeyDate}
                  onChange={(e) =>
                    setNewBus({ ...newBus, journeyDate: e.target.value })
                  }
                  required
                />
                <input
                  type="time"
                  value={newBus.departureTime}
                  onChange={(e) =>
                    setNewBus({ ...newBus, departureTime: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newBus.price}
                  onChange={(e) =>
                    setNewBus({ ...newBus, price: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Bus Number"
                  value={newBus.busNumber}
                  onChange={(e) =>
                    setNewBus({ ...newBus, busNumber: e.target.value })
                  }
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewBus({ ...newBus, image: e.target.files[0] })
                  }
                  required
                />
                <button
                  type="submit"
                  className="action-btn"
                  style={{ background: "#e53935", color: "white", padding: "8px 18px" }}
                >
                  Add Bus
                </button>
              </form>

              <h3>Available Buses</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Bus Number</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Date</th>
                    <th>Departure</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus._id}>
                      <td>{bus.busNumber}</td>
                      <td>{bus.sourceCity}</td>
                      <td>{bus.destinationCity}</td>
                      <td>
                        {bus.journeyDate
                          ? new Date(bus.journeyDate).toLocaleDateString()
                          : ""}
                      </td>
                      <td>{bus.departureTime}</td>
                      <td>₹{bus.price}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteBus(bus._id)}
                          className="action-btn"
                          style={{
                            background: "#e53935",
                            color: "white",
                            padding: "6px 12px",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h3>All Bookings</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Bus</th>
                    <th>Passengers</th>
                    <th>Seats</th>
                    <th>Total Price</th>
                    <th>Booking Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.customerName}</td>
                      <td>
                        {booking.bus
                          ? `${booking.bus.sourceCity} to ${booking.bus.destinationCity} (${booking.bus.busNumber})`
                          : "Bus info unavailable"}
                      </td>
                      <td>
                        {booking.passengers.map((p, idx) => (
                          <div key={idx}>
                            {p.name} ({p.age}, {p.gender})
                          </div>
                        ))}
                      </td>
                      <td>
                        {booking.passengers.map((p) => p.seatNumber).join(", ")}
                      </td>
                      <td>₹{booking.totalAmount}</td>
                      <td>
                        {booking.bookedAt
                          ? new Date(booking.bookedAt).toLocaleDateString()
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h3>Add New Admin</h3>
              <form onSubmit={handleAddUser} className="admin-form">
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Phone Number (+91 ...)"
                  value={newUser.phone}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (!val.startsWith("+91 ")) {
                      val = "+91 " + val.replace(/^\+91\s*/, "");
                    }
                    const digitsOnly = val.substring(4).replace(/\D/g, "");
                    if (digitsOnly.length <= 10) {
                      setNewUser({ ...newUser, phone: "+91 " + digitsOnly });
                    }
                  }}
                  required
                />
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="admin">Admin</option>
                </select>
                <button
                  type="submit"
                  className="action-btn"
                  style={{ background: "#e53935", color: "white" }}
                >
                  Create Account
                </button>
              </form>

              <h3>Registered Users</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.username}</td>
                      <td>{u.role}</td>
                      <td>{u.email || "N/A"}</td>
                      <td>{u.phone || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "complaints" && (
            <div>
              <h3>User Complaints</h3>
              {complaints.length === 0 ? (
                <p>No complaints available.</p>
              ) : (
                complaints.map((c) => (
                  <div
                    key={c._id}
                    className="section-card"
                    style={{ marginBottom: "20px" }}
                  >
                    <h4 style={{ marginBottom: "10px" }}>{c.subject}</h4>
                    <p style={{ color: "#666", fontSize: "14px" }}>
                      <strong>From:</strong> {c.username} |{" "}
                      <strong>Submitted:</strong>{" "}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                    <p
                      style={{
                        margin: "15px 0",
                        padding: "15px",
                        background: "#f8f9fa",
                        borderLeft: "4px solid #ff6b6b",
                        borderRadius: "4px",
                      }}
                    >
                      {c.message}
                    </p>
                    {c.isResolved ? (
                      <div
                        style={{
                          padding: "15px",
                          background: "#ffebee",
                          borderRadius: "8px",
                          borderLeft: "4px solid #e53935",
                        }}
                      >
                        <strong style={{ color: "#e53935" }}>
                          {c.repliedByAdmin === username
                            ? "Your reply:"
                            : `Admin ${c.repliedByAdmin || "Admin"} reply: `}
                        </strong>
                        <p style={{ marginTop: "10px" }}>{c.reply}</p>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "15px",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Type your reply here..."
                          style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                          }}
                          value={replyText[c._id] || ""}
                          onChange={(e) =>
                            setReplyText({
                              ...replyText,
                              [c._id]: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          onClick={() => handleReply(c._id)}
                          className="action-btn"
                          style={{ padding: "0 25px" }}
                        >
                          Send Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
