import React from 'react';
import { motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { Activity, Car, Wrench, DollarSign } from 'lucide-react';
import { db } from '../../db';
import { useAuth } from '../../contexts/AuthContext';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'car_added':
      return <Car className="text-emerald-500" />;
    case 'expense_added':
      return <DollarSign className="text-blue-500" />;
    case 'maintenance':
      return <Wrench className="text-orange-500" />;
    default:
      return <Activity className="text-purple-500" />;
  }
};

const RecentActivities: React.FC = () => {
  const { currentUser } = useAuth();
  
  const expenses = useLiveQuery(() => 
    db.expenses
      .where('userId')
      .equals(currentUser?.id || '')
      .reverse()
      .limit(5)
      .toArray()
  );

  const cars = useLiveQuery(() => 
    db.cars
      .where('userId')
      .equals(currentUser?.id || '')
      .toArray()
  );

  if (!expenses || !cars) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {expenses.map((expense, index) => {
          const car = cars.find(c => c.id === expense.carId);
          return (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="p-2 rounded-full bg-gray-50">
                <DollarSign className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {car ? `${car.make} ${car.model}` : 'Unknown Car'} - {expense.category.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-gray-500">
                  NAD {expense.amountNAD.toLocaleString()} • {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          );
        })}
        {expenses.length === 0 && (
          <p className="text-center text-gray-500 py-4">No recent activities</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;