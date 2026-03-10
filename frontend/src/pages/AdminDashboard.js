import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://mern-bus-reservation-system-1.onrender.com";

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

```
fetchData();

const intervalId = setInterval(() => {
  fetchData();
}, 2000);

return () => clearInterval(intervalId);
```

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
      <button onClick={() => setActiveTab("buses")}>Manage Buses</button>
      <button onClick={() => setActiveTab("bookings")}>All Bookings</button>
      <button onClick={() => setActiveTab("users")}>Users</button>
      <button onClick={() => setActiveTab("complaints")}>User Complaints</button>
    </div>

    <div className="admin-main">

      {activeTab === "buses" && (
        <div>
          <h3>Add New Bus</h3>

          <form onSubmit={handleAddBus}>
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

            <input type="file" accept="image/*"
              onChange={(e)=>setNewBus({...newBus,image:e.target.files[0]})}/>

            <button type="submit">Add Bus</button>
          </form>
        </div>
      )}

    </div>

  </div>
</>


);
}

export default AdminDashboard;
