// src/components/SearchBar.jsx
import React from 'react';

const SearchBar = ({
  tripType,
  setTripType,
  from,
  setFrom,
  to,
  setTo,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  passengersClass,
  setPassengersClass,
  packageOption,         // new prop for package selection
  setPackageOption,      // new prop for package selection
  onUpdate
}) => {
  return (
    <div className="bg-blue-600 text-white rounded-lg p-4">
      {/* Main Search Fields */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        {/* Trip Type Options */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value="oneWay"
              checked={tripType === 'oneWay'}
              onChange={() => setTripType('oneWay')}
              className="mr-1"
            />
            One Way
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value="roundTrip"
              checked={tripType === 'roundTrip'}
              onChange={() => setTripType('roundTrip')}
              className="mr-1"
            />
            Round Trip
          </label>
        </div>

        {/* From / To Inputs */}
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <span className="text-xs">FROM</span>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-20 md:w-24 text-black rounded px-2 py-1"
              placeholder="Helipad"
            />
          </div>
          <div className="text-xl">⇄</div>
          <div className="flex flex-col">
            <span className="text-xs">TO</span>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-20 md:w-24 text-black rounded px-2 py-1"
              placeholder="Airport"
            />
          </div>
        </div>

        {/* Departure Date */}
        <div className="flex flex-col">
          <span className="text-xs">DEPARTURE DATE</span>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="text-black rounded px-2 py-1"
          />
        </div>

        {/* Return Date (only for Round Trip) */}
        {tripType === 'roundTrip' && (
          <div className="flex flex-col">
            <span className="text-xs">RETURN DATE</span>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="text-black rounded px-2 py-1"
            />
          </div>
        )}

        {/* No. of Passengers */}
        <div className="flex flex-col">
          <span className="text-xs">NO. OF PASSENGERS</span>
          <select
            value={passengersClass}
            onChange={(e) => setPassengersClass(e.target.value)}
            className="text-black rounded px-2 py-1"
          >
            <option value="1">1 Passenger</option>
            <option value="2">2 Passengers</option>
            <option value="3">3 Passengers</option>
            <option value="4">4 Passengers</option>
            <option value="5">5 Passengers</option>
            <option value="6">6 Passengers</option>
          </select>
        </div>

        {/* Update Search Button */}
        <button
          onClick={onUpdate}
          className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg"
        >
          Update Search
        </button>
      </div>

      {/* Package Selection Row (Only for Round Trip) */}
      {tripType === 'roundTrip' && (
        <div className="mt-4">
          <p className="text-xs mb-2">Select Package</p>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="package"
                value="base"
                checked={packageOption === 'base'}
                onChange={() => setPackageOption('base')}
                className="mr-2"
              />
              <span className="text-xs">
                Rs. 35000 base package including shuttle from Airport to Triveni Sangam
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="package"
                value="premium"
                checked={packageOption === 'premium'}
                onChange={() => setPackageOption('premium')}
                className="mr-2"
              />
              <span className="text-xs">
                Rs. 50000 including shuttle from Airport to Triveni Sangam, Helipad and pooja with holy dip
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
