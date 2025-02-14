// src/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from './../../../public/4.png';

const BookCustumerFlite = () => {
  const navigate = useNavigate();

  // Local states for trip type and form fields
  const [tripType, setTripType] = useState('roundTrip'); // default to roundTrip
  const [departureDate, setDepartureDate] = useState('2025-02-12');
  const [returnDate, setReturnDate] = useState('2025-02-14');
  // For roundTrip, the route is fixed.
  // For oneWay, the user can choose between two options.
  const [from, setFrom] = useState('Airport');   
  const [to, setTo] = useState('Helipad');
  const [packageOption, setPackageOption] = useState('base'); // 'base' or 'premium'
  const [passengers, setPassengers] = useState("1"); // Default: 1 Passenger

  // Handle changing trip type
  const handleTripTypeChange = (type) => {
    setTripType(type);
    if (type === 'roundTrip') {
      // For roundTrip, the route is fixed.
      setFrom('Airport');
      setTo('Helipad');
    } else {
      // For oneWay, default to the first option.
      setFrom('Airport');
      setTo('Helipad');
    }
  };

  // Book Now: navigate with the selected data
  const handleBookNow = () => {
    if (tripType === 'oneWay') {
      navigate('dashboard/single-trip-page-admin', {
        state: {
          tripType,
          from, // will be 'Airport' or 'Helipad' based on user selection
          to,
          departureDate,
          passengers
        }
      });
    } else {
      navigate('/dashboard/round-trip-page-admin', {
        state: {
          tripType,
          from, // 'Airport'
          to,   // 'Helipad'
          departureDate,
          returnDate,
          packageOption,
          passengers
        }
      });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-lg p-6 mt-10 mb-10">
        {/* Header Image */}
        <img src="./texr.png" alt="" className="w-[55rem] mb-10 ml-3" />

        {/* Trip Type Selection */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => handleTripTypeChange('roundTrip')}
            className={`px-6 py-2 mr-2 rounded-full font-semibold transition duration-200 ${
              tripType === 'roundTrip'
                ? 'bg-[#0133EA] text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Round Trip
          </button>
          <button
            onClick={() => handleTripTypeChange('oneWay')}
            className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${
              tripType === 'oneWay'
                ? 'bg-[#0133EA] text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            One Way
          </button>
        </div>

        {/* Display Route */}
        <div className="mb-6 text-center">
          {tripType === 'roundTrip' ? (
            <p className="text-lg font-semibold text-gray-700">
              Prayagraj Airport <span className="mx-2">⇄</span> Maha Kumbh Helipad
            </p>
          ) : (
            // For oneWay, show both options as radio buttons in a column.
            <div className="flex flex-col items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="oneWayRoute"
                  value="AtoH"
                  checked={from === 'Airport' && to === 'Helipad'}
                  onChange={() => {
                    setFrom('Airport');
                    setTo('Helipad');
                  }}
                  className="mr-2"
                />
                <span className="text-lg font-semibold text-gray-700">
                  Prayagraj Airport → Maha Kumbh Helipad
                </span>
              </label>
              <label className="flex items-center cursor-pointer mt-2">
                <input
                  type="radio"
                  name="oneWayRoute"
                  value="HtoA"
                  checked={from === 'Helipad' && to === 'Airport'}
                  onChange={() => {
                    setFrom('Helipad');
                    setTo('Airport');
                  }}
                  className="mr-2"
                />
                <span className="text-lg font-semibold text-gray-700">
                  Maha Kumbh Helipad → Prayagraj Airport
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="space-y-6">
          {tripType === 'roundTrip' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Departure Date</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0133EA]"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-gray-600 mb-1">Departure Date</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Number of Passengers */}
          <div>
            <label className="block text-gray-600 mb-1">Number of Passengers</label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 Passenger</option>
              <option value="2">2 Passengers</option>
              <option value="3">3 Passengers</option>
              <option value="4">4 Passengers</option>
              <option value="5">5 Passengers</option>
              <option value="6">6 Passengers</option>
            </select>
          </div>

          {/* Package Selection – Only for Round Trip */}
          {tripType === 'roundTrip' && (
            <div className="mt-6">
              {/* <p className="text-gray-600 mb-2">Select Package</p> */}
              <div className="flex flex-col space-y-2">
                {/* <label className="flex items-center">
                  <input
                    type="radio"
                    name="package"
                    value="base"
                    checked={packageOption === 'base'}
                    onChange={(e) => setPackageOption(e.target.value)}
                    className="mr-2"
                  />
                  INR 35,000/- Base package including shuttle from Prayagraj Airport ⇄ Maha Kumbh Helipad.
                </label> */}
                {/* <label className="flex items-center">
                  <input
                    type="radio"
                    name="package"
                    value="premium"
                    checked={packageOption === 'premium'}
                    onChange={(e) => setPackageOption(e.target.value)}
                    className="mr-2"
                  />
                  INR 50,000/- Shuttle from Prayagraj Airport ⇄ Maha Kumbh Helipad with puja and holy dip.
                </label> */}
              </div>
            </div>
          )}
        </div>

        {/* Book Now Button */}
        <button
          onClick={handleBookNow}
          className="w-full mt-8 mb-2 bg-[#0133EA] hover:bg-blue-700 text-white font-semibold py-3 rounded-full shadow transition duration-200"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BookCustumerFlite;
