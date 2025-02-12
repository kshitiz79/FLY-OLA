import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">Fly Ola</Link>
        </div>
       
        <div>
          <button className=" text-white px-4 py-2 rounded-lg shadow uppercase ">
       Welcome
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
