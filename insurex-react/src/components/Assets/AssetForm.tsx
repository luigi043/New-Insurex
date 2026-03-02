import React, { useState } from 'react';
import axios from 'axios';

// Define types locally to avoid import issues
enum AssetType {
  Vehicle = 'Vehicle',
  Property = 'Property',
  Watercraft = 'Watercraft',
  Aviation = 'Aviation',
  StockInventory = 'StockInventory',
  AccountsReceivable = 'AccountsReceivable',
  Machinery = 'Machinery',
  PlantEquipment = 'PlantEquipment',
  BusinessInterruption = 'BusinessInterruption',
  KeymanInsurance = 'KeymanInsurance',
  ElectronicEquipment = 'ElectronicEquipment'
}

enum VehicleType {
  Car = 'Car',
  Truck = 'Truck',
  Motorcycle = 'Motorcycle',
  Bus = 'Bus',
  Van = 'Van',
  Trailer = 'Trailer',
  Other = 'Other'
}

enum FuelType {
  Petrol = 'Petrol',
  Diesel = 'Diesel',
  Electric = 'Electric',
  Hybrid = 'Hybrid',
  LPG = 'LPG',
  Other = 'Other'
}

interface AssetFormProps {
  policyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AssetForm: React.FC<AssetFormProps> = ({ policyId, onSuccess, onCancel }) => {
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    policyId,
    name: '',
    description: '',
    value: '',
    location: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    // Vehicle specific
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    vehicleRegistrationNumber: '',
    vehicleVinNumber: '',
    vehicleType: VehicleType.Car,
    fuelType: FuelType.Petrol,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/assets`, {
        ...formData,
        assetType: selectedType,
        value: parseFloat(formData.value) || 0,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create asset:', error);
      alert('Failed to create asset. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  // Add placeholder and title to fix axe warnings
  const inputProps = (placeholder: string) => ({
    placeholder,
    title: placeholder,
  });

  if (!selectedType) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Select Asset Type</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.values(AssetType).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <span className="font-medium">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
            </button>
          ))}
        </div>
        <button 
          onClick={onCancel} 
          className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Add {selectedType.replace(/([A-Z])/g, ' $1').trim()}
        </h2>
        <button
          type="button"
          onClick={() => setSelectedType(null)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Change Type
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Asset Name *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            {...inputProps('Enter asset name')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Value ($) *</label>
          <input
            name="value"
            type="number"
            step="0.01"
            value={formData.value}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            {...inputProps('Enter asset value')}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location *</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          {...inputProps('Enter asset location')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          {...inputProps('Enter description')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Acquisition Date *</label>
        <input
          name="acquisitionDate"
          type="date"
          value={formData.acquisitionDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          title="Acquisition Date"
        />
      </div>

      {/* Vehicle specific fields */}
      {selectedType === AssetType.Vehicle && (
        <div className="space-y-4 border-t pt-4 mt-4">
          <h3 className="font-medium text-gray-900">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Make *</label>
              <input
                name="vehicleMake"
                value={formData.vehicleMake}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                {...inputProps('Vehicle make')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Model *</label>
              <input
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                {...inputProps('Vehicle model')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Year *</label>
              <input
                name="vehicleYear"
                type="number"
                value={formData.vehicleYear}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                {...inputProps('Vehicle year')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration *</label>
              <input
                name="vehicleRegistrationNumber"
                value={formData.vehicleRegistrationNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                {...inputProps('Registration number')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">VIN *</label>
              <input
                name="vehicleVinNumber"
                value={formData.vehicleVinNumber}
                onChange={handleChange}
                maxLength={17}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                {...inputProps('17-character VIN')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                title="Vehicle Type"
              >
                {Object.values(VehicleType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                title="Fuel Type"
              >
                {Object.values(FuelType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Asset'}
        </button>
      </div>
    </form>
  );
};