import React from 'react';
import { motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Bell, Calendar, Check } from 'lucide-react';
import { db } from '../db';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

interface ReminderListProps {
  carId: number;
}

const ReminderList: React.FC<ReminderListProps> = ({ carId }) => {
  const reminders = useLiveQuery(() =>
    db.reminders
      .where('carId')
      .equals(carId)
      .reverse()
      .toArray()
  );

  const handleComplete = async (reminderId: number) => {
    await db.reminders.update(reminderId, { isCompleted: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Reminders</h3>
        <Link to={`/reminders/add?carId=${carId}`}>
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Add Reminder
          </Button>
        </Link>
      </div>

      {reminders?.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reminders</h3>
          <p className="mt-1 text-sm text-gray-500">
            Stay on top of maintenance with reminders.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders?.map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm ${
                reminder.isCompleted ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <Calendar className="w-6 h-6 text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{reminder.title}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(reminder.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {!reminder.isCompleted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleComplete(reminder.id!)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReminderList;