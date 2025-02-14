import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // We'll reference this container to capture as PDF
  const printRef = useRef();

  // Check if booking data is passed via router state
  if (!location.state || !location.state.booking) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No Booking Found</h2>
        <p className="mb-4">It seems like you haven't completed a booking.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const { booking } = location.state;
  const {
    tripType,
    from,
    to,
    departureDate,
    returnDate,
    finalTotal,
    passengerDetails,
  } = booking;

  // Function to capture the page and generate PDF
  const handleDownloadPDF = async () => {
    try {
      // 1. Capture the DOM element
      const element = printRef.current;
      // Increase scale for better clarity (optional)
      const canvas = await html2canvas(element, { scale: 2 });

      // 2. Convert canvas to image
      const imageData = canvas.toDataURL('image/png');

      // 3. Create a new jsPDF instance
      const pdf = new jsPDF('p', 'pt', 'a4'); // portrait, points, A4

      // 4. Calculate image dimensions to fit PDF page
      const imgProps = pdf.getImageProperties(imageData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // 5. Add the image to the PDF
      pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // 6. Save the PDF
      pdf.save(`booking-${booking._id}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Check console for details.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* This container is what we'll capture as a PDF */}
      <div ref={printRef}>
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Booking Confirmed!
        </h1>
        <p className="text-center text-gray-700 mb-4">
          Thank you for booking with us. Your booking details are below.
        </p>

        {/* Booking Summary */}
        <div className="border border-gray-300 p-6 rounded-lg shadow-md bg-white mb-8">
          <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
          <p>
            <strong>Booking ID:</strong> {booking._id}
          </p>
          <p>
            <strong>Trip Type:</strong> {tripType}
          </p>
          <p>
            <strong>From:</strong> {from}
          </p>
          <p>
            <strong>To:</strong> {to}
          </p>
          <p>
            <strong>Departure Date:</strong> {departureDate}
          </p>
          {tripType === 'roundTrip' && (
            <p>
              <strong>Return Date:</strong> {returnDate}
            </p>
          )}
          <p className="mt-4 text-lg font-semibold">
            <strong>Total Amount Paid:</strong> Rs. {finalTotal}
          </p>
        </div>

        {/* Passenger Details */}
        <div className="border border-gray-300 p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-bold mb-4">Passenger Details</h2>
          {passengerDetails.map((passenger, index) => (
            <div key={index} className="mb-4">
              <p>
                <strong>Passenger {index + 1}:</strong>
              </p>
              <p>Name: {passenger.name}</p>
              <p>Age: {passenger.age}</p>
              <p>Gender: {passenger.gender}</p>
              <p>Email: {passenger.email}</p>
              <p>Mobile: {passenger.mobile}</p>
              <p>Nationality: {passenger.nationality}</p>
              <p>Weight: {passenger.weight} kg</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="text-center mt-8 flex justify-center gap-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-200"
        >
          Download PDF
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
