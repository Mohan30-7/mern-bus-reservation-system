import React from "react";

const PassengerDetails = ({
  passengers,
  onPassengerChange,
  onSubmit,
  totalAmount,
}) => {
  return (
    <div className="passenger-details section-card">
      <h3 className="passenger-title">Passenger Details</h3>
      <form onSubmit={onSubmit}>
        {passengers.map((p, index) => (
          <div key={p.seatNumber} className="passenger-row">
            <span className="passenger-seat-label">Seat {p.seatNumber}</span>
            <input
              type="text"
              placeholder="Full Name"
              value={p.name}
              onChange={(e) => onPassengerChange(index, "name", e.target.value)}
              required
            />
            <input
              type="number"
              min="1"
              max="120"
              placeholder="Age"
              value={p.age}
              onChange={(e) => onPassengerChange(index, "age", e.target.value)}
              required
            />
            <select
              value={p.gender}
              onChange={(e) =>
                onPassengerChange(index, "gender", e.target.value)
              }
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        ))}

        <div className="booking-summary">
          <h4>Total Amount: ₹{totalAmount}</h4>
        </div>

        <button
          type="submit"
          disabled={passengers.length === 0}
          className="confirm-btn"
        >
          Confirm &amp; Book
        </button>
      </form>
    </div>
  );
};
export default PassengerDetails;
