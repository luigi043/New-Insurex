import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { VehicleType, FuelType } from '../../../types/asset.types';

const vehicleSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  value: z.number().min(0, 'Value must be positive'),
  location: z.string().min(2, 'Location is required'),
  acquisitionDate: z.string().min(1, 'Acquisition date is required'),
  policyId: z.string(),
  
  // Vehicle specific
  vehicleMake: z.string().min(1, 'Make is required'),
  vehicleModel: z.string().min(1, 'Model is required'),
  vehicleYear: z.number().min(1900).max(new Date().getFullYear() + 1),
  vehicleRegistrationNumber: z.string().min(1, 'Registration number is required'),
  vehicleVinNumber: z.string().min(17, 'VIN must be 17 characters').max(17),
  vehicleType: z.nativeEnum(VehicleType),
  fuelType: z.nativeEnum(FuelType),
  mileage: z.number().min(0).optional(),
  isCommercial: z.boolean().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  defaultValues: { policyId: string };
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      ...defaultValues,
      vehicleYear: new Date().getFullYear(),
      vehicleType: VehicleType.Car,
      fuelType: FuelType.Petrol,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Asset Name</label>
          <input
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Company Car 001"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Value ($)</label>
          <input
            type="number"
            step="0.01"
            {...register('value', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Make</label>
          <input
            {...register('vehicleMake')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Toyota"
          />
          {errors.vehicleMake && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicleMake.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input
            {...register('vehicleModel')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Camry"
          />
          {errors.vehicleModel && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicleModel.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            {...register('vehicleYear', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.vehicleYear && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicleYear.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Registration Number</label>
          <input
            {...register('vehicleRegistrationNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., ABC-1234"
          />
          {errors.vehicleRegistrationNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicleRegistrationNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">VIN Number</label>
          <input
            {...register('vehicleVinNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="17 character VIN"
          />
          {errors.vehicleVinNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicleVinNumber.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
          <select
            {...register('vehicleType')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {Object.values(VehicleType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
          <select
            {...register('fuelType')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {Object.values(FuelType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          {...register('location')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., Main Office Parking"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Additional details about the vehicle..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('isCommercial')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Commercial Vehicle
        </label>
      </div>

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