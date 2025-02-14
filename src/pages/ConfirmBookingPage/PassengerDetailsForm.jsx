import React from 'react';

const PassengerDetailsForm = ({
  passengerDetails,
  handlePassengerChange,
  handleIdentityCardUpload,
  numPassengers,
}) => {
  return (
    <div className="mb-8 border p-4 rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>

      {Array.from({ length: numPassengers }).map((_, index) => (
        <div key={index} className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">
            Passenger {index + 1}
          </h3>

          {/* Name, Age, Gender */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={passengerDetails[index].name}
                onChange={(e) =>
                  handlePassengerChange(index, 'name', e.target.value)
                }
                className="mt-1 w-full border rounded px-2 py-1"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="120"
                value={passengerDetails[index].age}
                onChange={(e) =>
                  handlePassengerChange(index, 'age', e.target.value)
                }
                className="mt-1 w-full border rounded px-2 py-1"
                placeholder="Enter age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={passengerDetails[index].gender}
                onChange={(e) =>
                  handlePassengerChange(index, 'gender', e.target.value)
                }
                className="mt-1 w-full border rounded px-2 py-1"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Email, Mobile, Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={passengerDetails[index].email}
                onChange={(e) =>
                  handlePassengerChange(index, 'email', e.target.value)
                }
                className="mt-1 w-full border rounded px-2 py-1"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit number"
                value={passengerDetails[index].mobile}
                onChange={(e) =>
                  handlePassengerChange(index, 'mobile', e.target.value)
                }
                className="mt-1 w-full border rounded px-2 py-1"
                placeholder="10-digit mobile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Nationality <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={passengerDetails[index].nationality}
                onChange={(e) =>
                  handlePassengerChange(index, 'nationality', e.target.value)
                }
                className="mt-1 w-full border rounded px-2 py-1"
                placeholder="e.g. Indian"
              />
            </div>
          </div>

          {/* Weight */}
          <div className="mt-4">
            <label className="block text-sm font-medium">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              max="300"
              value={passengerDetails[index].weight}
              onChange={(e) =>
                handlePassengerChange(index, 'weight', e.target.value)
              }
              className="mt-1 w-full border rounded px-2 py-1"
              placeholder="Enter weight in kilograms"
            />
            <p className="text-xs text-gray-500 mt-1">
              Passengers over 75 kg incur additional charges of Rs. 1,500 per extra kg.
            </p>
          </div>

          {/* Identity Card Section */}
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Identity Verification</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  ID Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={passengerDetails[index].identityCardType || ''}
                  onChange={(e) =>
                    handlePassengerChange(index, 'identityCardType', e.target.value)
                  }
                  className="mt-1 w-full border rounded px-2 py-1"
                >
                  <option value="">Select ID Type</option>
                  <option value="Passport">Passport</option>
                  <option value="Aadhar">Aadhar Card</option>
                  <option value="PAN">PAN Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  ID Document <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*, .pdf"
                    required
                    onChange={(e) => handleIdentityCardUpload(index, e)}
                    className="mt-1 w-full"
                  />
                  {passengerDetails[index].identityCardImageUrl && (
                    <span className="text-green-600">✓ Uploaded</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PassengerDetailsForm;
