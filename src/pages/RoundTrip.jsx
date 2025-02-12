// src/pages/RoundTripPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import slotsData from '../data/slotsData.json';
import { FaHelicopter } from 'react-icons/fa';

const RoundTripPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Local states from router state or defaults
  const [tripType, setTripType] = useState(state?.tripType || 'roundTrip');
  const [from, setFrom] = useState(state?.from || 'Helipad');
  const [to, setTo] = useState(state?.to || 'Airport');
  const [departureDate, setDepartureDate] = useState(state?.departureDate || '2025-02-12');
  const [returnDate, setReturnDate] = useState(state?.returnDate || '2025-02-13');
  const [packageOption, setPackageOption] = useState(state?.packageOption || 'base');
  const [passengersClass, setPassengersClass] = useState(state?.passengers || "1");
  const [outboundSlots, setOutboundSlots] = useState([]);
  const [returnSlots, setReturnSlots] = useState([]);

  // States to hold the selected flight indexes (null = not selected)
  const [selectedOutboundIndex, setSelectedOutboundIndex] = useState(null);
  const [selectedReturnIndex, setSelectedReturnIndex] = useState(null);

  // Fixed price based on selected package option:
  // Rs. 35000 for base; Rs. 50000 for premium
  const fixedPrice = packageOption === 'base' ? 35000 : 50000;

  const filterSlots = () => {
    // Outbound: matching from->to for departureDate
    const out = slotsData.filter(
      slot =>
        slot.from === from &&
        slot.to === to &&
        slot.date === departureDate
    );
    // Return: matching to->from for returnDate
    const ret = slotsData.filter(
      slot =>
        slot.from === to &&
        slot.to === from &&
        slot.date === returnDate
    );
    setOutboundSlots(out);
    setReturnSlots(ret);
  };

  // If user changes to "oneWay" in SearchBar, redirect accordingly.
  useEffect(() => {
    if (tripType === 'oneWay') {
      navigate('/oneway', {
        state: { tripType, from, to, departureDate }
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
    // Clear previous selections when search is updated
    setSelectedOutboundIndex(null);
    setSelectedReturnIndex(null);
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
        passengersClass={passengersClass}
        setPassengersClass={setPassengersClass}
        packageOption={packageOption}
        setPackageOption={setPackageOption}
        onUpdate={handleUpdateSearch}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Round‐Trip Slots from {from} to {to}
        </h2>
        <p className="text-sm text-gray-700 mb-6">
          Depart: {departureDate} | Return: {returnDate}
        </p>

        {/* Booking Summary Section */}
        <div className="mt-6 p-4 border rounded-lg">
          {selectedOutboundIndex !== null && selectedReturnIndex !== null ? (
            <>
              <p className="text-lg font-semibold mb-4 text-center">Booking Summary</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Outbound Flight Details */}
                <div>
                  <p className="font-bold mb-2">Outbound Flight:</p>
                  <p>
                    {outboundSlots[selectedOutboundIndex].from} → {outboundSlots[selectedOutboundIndex].to}
                  </p>
                  <p>Date: {outboundSlots[selectedOutboundIndex].date}</p>
                  <p>Time: {outboundSlots[selectedOutboundIndex].time}</p>
                </div>

                {/* Return Flight Details */}
                <div>
                  <p className="font-bold mb-2">Return Flight:</p>
                  <p>
                    {returnSlots[selectedReturnIndex].from} → {returnSlots[selectedReturnIndex].to}
                  </p>
                  <p>Date: {returnSlots[selectedReturnIndex].date}</p>
                  <p>Time: {returnSlots[selectedReturnIndex].time}</p>
                </div>
              </div>

              {/* Fixed Price & Book Now Button */}
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">Fixed Price: Rs. {fixedPrice}</p>
                <button
                  onClick={() => alert('Booking confirmed!')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-200 mt-4"
                >
                  Book Now
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold mb-4 text-center">
                Please select both an outbound and a return flight to proceed with booking.
              </p>
              <div className="text-center">
                <button
                  disabled
                  className="bg-gray-400 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-200 mt-4 cursor-not-allowed"
                >
                  Book Now
                </button>
              </div>
            </>
          )}
        </div>

        {/* Outbound & Return Slots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* Outbound Column */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Outbound</h3>
            {outboundSlots.length === 0 ? (
              <p className="text-gray-500">No outbound slots found.</p>
            ) : (
              outboundSlots.map((slot, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedOutboundIndex(idx)}
                  className={`cursor-pointer bg-white rounded-lg shadow p-4 mb-4 flex items-center justify-between transition-all duration-200 ${
                    selectedOutboundIndex === idx ? 'border-4 border-blue-600' : ''
                  }`}
                >
                  {/* Left: Icon & From→To */}
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

                  {/* Right: Optional Notes */}
                  <div className="text-right">
                    {slot.notes && (
                      <p className="text-base text-gray-600">{slot.notes}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Return Column */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Return</h3>
            {returnSlots.length === 0 ? (
              <p className="text-gray-500">No return slots found.</p>
            ) : (
              returnSlots.map((slot, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedReturnIndex(idx)}
                  className={`cursor-pointer bg-white rounded-lg shadow p-4 mb-4 flex items-center justify-between transition-all duration-200 ${
                    selectedReturnIndex === idx ? 'border-4 border-blue-600' : ''
                  }`}
                >
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

                  <div className="text-center">
                    <p className="text-gray-600">Duration: {slot.duration}</p>
                  </div>

                  <div className="text-right">
                    {slot.notes && (
                      <p className="text-sm text-gray-600">{slot.notes}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundTripPage;
