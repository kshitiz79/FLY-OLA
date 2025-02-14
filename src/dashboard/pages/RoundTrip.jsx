import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHelicopter } from 'react-icons/fa';
import { useGetBookingsQuery } from './../../redux/store';
import SearchBar from './../../components/SearchAdmin';

const RoundTrip = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [tripType, setTripType] = useState(state?.tripType || 'roundTrip');
  const [from, setFrom] = useState(state?.from || 'Helipad');
  const [to, setTo] = useState(state?.to || 'Airport');
  const [departureDate, setDepartureDate] = useState(state?.departureDate || '2025-02-12');
  const [returnDate, setReturnDate] = useState(state?.returnDate || '2025-02-13');
  const [packageOption, setPackageOption] = useState(state?.packageOption || 'base');
  const [passengersClass, setPassengersClass] = useState(state?.passengers || '1');
  const numPassengers = parseInt(passengersClass, 10) || 1;

  const basePrice = packageOption === 'base' ? 35000 : 50000;
  const dynamicPrice = basePrice * numPassengers;

  const [outboundSlots, setOutboundSlots] = useState([]);
  const [returnSlots, setReturnSlots] = useState([]);
  const [selectedOutboundIndex, setSelectedOutboundIndex] = useState(null);
  const [selectedReturnIndex, setSelectedReturnIndex] = useState(null);

  const { data: bookingsData } = useGetBookingsQuery();
  const slotsData = bookingsData?.bookings || [];
  const { refetch } = useGetBookingsQuery();

  // Filter slots for outbound (from → to) and return (to → from)
  const filterSlots = () => {
    const out = slotsData.filter((slot) => {
      const slotFrom = slot.from?.toLowerCase() || "";
      const slotTo = slot.to?.toLowerCase() || "";
      return (
        slotFrom === from.toLowerCase() &&
        slotTo === to.toLowerCase() &&
        slot.date === departureDate
      );
    });
    const ret = slotsData.filter((slot) => {
      const slotFrom = slot.from?.toLowerCase() || "";
      const slotTo = slot.to?.toLowerCase() || "";
      return (
        slotFrom === to.toLowerCase() &&
        slotTo === from.toLowerCase() &&
        slot.date === returnDate
      );
    });
    setOutboundSlots(out);
    setReturnSlots(ret);
  };

  // Redirect if tripType is oneWay
  useEffect(() => {
    if (tripType === 'oneWay') {
      navigate('booking-cu-flight/dashboard/single-trip-page-admin', {
        state: { tripType, from, to, departureDate, passengers: passengersClass },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripType]);

  // Filter slots when booking data or dates change
  useEffect(() => {
    if (slotsData.length > 0) {
      filterSlots();
    }
  }, [slotsData, from, to, departureDate, returnDate]);

  // Enforce allowed return dates: only same day or the next day after departureDate
  useEffect(() => {
    const departure = new Date(departureDate);
    const sameDayStr = departureDate;
    const nextDay = new Date(departure);
    nextDay.setDate(departure.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split("T")[0];

    // If returnDate is not one of the allowed dates, reset it (here we default to departureDate)
    if (returnDate !== sameDayStr && returnDate !== nextDayStr) {
      setReturnDate(sameDayStr);
    }
  }, [departureDate, returnDate]);

  // Compute allowed return dates (if your SearchBar supports restricting dates)
  const allowedReturnDates = (() => {
    const departure = new Date(departureDate);
    const sameDay = departureDate;
    const nextDay = new Date(departure);
    nextDay.setDate(departure.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split("T")[0];
    return { sameDay, nextDay: nextDayStr };
  })();

  const handleBookNow = async () => {
    if (selectedOutboundIndex == null || selectedReturnIndex == null) return;

    const outboundFlight = outboundSlots[selectedOutboundIndex];
    const returnFlight = returnSlots[selectedReturnIndex];

    console.log('Number of passengers:', numPassengers);

    const newBooking = {
      tripType: "roundTrip",
      departureDate: outboundFlight.date,
      from: outboundFlight.from,
      to: outboundFlight.to,
      time: outboundFlight.time,
      duration: outboundFlight.duration,
      price: dynamicPrice,
      returnDate: returnFlight.date,
      returnTime: returnFlight.time,
      selectedFlightOutbound: outboundFlight,
      selectedFlightReturn: returnFlight,
      passengers: numPassengers,
      baseFare: dynamicPrice,
      finalTotal: dynamicPrice,
    };

    // Instead of booking here, redirect to the booking form with the details
    navigate('dashboard/round-trip-page-admin/dashboard/booking-form-admin', {
      state: {
        ...newBooking,
        packageOption,
        message: 'Proceed with final booking',
      },
    });
  };

  return (
    <div className="p-4 md:p-8">
      <SearchBar
        tripType={tripType}
        setTripType={setTripType}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        passengersClass={passengersClass}
        setPassengersClass={setPassengersClass}
        packageOption={packageOption}
        setPackageOption={setPackageOption}
        onUpdate={filterSlots}
        allowedReturnDates={allowedReturnDates} // Pass allowed dates if SearchBar supports it
      />

      <div className="mt-8 ">
        <h2 className="text-xl font-semibold mb-4">
          {from} ⇄ {to}
        </h2>
        <p className="text-sm text-gray-700 mb-6">
          Depart: {departureDate} | Return: {returnDate}
        </p>

        {/* Booking Summary */}
        <div className="mt-6 p-4 border rounded-lg">
          {selectedOutboundIndex !== null && selectedReturnIndex !== null ? (
            <>
              <p className="text-lg font-semibold mb-4 text-center">
                Booking Summary
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-bold mb-2">Outbound Flight:</p>
                  <p>
                    {outboundSlots[selectedOutboundIndex].from} →{' '}
                    {outboundSlots[selectedOutboundIndex].to}
                  </p>
                  <p>
                    Date: {outboundSlots[selectedOutboundIndex].date} | Time:{' '}
                    {outboundSlots[selectedOutboundIndex].time}
                  </p>
                  <p className="text-sm">
                    Seats Available: {outboundSlots[selectedOutboundIndex].seatsAvailable} (Needed: {numPassengers})
                  </p>
                </div>
                <div>
                  <p className="font-bold mb-2">Return Flight:</p>
                  <p>
                    {returnSlots[selectedReturnIndex].from} →{' '}
                    {returnSlots[selectedReturnIndex].to}
                  </p>
                  <p>
                    Date: {returnSlots[selectedReturnIndex].date} | Time:{' '}
                    {returnSlots[selectedReturnIndex].time}
                  </p>
                  <p className="text-sm">
                    Seats Available: {returnSlots[selectedReturnIndex].seatsAvailable} (Needed: {numPassengers})
                  </p>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">
                  Total Price: Rs. {dynamicPrice}
                </p>
                <button
                  onClick={handleBookNow}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-200 mt-4"
                >
                  Book Now
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold mb-4 text-center">
                Please select both an outbound and a return flight to proceed with booking.
              </p>
              <div className="text-center">
                <button
                  disabled
                  className="bg-gray-400 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-200 mt-4 cursor-not-allowed"
                >
                  Book Now
                </button>
              </div>
            </>
          )}
        </div>

        {/* Flight Slots Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Outbound</h3>
            {outboundSlots.length === 0 ? (
              <p className="text-gray-500">No outbound slots found.</p>
            ) : (
              outboundSlots.map((slot, idx) => {
                const seatsAvailable = slot.seatsAvailable;
                const canSelect = seatsAvailable >= numPassengers;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (canSelect) setSelectedOutboundIndex(idx);
                    }}
                    className={`cursor-pointer bg-white rounded-lg shadow p-4 mb-4 flex items-center justify-between transition-all duration-200
                      ${selectedOutboundIndex === idx ? 'border-4 border-blue-600' : ''}
                      ${canSelect ? '' : 'opacity-50 cursor-not-allowed'}
                    `}
                  >
                    <div>
                      <p className="font-bold flex items-center space-x-2">
                        <FaHelicopter className="text-blue-600" />
                        <span>
                          {slot.from} → {slot.to}
                        </span>
                      </p>
                      <p>Date: {slot.date}</p>
                      <p>Time: {slot.time}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Duration: {slot.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base text-red-600">
                        Seats Left: {slot.seatsAvailable}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Return</h3>
            {returnSlots.length === 0 ? (
              <p className="text-gray-500">No return slots found.</p>
            ) : (
              returnSlots.map((slot, idx) => {
                const seatsAvailable = slot.seatsAvailable;
                const canSelect = seatsAvailable >= numPassengers;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (canSelect) setSelectedReturnIndex(idx);
                    }}
                    className={`cursor-pointer bg-white rounded-lg shadow p-4 mb-4 flex items-center justify-between transition-all duration-200
                      ${selectedReturnIndex === idx ? 'border-4 border-blue-600' : ''}
                      ${canSelect ? '' : 'opacity-50 cursor-not-allowed'}
                    `}
                  >
                    <div>
                      <p className="font-bold flex items-center space-x-2">
                        <FaHelicopter className="text-blue-600" />
                        <span>
                          {slot.from} → {slot.to}
                        </span>
                      </p>
                      <p>Date: {slot.date}</p>
                      <p>Time: {slot.time}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Duration: {slot.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-600">
                        Seats Left: {slot.seatsAvailable}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundTrip;
