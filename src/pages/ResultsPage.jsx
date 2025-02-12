// ResultsPage.jsx
import React, { useState, useEffect } from 'react';
import SearchBar from './../components/SearchBar';
import slotsData from './../data/slotsData.json';  // <--- new JSON file

const ResultsPage = () => {
  // Local state for search inputs
  const [tripType, setTripType] = useState('roundTrip');
  const [from, setFrom] = useState('Helipad');
  const [to, setTo] = useState('Airport');
  const [departureDate, setDepartureDate] = useState('2025-02-12');
  const [returnDate, setReturnDate] = useState('2025-02-14');
  const [passengersClass, setPassengersClass] = useState('1 Traveller(s), Economy');
  const [isStudent, setIsStudent] = useState(false);

  // State to hold our “filtered” data (or we can just show it unfiltered)
  const [filteredSlots, setFilteredSlots] = useState(slotsData);

  const handleSearch = () => {
    // In a real app, filter `slotsData` or call an API. 
    // For now, we’ll just console.log to show the user input.
    console.log('Searching with:', {
      tripType,
      from,
      to,
      departureDate,
      returnDate,
      passengersClass,
      isStudent
    });

    // Example: filter by from/to if you want
    const result = slotsData.filter(slot => {
      return (
        slot.from.toLowerCase().includes(from.toLowerCase()) &&
        slot.to.toLowerCase().includes(to.toLowerCase())
      );
    });
    setFilteredSlots(result);
  };

  // Run an initial “search” on mount or when certain states change
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-4 md:p-8">
      {/* Top Search Bar (unchanged, but references helipad/airport by default) */}
      <SearchBar
        tripType={tripType}
        setTripType={setTripType}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        passengersClass={passengersClass}
        setPassengersClass={setPassengersClass}
        isStudent={isStudent}
        setIsStudent={setIsStudent}
        onSearch={handleSearch}
      />

      {/* Render “one‐way” or “round‐trip” heading */}
      <div className="mt-8">
        {tripType === 'oneWay' ? (
          <h2 className="text-xl font-semibold mb-4">
            Showing One‐Way slots from {from} to {to} on {departureDate}
          </h2>
        ) : (
          <h2 className="text-xl font-semibold mb-4">
            Showing Round‐Trip slots from {from} to {to} |
            Depart: {departureDate} / Return: {returnDate}
          </h2>
        )}

        {/* Show the data (slots) below */}
        {filteredSlots.map((slot, idx) => (
          <div key={idx} className="border rounded p-4 mb-4">
            <p className="font-bold">
              {slot.from} → {slot.to}
            </p>
            <p>Time: {slot.time}</p>
            <p>Duration: {slot.duration}</p>
            {slot.notes && <p className="text-sm text-gray-600">{slot.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
