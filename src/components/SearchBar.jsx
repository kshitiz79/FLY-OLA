// SearchBar.jsx
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
  packageOption,
  setPackageOption,
  onUpdate,
  allowedReturnDates // added prop to enforce allowed return dates
}) => {
  return (
    <div className="bg-blue-600 text-white rounded-lg p-4 px-12">
      {/* Trip Type Options (TOP) */}
      <div className="flex items-center space-x-4 mb-4">
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

      {/* Main Search Fields */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between ">
        {/* From / To Inputs */}
        <div className="flex items-center space-x-10">
          <div className="flex flex-col">
            <span className="text-xs">FROM</span>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-20 md:w-60 rounded px-2 py-1 bg-white text-black"
              placeholder="Helipad"
            />
          </div>
        
          <div className="flex flex-col">
            <span className="text-xs">TO</span>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-20 md:w-60 text-black rounded px-2 py-1"
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
              min={allowedReturnDates ? allowedReturnDates.sameDay : undefined}
              max={allowedReturnDates ? allowedReturnDates.nextDay : undefined}
            />
          </div>
        )}

        {/* No. of Passengers */}
        <div className="flex flex-col">
          <span className="text-xs">NO. OF PASSENGERS</span>
          <select
            value={passengersClass}
            onChange={(e) => setPassengersClass(e.target.value)}
            className="text-black rounded px-2 py-2"
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

      {/* Package Selection Row (BOTTOM, only for Round Trip) */}
      {tripType === 'roundTrip' && (
        <div className="mt-6">
          <div className="flex gap-4">
            {/* Package options can be added here if needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
