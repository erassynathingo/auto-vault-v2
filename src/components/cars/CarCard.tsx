import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings, DollarSign, Calendar, AlertTriangle, Car as CarIcon, Fuel, Gauge } from 'lucide-react';
import { Car } from '../../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const expenses = useLiveQuery(() => 
    db.expenses
      .where('carId')
      .equals(car.id || 0)
      .toArray()
  );

  const reminders = useLiveQuery(() => 
    db.reminders
      .where('carId')
      .equals(car.id || 0)
      .filter(reminder => !reminder.isCompleted)
      .count()
  );

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amountNAD, 0) || 0;

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onMouseMove={onMouseMove}
      className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Gradient spotlight effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.1),
              transparent 80%
            )
          `,
        }}
      />

      {/* Image Section */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl">
        {car.imageUrl ? (
          <img
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/10 to-primary-500/30 flex items-center justify-center">
            <CarIcon className="w-16 h-16 text-primary-500/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 group-hover:from-black/80 transition-all duration-500" />
        
        {/* Quick Stats Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex justify-between text-white text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>NAD {totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <Fuel className="w-4 h-4 mr-1" />
                <span>{car.fuelType}</span>
              </div>
            </div>
            {reminders && reminders > 0 && (
              <div className="flex items-center text-red-300">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span>{reminders} {reminders === 1 ? 'Reminder' : 'Reminders'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {reminders && reminders > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full shadow-lg"
          >
            {reminders} Pending
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {car.make} {car.model}
          </h3>
          <p className="text-gray-600">{car.year}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Gauge className="w-4 h-4 mr-2 text-primary-500" />
            {car.engineCapacity}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-primary-500" />
            {new Date(car.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex space-x-2">
          <Link 
            to={`/cars/${car.id}`}
            className="flex-1 text-center px-4 py-2 bg-white border border-primary-500 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
          >
            View Details
          </Link>
          <Link
            to={`/cars/${car.id}/expenses`}
            className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg text-white hover:from-primary-700 hover:to-primary-800 transition-colors"
          >
            Add Expense
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;