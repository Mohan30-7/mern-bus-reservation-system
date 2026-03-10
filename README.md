# 🚌 MV Bus – MERN Bus Reservation System

A full-stack **MERN Stack** web application for **bus ticket booking and reservation**.

This system allows users to **search buses, select seats, book tickets, and manage bookings**, while administrators can **manage buses, users, bookings, and customer complaints** through a dedicated **Admin Dashboard**.

---

# 🚀 Features

## 👤 User Features

* 🔐 **User Signup & Login** (Role-based: `User` / `Admin`)
* 💾 Secure session handling using **Local Storage**
* 📊 **Dashboard** with:

  * Featured bus cards (image, route, date, time, driver)
  * Search buses by **Source, Destination, and Date**
  * Table of available buses with **real-time seat availability**
* 🪑 **Interactive Seat Selection**

  * Bus layout view
  * Seat legends (Available / Booked / Selected)
* 🧾 **Passenger Details Form**

  * Passenger info per seat
  * Automatic total price calculation
* 🎟 **Booking System**

  * Book seats and store booking details in **MongoDB**
* 📚 **My Bookings**

  * View booked tickets
  * Seat numbers and passenger details
* 👤 **User Profile**

  * View and update **email & phone number**
* 📩 **Contact / Support**

  * Raise complaints or help tickets
* 📱 **Responsive UI**

  * Works smoothly on **Desktop, Tablet, and Mobile**

---

# 🛠 Admin Features

* 🧑‍💼 **Admin Dashboard Panel**
* 🚌 **Bus Management**

  * Add new buses with image upload
  * View all available buses
  * Delete buses
* 📋 **All Bookings Management**

  * View booking details including:

    * Customer name
    * Bus route & number
    * Passenger list
    * Seats
    * Total amount
    * Booking date
* 👥 **User Management**

  * View registered users
  * Create new admin accounts
* 📨 **Complaint Management**

  * View user complaints
  * Reply and mark them as resolved
  * Delete complaints

---

# 🧱 Tech Stack

## 💻 Frontend

* ⚛️ React.js
* 🔗 React Router DOM
* 🎨 HTML5, CSS3
* 🌐 Fetch API

## ⚙ Backend

* 🟢 Node.js
* 🚏 Express.js
* 🍃 MongoDB
* 📦 Mongoose
* 📂 Multer (Image Uploads)
* 🔄 CORS

---

# 📁 Project Structure

backend/
server.js
models/
Bus.js
Booking.js
User.js
Complaint.js
uploads/          # Uploaded bus images

frontend/
public/
src/
pages/          # Login, Signup, Dashboard, Profile, Admin, Contact
components/     # SearchBuses, SeatSelection, PassengerDetails

---

# ⚙ Installation & Setup

## 1️⃣ Clone Repository

git clone https://github.com/Mohan30-7/mern-bus-reservation-system.git
cd mern-bus-reservation-system

---

# 🔧 Backend Setup

cd backend
npm install
npm start

Backend runs at:

http://localhost:5000

MongoDB should run locally at:

mongodb://127.0.0.1:27017/busReservationDB

On first run, **sample buses are automatically seeded** if the database is empty.

---

# 🎨 Frontend Setup

cd frontend
npm install
npm start

Frontend runs at:

http://localhost:3000

If the backend is deployed online, update API URLs inside the frontend.

Example:

http://127.0.0.1:5000

Replace with your **live backend URL**.

---

# 🔐 API Endpoints

## Authentication

POST /api/signup,
POST /api/login,
POST /api/forgot-password,
POST /api/reset-password/:token

## User Profile

GET /api/user/:username,
PUT /api/user/:username

## Buses & Bookings

GET /api/buses,
POST /api/bookings,
GET /api/my-bookings/:username

## Complaints

POST /api/complaints,
GET /api/complaints/:username

## Admin APIs

GET /api/admin/bookings,
GET /api/admin/users,
POST /api/admin/users,
POST /api/admin/buses,
DELETE /api/admin/buses/:id,
GET /api/admin/complaints,
PUT /api/admin/complaints/:id/reply,
DELETE /api/admin/complaints/:id

---

# 🧠 Design Considerations

### 🚌 Seeded Bus Data

The backend seeds **sample buses automatically** when the database is empty.

### 🔒 Safe Booking History

Bookings reference buses safely.

If a bus is deleted later, the UI shows:

Bus details unavailable

instead of crashing.

### ⚡ Concurrency-Safe Seat Booking

Backend checks seat availability to **prevent double booking**.

### 📱 Responsive Design

Custom CSS ensures usability across devices.

Responsive behavior includes:

* Admin sidebar collapses into a top row
* Tables become scrollable on small screens
* Forms stack vertically for mobile

---

# 📸 Screenshots

(Add screenshots of your project here)

Example:

* Login Page
  
  <img width="1920" height="892" alt="Screenshot (982)" src="https://github.com/user-attachments/assets/a4762d41-83a2-4bc6-b8a4-412ce680313f" />

  <img width="1920" height="948" alt="Screenshot (988)" src="https://github.com/user-attachments/assets/e79cdf35-380f-4916-a325-56dce6953115" />
  <img width="1920" height="851" alt="Screenshot (989)" src="https://github.com/user-attachments/assets/b2db5fd2-9688-49d4-bfcd-23a15003d0ef" />


* User Dashboard
  
  <img width="1920" height="906" alt="Screenshot (983)" src="https://github.com/user-attachments/assets/8347c275-330b-44b9-b0d2-bcaecd957b20" />
 
  <img width="1920" height="1000" alt="Screenshot (979)" src="https://github.com/user-attachments/assets/085760ca-1aa1-4aab-8c49-f1d7d554c858" />

  <img width="1920" height="983" alt="Screenshot (984)" src="https://github.com/user-attachments/assets/9253a121-f09e-45c1-a01e-18a97731d970" />

  <img width="1920" height="952" alt="Screenshot (985)" src="https://github.com/user-attachments/assets/5446927a-fae1-4019-8eaf-15dbc097e856" />



* Seat Selection
  
   <img width="1920" height="1004" alt="Screenshot (996)" src="https://github.com/user-attachments/assets/7b482049-0a18-4c48-bca1-69745d736e73" />
   
* Admin Panel
  
  <img width="1920" height="965" alt="Screenshot (990)" src="https://github.com/user-attachments/assets/9d8c6ce7-659b-4d3c-a6eb-154737e9400a" />
  <img width="1920" height="754" alt="Screenshot (991)" src="https://github.com/user-attachments/assets/334affe8-3324-4450-90a9-68ddda8c8c9f" />
  <img width="1920" height="724" alt="Screenshot (992)" src="https://github.com/user-attachments/assets/0c35d0a2-f5a8-414c-b7bc-ef854260aea4" />




---

# 🌐 Deployment

Frontend can be deployed on **Vercel**.

Backend can be deployed on **Render** or **Railway**.

Database can be hosted on **MongoDB Atlas**.

After deployment, update the frontend API URL to connect with the live backend.

---

# 👨‍💻 Author

**Mohanavijayan J**
B.Tech CSE Graduate

🔗 GitHub:
https://github.com/Mohan30-7

🔗 LinkedIn:
https://linkedin.com/in/mohanavijayan-j

