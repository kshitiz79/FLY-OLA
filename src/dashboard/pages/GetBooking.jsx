// src/pages/GetBooking.jsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as ExcelJS from 'exceljs';
import baseURL from '../../utils/baseURL';
import { useDeleteCustomerBookingMutation } from '../../redux/store';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

async function getBase64FromUrl(url) {
  const response = await fetch(url, { mode: 'cors' });
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      const base64String = base64data.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const GetBooking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Import the delete mutation hook
  const [deleteCustomerBooking] = useDeleteCustomerBookingMutation();

  const selectedDateStr = formatDate(selectedDate);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${baseURL}/api/customer-bookings`);
        if (!response.ok) {
          throw new Error('Error fetching bookings');
        }
        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Filter logic
  const filteredBookings = bookings.filter((booking) => {
    if (booking.tripType === 'roundTrip') {
      return (
        booking.departureDate === selectedDateStr ||
        booking.returnDate === selectedDateStr
      );
    }
    return booking.departureDate === selectedDateStr;
  });

  const handleDownloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Bookings');

      worksheet.addRow([
        'Booking ID',
        'Trip Type',
        'From',
        'To',
        'Departure Date',
        'Return Date',
        'Passenger Name',
        'Age',
        'Gender',
        'Email',
        'Mobile',
        'Nationality',
        'Weight',
        'ID Type',
        'ID Image',
      ]);

      let currentRow = 2;
      for (const booking of filteredBookings) {
        const { _id, tripType, from, to, departureDate, returnDate, passengerDetails } =
          booking;

        for (const p of passengerDetails) {
          const rowValues = [
            _id,
            tripType,
            from,
            to,
            departureDate,
            returnDate || '',
            p.name,
            p.age,
            p.gender,
            p.email,
            p.mobile,
            p.nationality,
            p.weight,
            p.identityCardType,
          ];

          worksheet.addRow(rowValues);

          if (p.identityCardImageUrl) {
            try {
              const base64 = await getBase64FromUrl(p.identityCardImageUrl);
              let extension = 'png';
              if (p.identityCardImageUrl.toLowerCase().includes('.jpg')) {
                extension = 'jpg';
              } else if (p.identityCardImageUrl.toLowerCase().includes('.jpeg')) {
                extension = 'jpeg';
              }
              const imageId = workbook.addImage({
                base64,
                extension,
              });
              worksheet.addImage(imageId, {
                tl: { col: 14, row: currentRow - 1 },
                ext: { width: 50, height: 50 },
              });
            } catch (imgErr) {
              console.error('Error embedding image:', imgErr);
            }
          }
          currentRow++;
        }
      }

      worksheet.getColumn(1).width = 18;
      worksheet.getColumn(2).width = 10;
      worksheet.getColumn(3).width = 12;
      worksheet.getColumn(4).width = 12;
      worksheet.getColumn(5).width = 14;
      worksheet.getColumn(6).width = 14;
      worksheet.getColumn(7).width = 18;
      worksheet.getColumn(10).width = 22;
      worksheet.getColumn(15).width = 15;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bookings_${selectedDateStr}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excel download error:', error);
      alert('Failed to download Excel file. Check console for details.');
    }
  };

  // Handler for deleting a customer booking
  const handleDeleteCustomerBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteCustomerBooking(bookingId).unwrap();
        // Optionally remove the deleted booking from local state:
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } catch (error) {
        console.error('Error deleting customer booking:', error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-left">
          Customer Bookings for {selectedDateStr}
        </h2>
        {filteredBookings.length > 0 && (
          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Excel
          </button>
        )}
      </div>

      <div className="mb-6 text-left">
        <label className="block text-gray-700 font-semibold mb-2">
          Select Date:
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border rounded p-2 w-full"
          calendarClassName="border rounded shadow-lg"
          popperClassName="z-10"
          dateFormat="yyyy-MM-dd"
        />
      </div>

      {loading && <p className="text-left">Loading customer bookings...</p>}
      {error && <p className="text-left text-red-600">Error: {error}</p>}

      {filteredBookings.length === 0 ? (
        <p className="text-left">No customer bookings found for this date.</p>
      ) : (
        filteredBookings.map((booking) => {
          const isDeparture = booking.departureDate === selectedDateStr;
          const isReturn =
            booking.tripType === 'roundTrip' &&
            booking.returnDate === selectedDateStr;

          return (
            <div
              key={booking._id}
              className="border border-gray-300 p-4 rounded-lg mb-6 shadow-md bg-white text-left transform hover:scale-105 transition duration-300 relative"
            >
              <h3 className="text-xl font-bold mb-4">
                Booking ID: {booking._id}
              </h3>
              {/* Delete button for the customer booking */}
              <button
                onClick={() => handleDeleteCustomerBooking(booking._id)}
                className="absolute top-2 right-2 bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Flight Summary */}
                <div>
                  <h4 className="font-semibold mb-2">Flight Summary</h4>
                  <p>
                    <strong>Trip Type:</strong> {booking.tripType}
                  </p>
                  <p>
                    <strong>From:</strong> {booking.from}
                  </p>
                  <p>
                    <strong>To:</strong> {booking.to}
                  </p>
                  <p>
                    <strong>Departure Date:</strong> {booking.departureDate}
                  </p>
                  {booking.tripType === 'roundTrip' && (
                    <p>
                      <strong>Return Date:</strong> {booking.returnDate}
                    </p>
                  )}
                  {booking.packageOption && (
                    <p>
                      <strong>Package:</strong>{' '}
                      {booking.packageOption === 'base'
                        ? 'Rs. 35,000 - Base Package'
                        : 'Rs. 50,000 - Premium Package'}
                    </p>
                  )}
                  {booking.tripType === 'oneWay' && booking.selectedFlight && (
                    <div className="mt-2">
                      <h5 className="font-semibold">
                        Selected Flight (One-Way):
                      </h5>
                      <p>
                        {booking.selectedFlight.from} →{' '}
                        {booking.selectedFlight.to}
                      </p>
                      <p>
                        Date: {booking.selectedFlight.date} | Time:{' '}
                        {booking.selectedFlight.time}
                      </p>
                    </div>
                  )}
                  {booking.tripType === 'roundTrip' && (
                    <div className="mt-2">
                      {isDeparture && booking.selectedFlightOutbound && (
                        <div>
                          <h5 className="font-semibold">
                            Outbound Flight (on {booking.departureDate}):
                          </h5>
                          <p>
                            {booking.selectedFlightOutbound.from} →{' '}
                            {booking.selectedFlightOutbound.to}
                          </p>
                          <p>
                            Date: {booking.selectedFlightOutbound.date} | Time:{' '}
                            {booking.selectedFlightOutbound.time}
                          </p>
                        </div>
                      )}
                      {isReturn && booking.selectedFlightReturn && (
                        <div className="mt-2">
                          <h5 className="font-semibold">
                            Return Flight (on {booking.returnDate}):
                          </h5>
                          <p>
                            {booking.selectedFlightReturn.from} →{' '}
                            {booking.selectedFlightReturn.to}
                          </p>
                          <p>
                            Date: {booking.selectedFlightReturn.date} | Time:{' '}
                            {booking.selectedFlightReturn.time}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Column 2: Passenger Details */}
                <div>
                  <h4 className="font-semibold mb-2">Passenger Details</h4>
                  {booking.passengerDetails.map((p, index) => (
                    <div
                      key={index}
                      className="mb-4 p-2 border-b border-gray-200"
                    >
                      <p>
                        <strong>Name:</strong> {p.name}
                      </p>
                      <p>
                        <strong>Age:</strong> {p.age}
                      </p>
                      <p>
                        <strong>Gender:</strong> {p.gender}
                      </p>
                      <p>
                        <strong>Email:</strong> {p.email}
                      </p>
                      <p>
                        <strong>Mobile:</strong> {p.mobile}
                      </p>
                      <p>
                        <strong>Nationality:</strong> {p.nationality}
                      </p>
                      <p>
                        <strong>Weight:</strong> {p.weight} kg
                      </p>
                      {p.identityCardType && (
                        <div className="mt-2">
                          <p>
                            <strong>Identity Card:</strong> {p.identityCardType}
                          </p>
                          {p.identityCardImageUrl ? (
                            <div className="mt-1 flex items-center gap-3">
                              <img
                                src={p.identityCardImageUrl}
                                alt={`${p.name} ${p.identityCardType}`}
                                className="w-16 h-auto border"
                              />
                              <a
                                href={p.identityCardImageUrl}
                                download
                                className="text-blue-600 underline text-sm"
                              >
                                Download Image
                              </a>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No image uploaded
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Column 3: Price Breakdown */}
                <div>
                  <h4 className="font-semibold mb-2">Price Breakdown</h4>
                  <p>
                    <strong>Base Fare:</strong> Rs. {booking.baseFare}
                  </p>
                  <p>
                    <strong>Overweight Fees:</strong> Rs. {booking.overweightFees}
                  </p>
                  <p>
                    <strong>Total Payable:</strong> Rs. {booking.finalTotal}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GetBooking;
