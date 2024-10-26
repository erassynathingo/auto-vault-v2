import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  Info, 
  DollarSign, 
  Image as ImageIcon, 
  FileText, 
  Bell, 
  AlertTriangle,
  Plus
} from 'lucide-react';
import { db } from '../db';
import Button from '../components/ui/Button';
import ExpenseList from '../components/ExpenseList';
import MediaGrid from '../components/MediaGrid';
import DocumentList from '../components/DocumentList';
import ReminderList from '../components/ReminderList';
import FineList from '../components/FineList';

const tabs = [
  { id: 'details', label: 'Details', icon: Info },
  { id: 'expenses', label: 'Expenses', icon: DollarSign },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'fines', label: 'Fines', icon: AlertTriangle },
];

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  
  const car = useLiveQuery(() => 
    db.cars.get(parseInt(id!))
  );

  if (!car) return <div>Loading...</div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-600">Make</dt>
                  <dd className="text-sm font-medium text-gray-900">{car.make}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Model</dt>
                  <dd className="text-sm font-medium text-gray-900">{car.model}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Year</dt>
                  <dd className="text-sm font-medium text-gray-900">{car.year}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Engine Capacity</dt>
                  <dd className="text-sm font-medium text-gray-900">{car.engineCapacity}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Fuel Type</dt>
                  <dd className="text-sm font-medium text-gray-900">{car.fuelType}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Chassis Number</dt>
                  <dd className="text-sm font-medium text-gray-900">{car.chassisNumber}</dd>
                </div>
              </dl>
            </div>
            {car.avatar && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Vehicle Image</h3>
                <img
                  src={car.avatar}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </motion.div>
        );
      case 'expenses':
        return <ExpenseList carId={parseInt(id!)} />;
      case 'media':
        return <MediaGrid carId={parseInt(id!)} />;
      case 'documents':
        return <DocumentList carId={parseInt(id!)} />;
      case 'reminders':
        return <ReminderList carId={parseInt(id!)} />;
      case 'fines':
        return <FineList carId={parseInt(id!)} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {car.make} {car.model} ({car.year})
          </h1>
          <p className="text-gray-600 mt-1">Vehicle Details and Management</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => {}}>
            Edit Details
          </Button>
          <Button onClick={() => {}}>
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center px-3 py-4 text-sm font-medium border-b-2 
                  ${activeTab === id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;