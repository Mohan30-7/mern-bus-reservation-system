import React, { useState } from "react";

const SearchBuses = ({ onSearch }) => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ sourceCity: source, destinationCity: destination, date });
  };

  return (
    <div className="search-buses-container section-card">
      <h2>Search Buses</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Source City"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Destination City"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Search Buses</button>
      </form>
    </div>
  );
};
export default SearchBuses;
