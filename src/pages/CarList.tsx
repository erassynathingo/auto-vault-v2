import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Car as CarIcon } from 'lucide-react';
import { db } from '../db';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import CarCard from '../components/cars/CarCard';

const CarList = () => {
  const { currentUser } = useAuth();
  const cars = useLiveQuery(() => 
    db.cars
      .where('userId')
      .equals(currentUser?.uid || '')
      .reverse()
      .toArray()
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Cars</h1>
          <p className="text-gray-600 mt-1">Manage your vehicle collection</p>
        </div>
        <Link to="/add-car">
          <Button className="bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800">
            <Plus className="w-5 h-5 mr-2" />
            Add New Car
          </Button>
        </Link>
      </div>

      {!cars || cars.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <CarIcon className="w-16 h-16 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No cars yet</h3>
          <p className="mt-2 text-gray-600">Get started by adding your first car</p>
          <Link to="/add-car">
            <Button className="mt-4 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Car
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CarList;