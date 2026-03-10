require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const Bus = require("./models/Bus");
const Booking = require("./models/Booking");
const User = require("./models/User");
const Complaint = require("./models/Complaint");

const app = express();

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, "uploads/");
},
filename: (req, file, cb) => {
cb(null, Date.now() + path.extname(file.originalname));
},
});

const upload = multer({ storage });

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected to", mongoose.connection.name))
.catch((err) => console.log(err));

const generateSeats = (total) => {
const seats = [];
const rows = total / 4;
const letters = ["A", "B", "C", "D"];

for (let i = 1; i <= rows; i++) {
for (const letter of letters) {
if (seats.length < total) {
seats.push({ seatNumber: `${i}${letter}`, isBooked: false });
}
}
}
return seats;
};

async function seedBuses() {
const count = await Bus.countDocuments();

if (count === 0) {
await Bus.insertMany([
{
sourceCity: "Pondicherry",
destinationCity: "Chennai",
journeyDate: new Date("2026-03-10"),
departureTime: "09:00 AM",
driverName: "Murugan",
price: 300,
busNumber: 1,
image: "/b1.jpg",
seats: generateSeats(40),
totalSeats: 40,
availableSeats: 40,
},
{
sourceCity: "Pondicherry",
destinationCity: "Bangalore",
journeyDate: new Date("2026-03-11"),
departureTime: "10:30 AM",
driverName: "Kannan",
price: 600,
busNumber: 2,
image: "/b2.jpg",
seats: generateSeats(40),
totalSeats: 40,
availableSeats: 40,
},
{
sourceCity: "Pondicherry",
destinationCity: "Coimbatore",
journeyDate: new Date("2026-03-12"),
departureTime: "02:00 PM",
driverName: "Suresh",
price: 450,
busNumber: 3,
image: "/b3.jpg",
seats: generateSeats(40),
totalSeats: 40,
availableSeats: 40,
},
{
sourceCity: "Pondicherry",
destinationCity: "Salem",
journeyDate: new Date("2026-03-13"),
departureTime: "05:30 PM",
driverName: "Aravind",
price: 250,
busNumber: 4,
image: "/b4.jpg",
seats: generateSeats(40),
totalSeats: 40,
availableSeats: 40,
},
]);
}
}

seedBuses();

/* ---------------- AUTH ---------------- */

app.post("/api/signup", async (req, res) => {
const { username, password, phone } = req.body;

if (!username || !password)
return res.status(400).json({ message: "Invalid input" });

const exists = await User.findOne({ username });

if (exists)
return res.status(400).json({ message: "User already exists" });

await User.create({ username, password, phone, role: "user" });

res.json({ message: "Signup successful" });
});

app.post("/api/login", async (req, res) => {
const { username, password } = req.body;

const user = await User.findOne({ username });

if (!user || user.password !== password)
return res.status(400).json({ message: "Invalid credentials" });

res.json({ username: user.username, role: user.role });
});

/* ---------------- PASSWORD RESET ---------------- */

app.post("/api/forgot-password", async (req, res) => {
const { username } = req.body;

const user = await User.findOne({ username });

if (!user)
return res.status(404).json({ message: "User not found" });

const token = crypto.randomBytes(20).toString("hex");

user.resetPasswordToken = token;
user.resetPasswordExpires = Date.now() + 3600000;

await user.save();

const resetLink = `https://mohanavijayanj-mern-bus-reservation-system.vercel.app/reset-password/${token}`;

console.log("\n--- PASSWORD RESET REQUEST ---");
console.log(`Reset link for ${username}: ${resetLink}`);
console.log("--------------------------------");

res.json({ message: "Reset link generated in server console" });
});

app.post("/api/reset-password/:token", async (req, res) => {
const { password } = req.body;

const user = await User.findOne({
resetPasswordToken: req.params.token,
resetPasswordExpires: { $gt: Date.now() },
});

if (!user)
return res
.status(400)
.json({ message: "Password reset token is invalid or expired." });

user.password = password;

user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;

await user.save();

res.json({ message: "Password successfully reset" });
});

/* ---------------- BUSES ---------------- */

app.get("/api/buses", async (req, res) => {
res.json(await Bus.find());
});

app.post("/api/admin/buses", upload.single("image"), async (req, res) => {
try {
const newBusData = req.body;


if (req.file) {
  newBusData.image =
    `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
}

newBusData.price = Number(newBusData.price);
newBusData.busNumber = Number(newBusData.busNumber);

newBusData.seats = generateSeats(40);
newBusData.totalSeats = 40;
newBusData.availableSeats = 40;

const bus = await Bus.create(newBusData);

res.status(201).json(bus);


} catch (error) {
res.status(500).json({ message: "Error adding bus" });
}
});

/* ---------------- BOOKINGS ---------------- */

app.post("/api/bookings", async (req, res) => {
const { busId, customerName, passengers } = req.body;

const bus = await Bus.findById(busId);

const seatsToBook = passengers.map((p) => p.seatNumber);

if (!bus || bus.availableSeats < seatsToBook.length)
return res.status(400).json({ message: "Error" });

bus.availableSeats -= seatsToBook.length;

await bus.save();

const totalAmount = bus.price * seatsToBook.length;

const booking = await Booking.create({
bus: bus._id,
customerName,
seatsBooked: seatsToBook.length,
passengers,
totalAmount,
});

res.json(booking);
});

/* ---------------- COMPLAINTS ---------------- */

app.post("/api/complaints", async (req, res) => {
const { username, subject, message } = req.body;

const complaint = await Complaint.create({ username, subject, message });

res.status(201).json(complaint);
});

/* ---------------- HEALTH CHECK ---------------- */

app.get("/api/health", async (req, res) => {
try {
const busCount = await Bus.countDocuments();

```
res.json({
  ok: true,
  db: mongoose.connection.name,
  busCount,
  serverTime: new Date().toISOString(),
});
```

} catch (e) {
res.status(500).json({ ok: false, error: e.message });
}
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
