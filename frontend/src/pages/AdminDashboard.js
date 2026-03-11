import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../apiConfig";

const API = API_BASE;

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
const busRes = await fetch(`${API}/api/buses`);
const bData = await busRes.json();
setBuses(bData);


  const bookRes = await fetch(`${API}/api/admin/bookings`);
  const bookData = await bookRes.json();
  setBookings(bookData);

  const userRes = await fetch(`${API}/api/admin/users`);
  const uData = await userRes.json();
  setUsers(uData);

  const compRes = await fetch(`${API}/api/admin/complaints`);
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
  const res = await fetch(`${API}/api/admin/buses/${id}`, {
    method: "DELETE",
  });

  if (res.ok) fetchData();
} catch {
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

  const res = await fetch(`${API}/api/admin/buses`, {
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
  console.error(error);
  alert("Error adding bus");
}


};

const handleAddUser = async (e) => {
e.preventDefault();


try {
  const res = await fetch(`${API}/api/admin/users`, {
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
} catch {
  alert("Error adding account");
}


};

const handleReply = async (complaintId) => {
if (!replyText[complaintId]) return;


try {
  const res = await fetch(
    `${API}/api/admin/complaints/${complaintId}/reply`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: replyText[complaintId],
        repliedByAdmin: username,
      }),
    }
  );

  if (res.ok) {
    alert("Reply sent!");

    setReplyText((prev) => ({ ...prev, [complaintId]: "" }));

    fetchData();
  } else {
    alert("Failed to send reply");
  }
} catch {
  alert("Error sending reply");
}


};

return (
<> <header className="top-nav"> <div className="nav-left"> <span className="brand">🚌 Admin Panel</span> </div>


    <div className="nav-right">
      <button onClick={handleLogout}>
        🚪 Logout ({username})
      </button>
    </div>
  </header>

  <div className="admin-content">

    <div className="admin-sidebar">
      <button className={activeTab === "buses" ? "active" : ""} onClick={() => setActiveTab("buses")}>Manage Buses</button>
      <button className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>All Bookings</button>
      <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</button>
      <button className={activeTab === "complaints" ? "active" : ""} onClick={() => setActiveTab("complaints")}>User Complaints</button>
    </div>

    <div className="admin-main">

      {activeTab === "buses" && (
        <div>
          <h3>Add New Bus</h3>
          <form className="admin-form" onSubmit={handleAddBus}>
            <input placeholder="Source City" required
              value={newBus.sourceCity}
              onChange={(e)=>setNewBus({...newBus,sourceCity:e.target.value})}/>

            <input placeholder="Destination City" required
              value={newBus.destinationCity}
              onChange={(e)=>setNewBus({...newBus,destinationCity:e.target.value})}/>

            <input type="date" required
              value={newBus.journeyDate}
              onChange={(e)=>setNewBus({...newBus,journeyDate:e.target.value})}/>

            <input type="time" required
              value={newBus.departureTime}
              onChange={(e)=>setNewBus({...newBus,departureTime:e.target.value})}/>

            <input type="number" placeholder="Price" required
              value={newBus.price}
              onChange={(e)=>setNewBus({...newBus,price:e.target.value})}/>

            <input type="number" placeholder="Bus Number" required
              value={newBus.busNumber}
              onChange={(e)=>setNewBus({...newBus,busNumber:e.target.value})}/>

            <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
              <label style={{fontSize:'12px', color:'#666'}}>Bus Image</label>
              <input type="file" accept="image/*"
                onChange={(e)=>setNewBus({...newBus,image:e.target.files[0]})}/>
            </div>

            <button type="submit" className="action-btn">Add Bus</button>
          </form>

          <h3>All Buses</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bus No.</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Date</th>
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
                  <td>{new Date(bus.journeyDate).toLocaleDateString()}</td>
                  <td>₹{bus.price}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteBus(bus._id)}>Delete</button>
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
                <th>Customer</th>
                <th>Bus Info</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.customerName}</td>
                  <td>{b.bus ? `${b.bus.sourceCity} -> ${b.bus.destinationCity}` : "N/A"}</td>
                  <td>{b.seatsBooked}</td>
                  <td>₹{b.totalAmount}</td>
                  <td><span className="badge">{b.paymentStatus}</span></td>
                  <td>{new Date(b.bookedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "users" && (
        <div>
          <h3>Add Admin Account</h3>
          <form className="admin-form" onSubmit={handleAddUser}>
            <input placeholder="Username" required value={newUser.username} onChange={(e)=>setNewUser({...newUser, username: e.target.value})} />
            <input type="password" placeholder="Password" required value={newUser.password} onChange={(e)=>setNewUser({...newUser, password: e.target.value})} />
            <input placeholder="Email" required value={newUser.email} onChange={(e)=>setNewUser({...newUser, email: e.target.value})} />
            <input placeholder="Phone" required value={newUser.phone} onChange={(e)=>setNewUser({...newUser, phone: e.target.value})} />
            <select value={newUser.role} onChange={(e)=>setNewUser({...newUser, role: e.target.value})}>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <button type="submit" className="action-btn">Create Account</button>
          </form>

          <h3 style={{marginTop:'30px'}}>All Users</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td><span className={u.role === 'admin' ? 'role-admin' : 'role-user'}>{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "complaints" && (
        <div>
          <h3>User Complaints</h3>
          <div className="complaints-container">
            {complaints.length === 0 ? <p>No complaints found.</p> : complaints.map((c) => (
              <div key={c._id} className="section-card" style={{padding:'20px', marginBottom:'15px', border:'1px solid #eee'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                  <strong>{c.username}</strong>
                  <span style={{fontSize:'12px', color:'#888'}}>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p><strong>Subject:</strong> {c.subject}</p>
                <div style={{background:'#f9f9f9', padding:'10px', borderRadius:'8px', margin:'10px 0'}}>
                  <p>{c.message}</p>
                </div>
                
                {c.reply ? (
                  <div style={{borderLeft:'4px solid #4caf50', paddingLeft:'15px', marginTop:'15px'}}>
                    <p style={{color:'#4caf50', fontWeight:'bold', fontSize:'13px'}}>✓ Replied by {c.repliedByAdmin}:</p>
                    <p>{c.reply}</p>
                  </div>
                ) : (
                  <div style={{marginTop:'15px'}}>
                    <textarea 
                      placeholder="Write your reply here..."
                      style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd', minHeight:'80px'}}
                      value={replyText[c._id] || ""}
                      onChange={(e) => setReplyText({...replyText, [c._id]: e.target.value})}
                    />
                    <button className="action-btn" onClick={() => handleReply(c._id)} style={{marginTop:'10px'}}>
                      Send Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>

  </div>
</>


);
}

export default AdminDashboard;
