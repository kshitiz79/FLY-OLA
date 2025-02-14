import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import baseURL from '../../utils/baseURL';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If no booking data is passed via router state, prompt the user to go back.
  if (!location.state) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">No Booking Data Found</h2>
        <p>Please go back and select a flight to confirm your booking.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Destructure the booking details passed from the previous page.
  const {
    tripType = 'oneWay',
    from = 'Helipad',
    to = 'Airport',
    departureDate = '2025-02-12',
    returnDate = '',
    packageOption = '',
    passengers = '1',
    price, // Price passed from previous page
    // For one‐way:
    selectedFlight,
    // For round‐trip:
    selectedFlightOutbound = null,
    selectedFlightReturn = null,
  } = location.state;
  const numPassengers = parseInt(passengers, 10) || 1;

  const totalPrice =
    price !== undefined
      ? price
      : tripType === 'roundTrip'
      ? packageOption === 'premium'
        ? 50000 * numPassengers
        : 35000 * numPassengers
      : 18000 * numPassengers;

  // Create independent passenger details objects
  const [passengerDetails, setPassengerDetails] = useState(
    Array.from({ length: numPassengers }, () => ({
      name: '',
      age: '',
      gender: '',
      email: '',
      mobile: '',
      nationality: '',
      weight: '',
    }))
  );

  // Handler to update passenger details
  const handlePassengerChange = (index, field, value) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setPassengerDetails(updatedDetails);
  };

  // Calculate overweight fees (Rs. 1,500 per kg above 75 kg per passenger)
  const calculateOverweightFees = () => {
    let totalOverweight = 0;
    passengerDetails.forEach((p) => {
      const w = parseInt(p.weight, 10) || 0;
      if (w > 75) {
        totalOverweight += (w - 75) * 1500;
      }
    });
    return totalOverweight;
  };

  const overweightFees = calculateOverweightFees();
  const finalTotal = totalPrice + overweightFees;

  // Handler for confirming booking: POST bookingData to the backend.
  const handleConfirmBooking = async () => {
    const bookingData = {
      tripType,
      from,
      to,
      departureDate,
      returnDate: tripType === 'roundTrip' ? returnDate : null,
      packageOption,
      passengers: numPassengers,
      baseFare: totalPrice,
      overweightFees,
      finalTotal,
      passengerDetails,
      selectedFlight,
      selectedFlightOutbound,
      selectedFlightReturn,
    };

    try {
      const response = await fetch(`${baseURL}/api/customer-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData), // Ensure `bookingData` is defined and contains the required data
      });

      // Check the content-type header to decide whether to parse as JSON
      const contentType = response.headers.get('content-type') || '';
      let responseData;

      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // If not JSON, parse as text
        responseData = await response.text();
      }

      if (response.ok) {
        alert('Booking created successfully!');
        // Optionally, reset the form or navigate to another page
      } else {
        const errorMessage =
          (responseData && responseData.message) || responseData || 'An error occurred';
        throw new Error(errorMessage);
      }
    } catch (error) {
      alert('Error: ' + error.message);
      console.error('Booking confirmation error:', error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Confirm Booking</h1>

      {/* Flight Summary Section */}
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

      {/* Passenger Details Section */}
      <div className="mb-8 border p-4 rounded-lg bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
        {Array.from({ length: numPassengers }).map((_, index) => (
          <div key={index} className="mb-6 p-4 border rounded bg-gray-50">
            <h3 className="font-semibold mb-2">Passenger {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={passengerDetails[index].name}
                  onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                  className="mt-1 w-full border rounded px-2 py-1"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Age</label>
                <input
                  type="number"
                  value={passengerDetails[index].age}
                  onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                  className="mt-1 w-full border rounded px-2 py-1"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Gender</label>
                <select
                  value={passengerDetails[index].gender}
                  onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                  className="mt-1 w-full border rounded px-2 py-1"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={passengerDetails[index].email}
                  onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                  className="mt-1 w-full border rounded px-2 py-1"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Mobile</label>
                <input
                  type="tel"
                  value={passengerDetails[index].mobile}
                  onChange={(e) => handlePassengerChange(index, 'mobile', e.target.value)}
                  className="mt-1 w-full border rounded px-2 py-1"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nationality</label>
                <input
                  type="text"
                  value={passengerDetails[index].nationality}
                  onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                  className="mt-1 w-full border rounded px-2 py-1"
                  placeholder="e.g. Indian"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Weight (kg)</label>
              <input
                type="number"
                value={passengerDetails[index].weight}
                onChange={(e) => handlePassengerChange(index, 'weight', e.target.value)}
                className="mt-1 w-full border rounded px-2 py-1"
                placeholder="Enter weight in kilograms"
              />
              <p className="text-xs text-gray-500 mt-1">
                Passengers over 75 kg incur additional charges of Rs. 1,500 per extra kg.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Final Price Breakdown */}
      <div className="mb-8 border border-gray-300 p-6 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Final Price Breakdown
        </h2>
        <div className="flex flex-col space-y-2 text-lg">
          <p>
            <span className="font-semibold">Base Fare:</span> Rs. {totalPrice}
          </p>
          <p>
            <span className="font-semibold">Overweight Fees:</span> Rs. {overweightFees}
          </p>
          <hr className="my-2" />
          <p className="text-xl font-bold">
            Total Payable: Rs. {finalTotal}
          </p>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="mb-8 p-4">
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          Terms and Conditions
        </h2>
        <ol className="list-decimal list-inside text-sm space-y-2 text-gray-700">
          <li>Customers must arrive at least 15 minutes before the scheduled time.</li>
          <li>No refunds for cancellations or no-shows.</li>
          <li>Passengers over 75 kg incur extra charges of Rs. 1,500 per extra kg.</li>
          <li>Please bring a valid government-issued ID for boarding.</li>
          <li>Additional terms and conditions apply.</li>
        </ol>
      </div>

      {/* Confirm Booking Button */}
      <div className="text-center">
        <button
          onClick={handleConfirmBooking}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-200"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
