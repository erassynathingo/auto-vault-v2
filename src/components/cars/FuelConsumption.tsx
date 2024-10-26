import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fuel, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../ui/Button';

interface FuelRecord {
  date: string;
  liters: number;
  cost: number;
  kilometers: number;
}

const FuelConsumption = () => {
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    liters: '',
    cost: '',
    kilometers: '',
  });

  // Mock data - replace with actual data from database
  const fuelRecords: FuelRecord[] = [
    { date: '2024-01-01', liters: 45, cost: 850, kilometers: 500 },
    { date: '2024-01-15', liters: 42, cost: 790, kilometers: 480 },
    { date: '2024-02-01', liters: 48, cost: 900, kilometers: 520 },
  ];

  const calculateEfficiency = (liters: number, kilometers: number) => {
    return ((liters / kilometers) * 100).toFixed(2);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Fuel Consumption</h3>
        <Button
          variant="outline"
          onClick={() => setShowAddRecord(!showAddRecord)}
        >
          Add Fuel Record
        </Button>
      </div>

      {showAddRecord && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Liters
              </label>
              <input
                type="number"
                value={newRecord.liters}
                onChange={(e) => setNewRecord(prev => ({ ...prev, liters: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost (NAD)
              </label>
              <input
                type="number"
                value={newRecord.cost}
                onChange={(e) => setNewRecord(prev => ({ ...prev, cost: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kilometers
              </label>
              <input
                type="number"
                value={newRecord.kilometers}
                onChange={(e) => setNewRecord(prev => ({ ...prev, kilometers: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="0"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowAddRecord(false)}
            >
              Cancel
            </Button>
            <Button>
              Save Record
            </Button>
          </div>
        </motion.div>
      )}

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={fuelRecords}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="liters" stroke="#0ea5e9" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <Fuel className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-gray-700">
              Average Consumption
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {calculateEfficiency(
              fuelRecords.reduce((acc, record) => acc + record.liters, 0),
              fuelRecords.reduce((acc, record) => acc + record.kilometers, 0)
            )} L/100km
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700">
              Total Distance
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {fuelRecords.reduce((acc, record) => acc + record.kilometers, 0)} km
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">
              Last Refuel
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {new Date(fuelRecords[fuelRecords.length - 1].date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FuelConsumption;