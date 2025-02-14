// Dashboard.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  useGetBookingsQuery, 
  useGetCustomerBookingsQuery,
  useDeleteBookingMutation, // import the delete mutation
} from './../../redux/store';

const Dashboard = () => {
  // Initialize the selected date (default is today)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch flight slot data
  const { data: flightData, error: flightError, isLoading: flightLoading } = useGetBookingsQuery();

  // Fetch customer booking data
  const { data: customerData, error: customerError, isLoading: customerLoading } = useGetCustomerBookingsQuery();

  // Setup the delete mutation hook
  const [deleteBooking] = useDeleteBookingMutation();

  // While either query is loading or has error, show a message
  if (flightLoading || customerLoading) {
    return <div className="p-6">Loading...</div>;
  }
  if (flightError || customerError) {
    return <div className="p-6">Error loading data</div>;
  }

  // --- Compute Summary Values from Customer Booking Data ---
  const customerBookings = customerData?.bookings || [];
  
  const totalSeatsBooked = customerBookings.reduce(
    (sum, booking) => sum + (booking.passengers || 0),
    0
  );
  
  const totalPayment = customerBookings.reduce(
    (sum, booking) => sum + (booking.finalTotal || 0),
    0
  );

  // --- Get Flight Slot Details ---
  const specificFlightDate = '2025-02-15';
  const specificFlightFrom = 'Airport';
  const specificFlightTo = 'Helipad';
  const specificFlightTime = '17:30 - 17:40';

  const flightSlots = flightData?.bookings || [];
  const specificFlightSlot = flightSlots.find(
    (slot) =>
      slot.from === specificFlightFrom &&
      slot.to === specificFlightTo &&
      slot.date === specificFlightDate &&
      slot.time === specificFlightTime
  );

  const seatsLeft = specificFlightSlot ? specificFlightSlot.seatsAvailable : 0;

  // Format date for filtering flight slots
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const selectedDateStr = formatDate(selectedDate);
  const filteredSlots = flightSlots
  .filter(slot => slot.date === selectedDateStr)
  .sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.time.split(' - ')[0]}:00`).getTime();
    const timeB = new Date(`1970-01-01T${b.time.split(' - ')[0]}:00`).getTime();
    return timeA - timeB; // Sort in ascending order
  });


  // Delete handler
  const handleDelete = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking slot?")) {
      try {
        await deleteBooking(bookingId).unwrap();
      } catch (error) {
        console.error("Error deleting booking slot: ", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Home</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Total Seats Booked" value={totalSeatsBooked} />
        <Card title="Total Payment" value={`INR ${totalPayment}`} />
        <Card title="Seats Left" value={seatsLeft} />
        <Card title="Flights Left to Fly" value={filteredSlots.filter(slot => slot.seatsAvailable > 0).length} />
      </div>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Flight Slot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.length > 0 ? (
          filteredSlots.map((slot) => (
            <div
              key={slot._id}
              className={`relative p-4 rounded-lg shadow-md text-white ${
                slot.seatsAvailable === 6
                  ? 'bg-green-500'
                  : slot.seatsAvailable === 0
                  ? 'bg-red-500'
                  : slot.seatsAvailable === 5
                  ? 'bg-[#7bff00]'
                  : slot.seatsAvailable === 4
                  ? 'bg-[#d4ff00]'
                  : slot.seatsAvailable === 3
                  ? 'bg-[#ff9900]'
                  : slot.seatsAvailable === 2
                  ? 'bg-[#ff4800]'
                  : 'bg-red-500'
              }`}
            >
              <h4 className="text-lg text-black font-bold">
                {`${slot.from} → ${slot.to}`}
              </h4>
              <p className="text-sm text-black">Date: {slot.date}</p>
              <p className="text-sm text-black">Time: {slot.time}</p>
              <p className="text-sm text-black">Seats Available: {slot.seatsAvailable}</p>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(slot._id)}
                className="absolute top-2 right-2 bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No slots available for the selected date.</p>
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default Dashboard;

