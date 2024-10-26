export interface CarMake {
  make_id: string;
  make_display: string;
  make_is_common: string;
  make_country: string;
}

export interface CarModel {
  model_name: string;
  model_make_id: string;
}

export interface Car {
  id?: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  engineCapacity: string;
  fuelType: string;
  chassisNumber: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'Other';