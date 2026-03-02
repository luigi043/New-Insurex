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
import { PropertyType, ConstructionType } from '../../../types/asset.types';

const propertySchema = z.object({
  propertyType: z.nativeEnum(PropertyType),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
  squareFeet: z.number().min(1, 'Square feet must be greater than 0'),
  yearBuilt: z.number().min(1800).max(new Date().getFullYear()),
  constructionType: z.nativeEnum(ConstructionType),
  hasSecuritySystem: z.boolean().default(false),
  hasFireAlarm: z.boolean().default(false),
  hasSprinklerSystem: z.boolean().default(false),
});

interface PropertyFormProps {
  control: any;
  errors: any;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ control, errors }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Controller
          name="propertyType"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Property Type</InputLabel>
              <Select {...field} label="Property Type">
                {Object.values(PropertyType).map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Address"
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="City"
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="State"
              error={!!errors.state}
              helperText={errors.state?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="zipCode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Zip Code"
              error={!!errors.zipCode}
              helperText={errors.zipCode?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Country"
              error={!!errors.country}
              helperText={errors.country?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="squareFeet"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              fullWidth
              label="Square Feet"
              error={!!errors.squareFeet}
              helperText={errors.squareFeet?.message}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="yearBuilt"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              fullWidth
              label="Year Built"
              error={!!errors.yearBuilt}
              helperText={errors.yearBuilt?.message}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="constructionType"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Construction Type</InputLabel>
              <Select {...field} label="Construction Type">
                {Object.values(ConstructionType).map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="hasSecuritySystem"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Has Security System"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="hasFireAlarm"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Has Fire Alarm"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="hasSprinklerSystem"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Has Sprinkler System"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
