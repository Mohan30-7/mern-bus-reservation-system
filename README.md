🚌 MV Bus – Online Bus Reservation System

A full-stack Bus Reservation Web Application built using the MERN Stack (MongoDB, Express, React, Node.js).
This project allows users to sign up, log in, view available buses, book seats, and view booking history with a clean, user-friendly interface.

🚀 Features

👤 User Features

User Signup & Login

Secure session handling using Local Storage

View available buses with route, timing, and seat availability

Book seats on selected buses

View previous bookings (even after server restart)

Interactive FAQ section

Responsive and modern UI

🛠 Backend Features

RESTful APIs using Express.js

MongoDB database with Mongoose schemas

Booking persistence with populated bus data

Proper error handling for deleted/unavailable buses

CORS enabled for frontend–backend communication

🧱 Tech Stack

**Frontend**

React.js

React Router DOM

HTML5, CSS3

Fetch API

**Backend**

Node.js

Express.js

MongoDB

Mongoose

CORS

⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

2️⃣ Backend Setup

cd backend
npm install
npm start

Backend runs on: http://localhost:5000
MongoDB must be running locally on:
mongodb://127.0.0.1:27017/busReservationDB

3️⃣ Frontend Setup

cd frontend
npm install
npm start

🔐 API Endpoints

**Authentication**

POST /api/signup – User registration

POST /api/login – User login

**Bus & Booking**

GET /api/buses – Fetch all buses

POST /api/bookings – Create a booking

GET /api/my-bookings/:username – Get bookings for a user

🧠 Important Design Consideration

Buses are seeded on server start.

Old bookings are safely handled if bus data is unavailable.

UI displays:

✅ Active bookings

⚠️ “Bus details unavailable” for deleted buses

This avoids runtime crashes and ensures a smooth user experience.

📸 Frontend Screenshots
<img width="1920" height="983" alt="Screenshot (737)" src="https://github.com/user-attachments/assets/c690b147-7b82-44c7-8d6e-8a540c36f65c" />
<img width="1920" height="979" alt="Screenshot (738)" src="https://github.com/user-attachments/assets/6076f1d9-34be-470a-84f4-7b5798133162" />
<img width="1920" height="1017" alt="Screenshot (732)" src="https://github.com/user-attachments/assets/a2c96b78-bbf2-4007-a783-f4c9df81cfa3" />
<img width="1920" height="972" alt="Screenshot (733)" src="https://github.com/user-attachments/assets/d637e64c-b706-4f78-a163-ef3d67033ffe" />
<img width="1920" height="1000" alt="Screenshot (734)" src="https://github.com/user-attachments/assets/bf374176-ae13-4c34-a87f-7b8116a972eb" />
<img width="1920" height="892" alt="Screenshot (735)" src="https://github.com/user-attachments/assets/89c53c0f-1e7e-4558-a73d-b660a14584b9" />
<img width="1920" height="983" alt="Screenshot (736)" src="https://github.com/user-attachments/assets/93cd30e3-7c4d-418e-82ae-3a34edaeb8c3" />

📸 Backend Screenshots

<img width="1920" height="948" alt="Screenshot (741)" src="https://github.com/user-attachments/assets/b5970456-a518-406f-8ce8-53d822d6a47b" />
<img width="1920" height="945" alt="Screenshot (740)" src="https://github.com/user-attachments/assets/af754baa-783e-4007-82f9-699840c5def8" />
<img width="1920" height="938" alt="Screenshot (739)" src="https://github.com/user-attachments/assets/cfc90a12-6076-4681-9e19-7b3751c78317" />













