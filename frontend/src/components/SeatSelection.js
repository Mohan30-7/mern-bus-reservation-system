import React from "react";

const SeatSelection = ({ bus, selectedSeats, onSeatToggle }) => {
  return (
    <div className="seat-selection section-card">
      <h3>Select Your Seats for Bus {bus.busNumber}</h3>
      <div className="bus-layout">
        <div className="steering-wheel">Front of Bus</div>
        <div className="seats-grid">
          {bus.seats.map((seat) => {
            const isSelected = selectedSeats.includes(seat.seatNumber);
            let seatClass = "seat-icon";
            if (seat.isBooked) seatClass += " booked";
            else if (isSelected) seatClass += " selected";
            else seatClass += " available";

            return (
              <div
                key={seat.seatNumber}
                className={seatClass}
                onClick={() => !seat.isBooked && onSeatToggle(seat.seatNumber)}
                title={
                  seat.isBooked
                    ? `Seat ${seat.seatNumber} (Booked)`
                    : `Seat ${seat.seatNumber}`
                }
              >
                {seat.seatNumber}
              </div>
            );
          })}
        </div>
        <div className="seat-legend">
          <div className="legend-item">
            <span className="seat-icon available small"></span> Available
          </div>
          <div className="legend-item">
            <span className="seat-icon selected small"></span> Selected
          </div>
          <div className="legend-item">
            <span className="seat-icon booked small"></span> Booked
          </div>
        </div>
      </div>
    </div>
  );
};
export default SeatSelection;
