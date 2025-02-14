import React from 'react';
import QRCode from 'react-qr-code';

const PaymentSection = ({
    totalPrice,
    overweightFees,
    finalTotal,
    upiId,
    upiName,
    handleConfirmBooking,
    showWhatsAppModal,
    setShowWhatsAppModal,
    transactionSuffix,
    setTransactionSuffix,
    handleWhatsAppSend,

}) => (

    
    <div className="mb-8 border p-4 rounded-lg bg-white shadow-md">
    <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
    
    {/* Price Summary */}
    <div className="mb-4 p-4 bg-gray-50 rounded">
      <div className="flex justify-between mb-2">
        <span>Base Fare:</span>
        <span>₹{totalPrice}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Overweight Fees:</span>
        <span>₹{overweightFees}</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>₹{finalTotal}</span>
      </div>
    </div>

    {/* UPI Payment Section */}
    <div className='flex justify-center items-center' >
    <div className="mb-6">
      <h3 className="font-semibold mb-2">UPI Payment</h3>
      <div className="flex flex-col items-center gap-4">
        <QRCode
          value={`upi://pay?pa=${upiId}&pn=${upiName}&am=${finalTotal}`}
          size={128}
        />
        <div className="text-center">
          <p className="font-medium">{upiName}</p>
          <p className="text-sm text-gray-600">{upiId}</p>
        </div>
      </div>
    </div>
    <div>
  <span className='font-bold'> Bank Details: Jet Serve Aviation Pvt. Ltd. </span>  <br/>
A/c No. 057505001874
IFSC Code: ICIC-0000-575
Account type: Current A/c
Bank: ICICI Bank Ltd Branch: Hero Honda Branch, Gurugram
    </div>
    </div>

    {/* Confirmation Button */}
    <button
      onClick={handleConfirmBooking}
      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
    >
      Confirm Booking
    </button>

    {/* WhatsApp Modal */}
    {showWhatsAppModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-lg font-semibold mb-4">Verify Payment</h3>
          <input
            type="text"
            placeholder="Last 5 digits of transaction ID"
            className="w-full border rounded p-2 mb-4"
            value={transactionSuffix}
            onChange={(e) => setTransactionSuffix(e.target.value)}
            maxLength={5}
          />
          <div className="flex gap-2">
            <button
              onClick={handleWhatsAppSend}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded"
            >
              Send via WhatsApp
            </button>
            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default PaymentSection;