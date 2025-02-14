// src/pages/OneWayPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './../../components/SearchAdmin';
import { FaHelicopter } from 'react-icons/fa';
import { useGetBookingsQuery } from './../../redux/store'; // Use your RTK Query hook

const OneWay = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [tripType, setTripType] = useState(state?.tripType || 'oneWay');
  const [from, setFrom] = useState(state?.from || 'Helipad');
  const [to, setTo] = useState(state?.to || 'Airport');
  const [departureDate, setDepartureDate] = useState(state?.departureDate || '2025-02-12');
  const [returnDate, setReturnDate] = useState(''); // Not used for one‐way
  const [passengersClass, setPassengersClass] = useState(state?.passengers || '1');
  const numPassengers = parseInt(passengersClass, 10) || 1;

  // Fetch slots (bookings) from the backend via RTK Query
  const { data: bookingsData, isLoading, error } = useGetBookingsQuery();
  const slotsData = bookingsData?.bookings || [];

  const [filteredSlots, setFilteredSlots] = useState([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

  const basePricePerPerson = 18000;
  const dynamicPrice = basePricePerPerson * numPassengers;

  // Filter slots based on the selected origin, destination, and departure date
  const filterSlots = () => {
    const results = slotsData.filter(
      (slot) =>
        slot.from.toLowerCase() === from.toLowerCase() &&
        slot.to.toLowerCase() === to.toLowerCase() &&
        slot.date === departureDate
    );
    setFilteredSlots(results);
  };

  // If tripType becomes roundTrip, navigate to the round trip page
  useEffect(() => {
    if (tripType === 'roundTrip') {
      navigate('/dashboard/round-trip-page-admin', {
        state: { tripType, from, to, departureDate, returnDate, passengers: passengersClass },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripType]);

  // Filter slots whenever the data or search parameters change
  useEffect(() => {
    filterSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotsData, from, to, departureDate]);

  const handleUpdateSearch = () => {
    filterSlots();
    setSelectedSlotIndex(null);
  };

  if (isLoading) return <p>Loading available slots...</p>;
  if (error) return <p>Error loading slots.</p>;

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
        onUpdate={handleUpdateSearch}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          One‐Way Slots from {from} to {to} on {departureDate}
        </h2>

        {filteredSlots.length === 0 ? (
          <p className="text-gray-500">No slots found.</p>
        ) : (
          filteredSlots.map((slot, idx) => {
            const seatsAvailable = slot.seatsAvailable;
            const canSelect = seatsAvailable >= numPassengers;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (canSelect) {
                    setSelectedSlotIndex(idx);
                  }
                }}
                className={`border rounded p-4 mb-4 flex items-center justify-between bg-white shadow transition-all duration-200
                  ${selectedSlotIndex === idx ? 'border-4 border-blue-600' : ''}
                  ${canSelect ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                `}
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
                  <p className="text-sm text-red-600">Seats Left: {slot.seatsAvailable}</p>
                </div>
              </div>
            );
          })
        )}

        <div className="mt-6 p-4 border rounded-lg flex flex-col items-center">
          {selectedSlotIndex !== null ? (
            <>
              <p className="text-lg font-semibold mb-2">Booking Summary</p>
              <div className="w-full mb-4">
                <p className="font-bold">Selected Flight:</p>
                <p>
                  {filteredSlots[selectedSlotIndex].from} → {filteredSlots[selectedSlotIndex].to}
                </p>
                <p>Date: {filteredSlots[selectedSlotIndex].date}</p>
                <p>Time: {filteredSlots[selectedSlotIndex].time}</p>
                <p>Seats Available: {filteredSlots[selectedSlotIndex].seatsAvailable}</p>
              </div>
              <p className="text-lg font-semibold">Total Price: Rs. {dynamicPrice}</p>
              {/* Instead of booking immediately, redirect to BookCustumerFlite page */}
              <button
                onClick={() => {
                  navigate('round-trip-page-admin/dashboard/round-trip-page-admin/dashboard/booking-form-admin', {
                    state: {
                      tripType,
                      from,
                      to,
                      departureDate,
                      totalPrice: dynamicPrice,
                      selectedFlight: filteredSlots[selectedSlotIndex],
                      passengers: passengersClass,
                    },
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-200 mt-4"
              >
                Book Now
              </button>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold mb-2">
                Please select a flight to proceed with booking.
              </p>
              <button
                disabled
                className="bg-gray-400 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-200 mt-4 cursor-not-allowed"
              >
                Book Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OneWay;
