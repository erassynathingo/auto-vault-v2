import { useState, useEffect } from 'react';
import { CarMake, CarModel } from '../types/car';
import { carApi } from '../services/carApi';

export function useCars() {
  const [makes, setMakes] = useState<CarMake[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState({
    makes: false,
    models: false
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMakes();
  }, []);

  const loadMakes = async () => {
    setLoading(prev => ({ ...prev, makes: true }));
    setError(null);
    try {
      const data = await carApi.getMakes();
      setMakes(data);
    } catch (err) {
      setError('Failed to load car makes');
    } finally {
      setLoading(prev => ({ ...prev, makes: false }));
    }
  };

  const loadModels = async (make: string) => {
    if (!make) {
      setModels([]);
      return;
    }

    setLoading(prev => ({ ...prev, models: true }));
    setError(null);
    try {
      const data = await carApi.getModels(make);
      setModels(data);
    } catch (err) {
      setError('Failed to load car models');
    } finally {
      setLoading(prev => ({ ...prev, models: false }));
    }
  };

  return {
    makes,
    models,
    loading,
    error,
    loadModels,
    loadMakes
  };
}