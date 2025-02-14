import React from "react";
import { IoCall } from "react-icons/io5";
import { SiGmail } from "react-icons/si";


const Footer = () => {
  return (
    <>
      <div className="bg-white text-black">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-center md:justify-between p-4 max-w-screen mx-auto">
        {/* Left Side */}
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0 lg:px-16">
          <img src="/logo-04.png" alt="FLY OLA" className="w-40 mb-4" />
          <div className="text-center md:text-left space-y-2">
            {/* You can add additional left-side text or links here */}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center md:items-end space-y-2 lg:px-16">
          <span className="font-semibold text-lg">Contact Info:</span>
          <a
            href="mailto:sales@propertyorbits.com"
            className="flex items-center text-black hover:underline text-right"
          >
            <SiGmail className="mr-2" aria-label="Email Icon" /> info@jetaviation.co.in , booking@flyolaindia.com
          </a>
          <a
            href="tel:+919873961111"
            className="flex items-center text-black hover:underline"
          >
            <IoCall className="mr-2" aria-label="Phone Icon" /> 9212170033, 9311896389 , 9810342422, 9319208927
          </a>
  
        
        </div>
      </div>

      {/* Legal Section */}
      <div className=" p-4">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-screen mx-auto lg:px-16">

          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="https://flyola.in/page/privacy-policy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/refund-policy" className="hover:underline">
              Refund Policy
            </a>
            <a href="/terms-conditions" className="hover:underline">
              Terms &amp; Conditions
            </a>
            <a href="/disclaimer" className="hover:underline">
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </div>












      <div className="bg-white border-t border-gray-300 text-black font-bold flex flex-col md:flex-row items-center md:justify-between h-auto md:h-12 px-4 md:px-20 py-4 md:py-0">
  <a
    // href="https://propertyorbits.com/"
    className="text-center hover:underline sm:mb-2 "
    target="_blank"
    rel="noopener noreferrer"
  >
   Jet Serve Aviation Pvt. Ltd © 2025. All Right Reserved 

   
  </a>
  <a
    href="https://rbshstudio.com"
    className="flex items-center hover:underline   md:mt-0"
    target="_blank"
    rel="noopener noreferrer"
  >
    Powered by <span className="text-[#0133EA] ml-1"> RBSH Studio </span> 
    {/* Uncomment if you want to add an icon */}
    {/* <img src={shareIcon} alt="Share Icon" className="w-5 h-5 ml-2" /> */}
  </a>
</div>

    </>
  );
};

export default Footer;