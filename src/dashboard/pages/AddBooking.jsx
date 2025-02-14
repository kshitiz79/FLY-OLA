// src/pages/AddBooking.jsx
import React, { useState } from 'react';
import { useCreateBookingMutation } from '../../redux/store';

const AddBooking = () => {
  const [routeType, setRouteType] = useState('helipadToAirport');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState('1');

  const [createBooking] = useCreateBookingMutation();

  const computeDuration = () => {
    if (departureTime && arrivalTime) {
      const [depHour, depMinute] = departureTime.split(':').map(Number);
      const [arrHour, arrMinute] = arrivalTime.split(':').map(Number);
      let depTotal = depHour * 60 + depMinute;
      let arrTotal = arrHour * 60 + arrMinute;
      let diff = arrTotal - depTotal;
      if (diff < 0) diff += 24 * 60;
      return diff;
    }
    return null;
  };

  const duration = computeDuration();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const from = routeType === 'helipadToAirport' ? 'Helipad' : 'Airport';
    const to = routeType === 'helipadToAirport' ? 'Airport' : 'Helipad';

    const newBooking = {
     
      tripType: 'oneWay',
      date, // e.g., "2025-02-12"
      from,
      to,
      time: `${departureTime} - ${arrivalTime}`,
      duration: duration ? `${duration} minutes` : '',
      seatsAvailable: Number(numberOfSeats),
      notes: `Seat Left ${numberOfSeats}`,
      price: Number(price),
    };

    try {
      await createBooking(newBooking).unwrap();
      alert('Booking added successfully!');
      setRouteType('helipadToAirport');
      setPrice('');
      setDate('');
      setDepartureTime('');
      setArrivalTime('');
      setNumberOfSeats('1');
    } catch (err) {
      console.error('Create booking failed:', err);
      alert('Error creating booking');
    }
  };

  return (
    <div className="mb-8 p-6 bg-white shadow rounded-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Booking</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Route Type */}
        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="routeType"
              value="helipadToAirport"
              checked={routeType === 'helipadToAirport'}
              onChange={() => setRouteType('helipadToAirport')}
              className="mr-2"
            />
            Helipad to Airport
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="routeType"
              value="airportToHelipad"
              checked={routeType === 'airportToHelipad'}
              onChange={() => setRouteType('airportToHelipad')}
              className="mr-2"
            />
            Airport to Helipad
          </label>
        </div>

        {/* Price */}
        {/* <div>
          <label className="block font-semibold">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
            className="mt-1 p-2 border rounded w-full"
          />
        </div> */}

        {/* Date */}
        <div>
          <label className="block font-semibold">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        {/* Departure Time */}
        <div>
          <label className="block font-semibold">Departure Time:</label>
          <input
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        {/* Arrival Time */}
        <div>
          <label className="block font-semibold">Arrival Time:</label>
          <input
            type="time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            required
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        {/* Computed Duration */}
        {departureTime && arrivalTime && (
          <div>
            <p className="text-sm text-gray-600">
              Duration: {duration ? `${duration} minutes` : 'N/A'}
            </p>
          </div>
        )}

        {/* Number of Seats */}
        <div>
          <label className="block font-semibold">Number of Seats:</label>
          <select
            value={numberOfSeats}
            onChange={(e) => setNumberOfSeats(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          >
            {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} Seat{num > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Add Booking
        </button>
      </form>
    </div>
  );
};

export default AddBooking;
