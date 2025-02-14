// src/App.js
import { Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import Header from './components/Header';
import OneWayPage from './pages/OneWayPage';
import RoundTripPage from './pages/RoundTrip';
import Footer from './components/Footer';
import ConfirmBookingPage from './pages/ConfirmBookingPage/ConfirmBookinPage';

// Dashboard & Admin Components
import Dashboard from './dashboard/pages/Dashboard';
import DashboardLayout from './dashboard/DashboardLayout';
import AddBooking from './dashboard/pages/AddBooking';

import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/AdminRoute';
import GetBooking from './dashboard/pages/GetBooking';
import BookingSuccessPage from './dashboard/pages/BookingSucessFulPage';
import BookCustumerFlite from './dashboard/pages/BookCustumerFlite';
import RoundTrip from './dashboard/pages/RoundTrip';
import OneWay from './dashboard/pages/OneWayBooking';
import BookingForm from './dashboard/pages/BookingForm';




function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/oneway" element={<OneWayPage />} />
        <Route path="/roundtrip" element={<RoundTripPage />} />
        <Route path="/confirm-booking" element={<ConfirmBookingPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/booking-success" element={<BookingSuccessPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-booking" element={<AddBooking />} />
          <Route path="booked-flight" element={<GetBooking />} />
          <Route path="booking-cu-flight" element={<BookCustumerFlite />} />
          <Route path="round-trip-page-admin" element={<RoundTrip />} />
          <Route path="booking-cu-flight/dashboard/single-trip-page-admin" element={<OneWay />} />
          <Route path="round-trip-page-admin/dashboard/round-trip-page-admin/dashboard/booking-form-admin" element={<BookingForm />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
