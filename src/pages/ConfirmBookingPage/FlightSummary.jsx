import React from 'react';

const FlightSummary = ({
  tripType,
  from,
  to,
  departureDate,
  returnDate,
  packageOption,
  selectedFlight,
  selectedFlightOutbound,
  selectedFlightReturn,
  numPassengers,
  totalPrice,
}) => (

    
    <div className="mb-8 border border-gray-300 p-6 rounded-lg shadow-lg bg-white">
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
      Flight Summary
    </h2>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="p-4 bg-gray-100 rounded-lg shadow-sm transition-transform transform hover:scale-105">
        <p className="text-lg">
          <span className="font-semibold">Trip Type:</span> {tripType}
        </p>
        <p className="text-lg">
          <span className="font-semibold">From:</span> {from}
        </p>
        <p className="text-lg">
          <span className="font-semibold">To:</span> {to}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Departure Date:</span> {departureDate}
        </p>
        {tripType === 'roundTrip' && (
          <p className="text-lg">
            <span className="font-semibold">Return Date:</span> {returnDate}
          </p>
        )}
      </div>

      {packageOption && (
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm transition-transform transform hover:scale-105">
          <p className="text-lg font-semibold mb-2">Package:</p>
          <p className="text-lg">
            {packageOption === 'base'
              ? 'Rs. 35,000 - Base Package'
              : 'Rs. 50,000 - Premium Package'}
          </p>
        </div>
      )}

      {tripType === 'oneWay' && selectedFlight && (
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm transition-transform transform hover:scale-105">
          <p className="text-lg font-semibold mb-2">Selected Flight (One-Way):</p>
          <p>
            {selectedFlight.from} → {selectedFlight.to}
          </p>
          <p>
            Date: {selectedFlight.date} | Time: {selectedFlight.time}
          </p>
        </div>
      )}

      {tripType === 'roundTrip' &&
        selectedFlightOutbound &&
        selectedFlightReturn && (
          <>
            <div className="p-4 bg-gray-100 rounded-lg shadow-sm transition-transform transform hover:scale-105">
              <p className="text-lg font-semibold mb-2">Outbound Flight:</p>
              <p>
                {selectedFlightOutbound.from} → {selectedFlightOutbound.to}
              </p>
              <p>
                Date: {selectedFlightOutbound.date} | Time: {selectedFlightOutbound.time}
              </p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-sm transition-transform transform hover:scale-105">
              <p className="text-lg font-semibold mb-2">Return Flight:</p>
              <p>
                {selectedFlightReturn.from} → {selectedFlightReturn.to}
              </p>
              <p>
                Date: {selectedFlightReturn.date} | Time: {selectedFlightReturn.time}
              </p>
            </div>
          </>
        )}
    </div>
    <div className="mt-8 p-4 bg-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105">
      <p className="text-xl font-bold text-center">
        Base Fare (for {numPassengers} Passenger{numPassengers > 1 ? 's' : ''}): Rs. {totalPrice}
      </p>
    </div>
  </div>
);









export default FlightSummary;