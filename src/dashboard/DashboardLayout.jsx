import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaPlus, FaPlane, FaPlaneArrival, FaMoneyBillAlt } from 'react-icons/fa';

const DashboardLayout = () => {
  return (
    <div className="h-screen flex font-sans bg-gray-100">

      <nav className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">FlyOla Dashboard</h2>
        <ul className="space-y-1">

          <li>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-700 hover:bg-blue-50'
                }`
              }
            >
              <FaTachometerAlt className="mr-3" />
              Dashboard Home
            </NavLink>
          </li>
     
          <li>
            <NavLink
              to="/dashboard/add-booking"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-700 hover:bg-blue-50'
                }`
              }
            >
              <FaPlus className="mr-3" />
              Add Booking
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/booked-flight"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-700 hover:bg-blue-50'
                }`
              }
            >
              <FaPlane className="mr-3" />
              Booked Flight
            </NavLink>
            <NavLink
              to="/dashboard/booking-cu-flight"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-700 hover:bg-blue-50'
                }`
              }
            >
              <FaPlaneArrival className="mr-3" />
              Book Custumer Flight
            </NavLink>
            <NavLink
              to="/dashboard/price"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-700 hover:bg-blue-50'
                }`
              }
            >
              <FaMoneyBillAlt className="mr-3" />
              Set Price
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
