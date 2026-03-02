import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { VehicleType, FuelType } from '../../../types/asset.types';

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  vinNumber: z.string().length(17, 'VIN must be 17 characters').optional(),
  engineNumber: z.string().optional(),
  color: z.string().optional(),
  mileage: z.number().min(0).optional(),
  vehicleType: z.nativeEnum(VehicleType),
  fuelType: z.nativeEnum(FuelType),
  isCommercial: z.boolean().default(false),
});

interface VehicleFormProps {
  control: any;
  errors: any;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ control, errors }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Controller
          name="make"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Make"
              error={!!errors.make}
              helperText={errors.make?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="model"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Model"
              error={!!errors.model}
              helperText={errors.model?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Controller
          name="year"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              fullWidth
              label="Year"
              error={!!errors.year}
              helperText={errors.year?.message}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Controller
          name="registrationNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Registration Number"
              error={!!errors.registrationNumber}
              helperText={errors.registrationNumber?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Controller
          name="vinNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="VIN Number"
              error={!!errors.vinNumber}
              helperText={errors.vinNumber?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Controller
          name="vehicleType"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Vehicle Type</InputLabel>
              <Select {...field} label="Vehicle Type">
                {Object.values(VehicleType).map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Controller
          name="fuelType"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Fuel Type</InputLabel>
              <Select {...field} label="Fuel Type">
                {Object.values(FuelType).map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Controller
          name="mileage"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              fullWidth
              label="Mileage"
              onChange={(e) => field.onChange(parseInt(e.target.value))}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="isCommercial"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Commercial Vehicle"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
