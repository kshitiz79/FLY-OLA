// src/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Local states for trip type and form fields
  const [tripType, setTripType] = useState('roundTrip'); // default to roundTrip
  const [departureDate, setDepartureDate] = useState('2025-02-12');
  const [returnDate, setReturnDate] = useState('2025-02-14');
  const [from, setFrom] = useState('Helipad');
  const [to, setTo] = useState('Airport');
  const [packageOption, setPackageOption] = useState('premium'); // 'base' or 'premium'
  const [passengers, setPassengers] = useState("1"); // Default: 1 Passenger

  const handleBookNow = () => {
    if (tripType === 'oneWay') {
      navigate('/oneway', {
        state: {
          tripType,
          from,
          to,
          departureDate,
          passengers
        }
      });
    } else {
      navigate('/roundtrip', {
        state: {
          tripType,
          from,
          to,
          departureDate,
          returnDate,
          packageOption,
          passengers
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-lg p-8 mt-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
        Fly to Mahakumbh with Fly Ola!
        </h1>

        {/* Trip Type Selection */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setTripType('roundTrip')}
            className={`px-6 py-2 mr-2 rounded-full font-semibold transition duration-200 ${
              tripType === 'roundTrip'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Round Trip
          </button>
          <button
            onClick={() => setTripType('oneWay')}
            className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${
              tripType === 'oneWay'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            One Way
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* FROM / TO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Helipad">Helipad</option>
                <option value="Airport">Airport</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Airport">Airport</option>
                <option value="Helipad">Helipad</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          {tripType === 'roundTrip' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Departure Date</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Package Selection - Only for Round Trip */}
          {tripType === 'roundTrip' && (
            <div className="mt-6">
              <p className="text-gray-600 mb-2">Select Package</p>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio"
                    name="package"
                    value="base"
                    checked={packageOption === 'base'}
                    onChange={(e) => setPackageOption(e.target.value)}
                    className="mr-2"
                  />
                  Rs. 35000 base package including shuttle from Airport to Triveni Sangam
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio"
                    name="package"
                    value="premium"
                    checked={packageOption === 'premium'}
                    onChange={(e) => setPackageOption(e.target.value)}
                    className="mr-2"
                  />
                  Rs. 50000 including shuttle from Airport to Triveni Sangam, Helipad and pooja with holy dip
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Book Now Button */}
        <button
          onClick={handleBookNow}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full shadow transition duration-200"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Home;
