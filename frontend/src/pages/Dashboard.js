import { API_BASE } from "../apiConfig";
import React, { useState, useEffect } from "react";
import SearchBuses from "../components/SearchBuses";
import SeatSelection from "../components/SeatSelection";
import PassengerDetails from "../components/PassengerDetails";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const user = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
      return;
    }
    if (role === "admin") {
      window.location.href = "/admin";
      return;
    }

    loadBuses();
    loadBookings();
    fetchComplaints();

    const intervalId = setInterval(() => {
      loadBuses();
      loadBookings();
      fetchComplaints();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [user, role]);

  const loadBuses = async (filters = {}) => {
    let url = `${API_BASE}/api/buses`;
    const query = new URLSearchParams(filters).toString();
    if (query) url += `?${query}`;
    const res = await fetch(url);
    const data = await res.json();
    setBuses(data);
  };

  const loadBookings = async () => {
    const res = await fetch(`${API_BASE}/api/my-bookings/${user}`);
    const data = await res.json();
    setBookings(data);
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/complaints/${user}`);
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints", err);
    }
  };

  const handleSeatToggle = (seatNumber) => {
    setSelectedSeats((prev) => {
      const newSeats = prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber];

      setPassengers(newSeats.map((seatBtn) => {
        const existing = passengers.find((p) => p.seatNumber === seatBtn);
        return (
          existing || { seatNumber: seatBtn, name: "", age: "", gender: "" }
        );
      }));
      return newSeats;
    });
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const bookBus = async (e) => {
    e.preventDefault();
    if (!selectedBus || passengers.length === 0) {
      alert("Please select seats");
      return;
    }
    await fetch(`${API_BASE}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        busId: selectedBus._id,
        customerName: user,
        passengers,
      }),
    });
    alert("🎉 Booking successful!");
    setSelectedSeats([]);
    setPassengers([]);
    setSelectedBus(null);
    loadBuses();
    loadBookings();
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const formatRoute = (bus) =>
    bus.route || `${bus.sourceCity || ""}${bus.sourceCity ? " - " : ""}${bus.destinationCity || ""}`.trim();

  const formatDate = (bus) => {
    if (!bus.journeyDate) return "";
    try {
      return new Date(bus.journeyDate).toLocaleDateString();
    } catch {
      return "";
    }
  };

  const getCardImageSrc = (bus, index) => {
    if (bus?.image) return bus.image; // can be absolute URL or /b1.jpg
    if (bus?.imageUrl) return bus.imageUrl;
    const num = Number(bus?.busNumber);
    if (num >= 1 && num <= 5) {
      return `/b${num}.jpg`;
    }
    const slot = ((num || index || 0) % 5) + 1;
    return `/b${slot}.jpg`;
  };

  const BusCard = ({ bus, index }) => {
    const [imgFailed, setImgFailed] = useState(false);
    const route = formatRoute(bus) || "Route not set";
    const date = formatDate(bus);
    const time = bus.departureTime || "";
    const driver = bus.driver || bus.driverName || bus.driver_name || "Not assigned";
    const busNo = bus.busNumber ?? bus.busNo ?? bus.number ?? "-";

    return (
      <div className="bus-card" title={route}>
        <div className={`bus-card-media ${imgFailed ? "no-image" : ""}`}>
          {!imgFailed && (
            <img
              className="bus-card-img"
              src={getCardImageSrc(bus, index)}
              alt={`Bus ${busNo}`}
              onError={() => setImgFailed(true)}
              loading="lazy"
            />
          )}
          {imgFailed && <div className="bus-card-img-fallback">No Image</div>}
        </div>
        <div className="bus-card-body">
          <div className="bus-card-title">BUS NO: {busNo}</div>
          <div className="bus-card-meta">
            <div>
              <strong>Route:</strong> {route}
            </div>
            <div>
              <strong>Driver:</strong> {driver}
            </div>
            {(date || time) && (
              <div className="bus-card-meta-row">
                {date && (
                  <span>
                    <strong>Date:</strong> {date}
                  </span>
                )}
                {time && (
                  <span>
                    <strong>Time:</strong> {time}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <div className="container" style={{ marginTop: "20px" }}>
        {!selectedBus ? (
          <>
            <section style={{ paddingBottom: "10px" }}>
              <div className="bus-strip">
                {(buses || []).slice(0, 5).map((bus, index) => (
                  <BusCard key={bus._id || `${bus.busNumber}-${index}`} bus={bus} index={index} />
                ))}
                {(buses || []).length === 0 && (
                  <>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <BusCard
                        key={`placeholder-${index}`}
                        bus={{
                          busNumber: index + 1,
                          route: "Pondicherry - Chennai",
                          departureTime: "09:00 AM",
                          driverName: "Not assigned",
                        }}
                        index={index}
                      />
                    ))}
                  </>
                )}
              </div>
            </section>

            <section>
              <SearchBuses onSearch={(filters) => loadBuses(filters)} />
            </section>

            <section>
              <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>
                Available Buses
              </h2>
              <table id="bus-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Seats Info</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus._id}>
                      <td>{bus.busNumber}</td>
                      <td>
                        {bus.route || `${bus.sourceCity} - ${bus.destinationCity}`}
                      </td>
                      <td>
                        {bus.journeyDate
                          ? new Date(bus.journeyDate).toLocaleDateString()
                          : ""}
                      </td>
                      <td>{bus.departureTime}</td>
                      <td>₹{bus.price}</td>
                      <td>
                        {bus.availableSeats}/{bus.totalSeats}
                      </td>
                      <td>
                        <button
                          className="select-btn"
                          onClick={() => setSelectedBus(bus)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                  {buses.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No buses found for your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            <section id="booking-list-section">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <h2 style={{ fontSize: "18px", marginBottom: 0 }}>My Bookings</h2>
                <button
                  id="load-bookings-btn"
                  onClick={loadBookings}
                  style={{ cursor: "pointer" }}
                >
                  Load Bookings
                </button>
              </div>
              <div style={{ marginTop: "10px" }}>
                {bookings.length === 0 && <p>No bookings found.</p>}
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "20px",
                      borderLeft: "5px solid #667eea",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    }}
                  >
                    <strong style={{ fontSize: "16px", display: "block" }}>
                      {b.bus
                        ? `${b.bus.sourceCity} to ${b.bus.destinationCity} `
                        : "Bus details unavailable "}
                      {b.bus?.journeyDate && (
                        <span style={{ color: "#666", fontWeight: "normal" }}>
                          (
                          {new Date(b.bus.journeyDate).toLocaleDateString()} @{" "}
                          {b.bus.departureTime})
                        </span>
                      )}
                    </strong>
                    <div
                      style={{
                        color: "#555",
                        fontSize: "13px",
                        margin: "8px 0",
                        fontStyle: "italic",
                      }}
                    >
                      Transaction ID: {b._id} | Amount: ₹{b.totalAmount}
                    </div>
                    {b.passengers && b.passengers.length > 0 ? (
                      <div>
                        {b.passengers.map((p, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: "#e3f2fd",
                              color: "#1976d2",
                              padding: "5px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              display: "inline-block",
                              marginRight: "10px",
                              marginTop: "10px",
                            }}
                          >
                            Seat {p.seatNumber}: {p.name} ({p.age}, {p.gender})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{ color: "#666", fontSize: "13px", marginTop: "10px" }}
                      >
                        {b.seatsBooked} seats booked
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="faq-section">
              <div className="faq-container">
                <h2>Frequently Asked Questions</h2>
                {[
                  { q: "Can I cancel my booking?", a: "Yes, you can cancel your booking up to 24 hours before the journey for a full refund." },
                  { q: "Is payment secure?", a: "We use standard encryption to ensure all your transaction data is safe and secure." },
                  { q: "How to see my bookings?", a: "Your bookings are listed under the 'My Bookings' section on your dashboard." }
                ].map((item, idx) => (
                  <div key={idx} className="faq-item">
                    <div className="faq-question" onClick={(e) => e.currentTarget.parentElement.classList.toggle('active')}>
                      {item.q} <span>▼</span>
                    </div>
                    <div className="faq-answer">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>

            <footer className="site-footer">
              <div className="footer-links">
                <div className="footer-column">
                  <h4>About MV Bus</h4>
                  <p>Contact us</p>
                  <p>Sitemap</p>
                  <p>Offers</p>
                  <p>Careers</p>
                </div>
                <div className="footer-column">
                  <h4>Info</h4>
                  <p>T&C</p>
                  <p>Privacy policy</p>
                  <p>Blog</p>
                  <p>Bus Timetable</p>
                </div>
              </div>
              <div className="footer-bottom">
                © {new Date().getFullYear()} MV Bus Pvt Ltd. All rights reserved.
              </div>
            </footer>
          </>
        ) : (
          <div style={{ padding: "20px" }}>
            <button
              onClick={() => {
                setSelectedBus(null);
                setSelectedSeats([]);
                setPassengers([]);
              }}
              style={{
                background: "#ccc",
                color: "#333",
                border: "none",
                padding: "10px 20px",
                borderRadius: "20px",
                cursor: "pointer",
                marginBottom: "20px",
                fontWeight: "bold",
              }}
            >
              ← Cancel & Back
            </button>
            <SeatSelection
              bus={selectedBus}
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
            />
            {selectedSeats.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <PassengerDetails
                  passengers={passengers}
                  onPassengerChange={handlePassengerChange}
                  onSubmit={bookBus}
                  totalAmount={selectedBus.price * selectedSeats.length}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
