import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white text-blue-500 shadow-md">
      <div className="container mx-auto  flex p-3 justify-between items-center">
        <div >
        <img src="/logo-04.png" alt="Logo " className='w-28' />

        </div>
       
        <div>
          <button className=" text-blue-950 bg-blue-100  px-4 py-2 rounded-lg shadow uppercase ">
       Welcome
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
