import React from 'react';
import { motion } from 'framer-motion';
import { 
  Tool,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';

interface MaintenanceTimelineProps {
  carId: number;
}

const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({ carId }) => {
  const maintenanceRecords = useLiveQuery(() =>
    db.expenses
      .where('carId')
      .equals(carId)
      .filter(expense => 
        expense.category === 'MECHANICAL_WORKS' || 
        expense.category === 'BODY_WORKS'
      )
      .reverse()
      .toArray()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Maintenance History</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700">
          Add Record
        </button>
      </div>

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-6 w-px bg-gray-200" />
        
        <div className="space-y-8">
          {maintenanceRecords?.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-12"
            >
              <div className="absolute left-0 p-2 rounded-full bg-white border-2 border-primary-500">
                <Tool className="w-4 h-4 text-primary-500" />
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {record.category === 'MECHANICAL_WORKS' ? 'Mechanical Service' : 'Body Work'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{record.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-600">
                    NAD {record.amountNAD.toLocaleString()}
                  </span>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTimeline;