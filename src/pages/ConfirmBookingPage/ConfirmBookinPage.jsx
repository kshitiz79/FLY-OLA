
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlightSummary from './FlightSummary';
import PassengerDetailsForm from './PassengerDetailsForm';

import axios from 'axios';
import PaymentSection from './PaymentSection';
const ConfirmBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If no booking data is provided via router state
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

  // Destructure booking details from router state
  const {
    tripType = 'oneWay',
    from = 'Helipad',
    to = 'Airport',
    departureDate = '2025-02-12',
    returnDate = '',
    packageOption = '',
    passengers = '1',
    price,
    selectedFlight,
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

  // Passenger details state
  const [passengerDetails, setPassengerDetails] = useState(
    Array.from({ length: numPassengers }, () => ({
      name: '',
      age: '',
      gender: '',
      email: '',
      mobile: '',
      nationality: '',
      weight: '',
      identityCardType: '',       // Add these fields
      identityCardImageUrl: '' 
    }))
  );

  // UPI payment details
  const upiId = 'MSJETSERVEAVIATIONPRIVATELIMITED.eazypay@icici';
  const upiName = 'FLY Ola';

  // Booking and modal state
  const [booking, setBooking] = useState(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [transactionSuffix, setTransactionSuffix] = useState('');

  const handlePassengerChange = (index, field, value) => {
    setPassengerDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return newDetails;
    });
  };





  const handleIdentityCardUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Flyola'); // Verify this EXACT preset name
    formData.append('folder', 'identity_cards'); // Add folder organization
  
    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/disqd09gk/image/upload', // Verify cloud name
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.data.secure_url) {
        handlePassengerChange(index, 'identityCardImageUrl', response.data.secure_url);
      }
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      alert(`Upload failed: ${error.response?.data?.error?.message || 'Server error'}`);
    }
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

  // Handler for confirming booking
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
      const response = await fetch('http://localhost:4000/api/customer-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const contentType = response.headers.get('content-type') || '';
      let responseData;
      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (response.ok) {
        setBooking(responseData.booking);
        setShowWhatsAppModal(true);
      } else {
        const errorMessage =
          (responseData && responseData.message) || responseData || 'An error occurred';
        throw new Error(errorMessage);
      }
    } catch (error) {
      alert('Error: ' + error.message);
      console.error('Booking error:', error);
    }
  };

  // Handler for sending WhatsApp message
  const handleWhatsAppSend = () => {
    if (transactionSuffix.length !== 5) {
      alert('Please enter exactly 5 digits.');
      return;
    }
    const message = `Booking ID: ${booking._id}. Transaction ID (last 5 digits): ${transactionSuffix}.`;
    const url = `https://wa.me/9319208927?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    navigate('/booking-success', { state: { booking } });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Confirm Booking</h1>

      <FlightSummary
        tripType={tripType}
        from={from}
        to={to}
        departureDate={departureDate}
        returnDate={returnDate}
        packageOption={packageOption}
        selectedFlight={selectedFlight}
        selectedFlightOutbound={selectedFlightOutbound}
        selectedFlightReturn={selectedFlightReturn}
        numPassengers={numPassengers}
        totalPrice={totalPrice}
      />

      <PassengerDetailsForm
        passengerDetails={passengerDetails}
        handlePassengerChange={handlePassengerChange}
        numPassengers={numPassengers}
        handlePassengerChange={handlePassengerChange}
        handleIdentityCardUpload={handleIdentityCardUpload}
      />

<PaymentSection
  totalPrice={totalPrice}
  overweightFees={overweightFees}
  finalTotal={finalTotal}
  upiId={upiId}
  upiName={upiName}
  handleConfirmBooking={handleConfirmBooking}
  showWhatsAppModal={showWhatsAppModal}
  setShowWhatsAppModal={setShowWhatsAppModal}
  transactionSuffix={transactionSuffix}
  setTransactionSuffix={setTransactionSuffix}
  handleWhatsAppSend={handleWhatsAppSend}
  numPassengers={numPassengers}
  passengerDetails={passengerDetails} // Pass it here
  handlePassengerChange={handlePassengerChange} // And this as well
/>



      {/* Terms & Conditions */}
      <div className="mb-8 p-4">
        {/* ... (keep terms and conditions JSX) */}
      </div>
    </div>
  );
};

export default ConfirmBookingPage;





