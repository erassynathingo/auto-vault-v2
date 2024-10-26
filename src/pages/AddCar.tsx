import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car as CarIcon, Upload, X, Fuel, Calendar, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../db';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { carApi } from '../services/carApi';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import toast from 'react-hot-toast';

const FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
  'Other'
];

const AddCar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [makes, setMakes] = useState<Array<{ value: string; label: string }>>([]);
  const [models, setModels] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    engineCapacity: '',
    fuelType: '',
    chassisNumber: '',
  });

  useEffect(() => {
    loadMakes();
  }, []);

  const loadMakes = async () => {
    try {
      const makesData = await carApi.getMakes();
      setMakes(makesData.map(make => ({
        value: make.make_id,
        label: make.make_display
      })));
    } catch (error) {
      console.error('Error fetching car makes:', error);
    }
  };

  const loadModels = async (make: string) => {
    try {
      const modelsData = await carApi.getModels(make);
      setModels(modelsData.map(model => ({
        value: model.model_name,
        label: model.model_name
      })));
    } catch (error) {
      console.error('Error fetching car models:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('You must be logged in to add a car');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (selectedImage) {
        const storageRef = ref(storage, `cars/${currentUser.uid}/${Date.now()}_${selectedImage.name}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await db.cars.add({
        userId: currentUser.uid,
        ...formData,
        imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success('Car added successfully!');
      navigate('/cars');
    } catch (error) {
      console.error('Error adding car:', error);
      toast.error('Failed to add car');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black -mx-8 -mt-8 px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Add New Vehicle</h1>
          <p className="mt-2 text-gray-400">Register a new vehicle in your collection</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Make</label>
                <Select
                  options={makes}
                  value={formData.make ? makes.find(m => m.value === formData.make) || null : null}
                  onChange={(selected) => {
                    setFormData(prev => ({ ...prev, make: selected.value, model: '' }));
                    loadModels(selected.value);
                  }}
                  placeholder="Select make"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Model</label>
                <Select
                  options={models}
                  value={formData.model ? models.find(m => m.value === formData.model) || null : null}
                  onChange={(selected) => setFormData(prev => ({ ...prev, model: selected.value }))}
                  placeholder="Select model"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Engine Capacity</label>
                <input
                  type="text"
                  value={formData.engineCapacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, engineCapacity: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="e.g., 2.0L"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Fuel Type</label>
                <Select
                  options={FUEL_TYPES.map(type => ({ value: type, label: type }))}
                  value={formData.fuelType ? { value: formData.fuelType, label: formData.fuelType } : null}
                  onChange={(selected) => setFormData(prev => ({ ...prev, fuelType: selected.value }))}
                  placeholder="Select fuel type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Chassis Number</label>
                <input
                  type="text"
                  value={formData.chassisNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, chassisNumber: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Vehicle Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/20 border-dashed rounded-lg hover:border-accent-500 transition-colors">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-64 w-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-accent-500 hover:text-accent-400">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/cars')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Add Car
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddCar;