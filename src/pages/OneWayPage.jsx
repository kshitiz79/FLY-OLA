// src/pages/OneWayPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import slotsData from '../data/slotsData.json';
import { FaHelicopter } from 'react-icons/fa';

const OneWayPage = () => {
  // Read initial state from React Router
  const { state } = useLocation();
  const navigate = useNavigate();

  // Local states for the search inputs
  const [tripType, setTripType] = useState(state?.tripType || 'oneWay');
  const [from, setFrom] = useState(state?.from || 'Helipad');
  const [to, setTo] = useState(state?.to || 'Airport');
  const [departureDate, setDepartureDate] = useState(state?.departureDate || '2025-02-12');
  const [returnDate, setReturnDate] = useState(''); // Not used for one-way

  const [filteredSlots, setFilteredSlots] = useState([]);

  const filterSlots = () => {
    // Filter slots by 'from', 'to', and 'date'
    const results = slotsData.filter(
      slot =>
        slot.from === from &&
        slot.to === to &&
        slot.date === departureDate
    );
    setFilteredSlots(results);
  };

  // If user changes tripType to "roundTrip" in SearchBar, navigate to RoundTripPage
  useEffect(() => {
    if (tripType === 'roundTrip') {
      navigate('/roundtrip', {
        state: { tripType, from, to, departureDate, returnDate }
      });
    }
    // eslint-disable-next-line
  }, [tripType]);

  useEffect(() => {
    filterSlots();
    // eslint-disable-next-line
  }, []);

  const handleUpdateSearch = () => {
    filterSlots();
  };

  return (
    <div className="p-4 md:p-8">
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
        onUpdate={handleUpdateSearch}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          One‐Way Slots from {from} to {to} on {departureDate}
        </h2>

        {filteredSlots.length === 0 ? (
          <p className="text-gray-500">No slots found.</p>
        ) : (
          filteredSlots.map((slot, idx) => (
            <div
              key={idx}
              className="border rounded p-4 mb-4 flex items-center justify-between bg-white shadow"
            >
              {/* Left: Departure info + Helicopter icon */}
              <div>
                <p className="font-bold flex items-center space-x-2">
                  <FaHelicopter className="text-blue-600" />
                  <span>
                    {slot.from} → {slot.to}
                  </span>
                </p>
                <p>Date: {slot.date}</p>
                <p>Time: {slot.time}</p>
              </div>

              {/* Center: Duration */}
              <div className="text-center">
                <p className="text-gray-600">Duration: {slot.duration}</p>
              </div>

              {/* Right: Price & Notes */}
              <div className="text-right">
                <p>Price: ${slot.price}</p>
                {slot.notes && (
                  <p className="text-sm text-gray-600">{slot.notes}</p>
                )}
              </div>
            </div>
          ))
        )}

        {/* Book Now Section with Fixed Price of Rs. 18000 */}
        <div className="mt-6 p-4 border rounded-lg flex flex-col items-center">
          <p className="text-lg font-semibold">Total Price: Rs. 18000</p>
          <button
            onClick={() => alert('Booking confirmed!')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-200 mt-4"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OneWayPage;
