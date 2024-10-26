import React from 'react';
import { motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, AlertTriangle, DollarSign } from 'lucide-react';
import { db } from '../db';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

interface FineListProps {
  carId: number;
}

const FineList: React.FC<FineListProps> = ({ carId }) => {
  const fines = useLiveQuery(() =>
    db.fines
      .where('carId')
      .equals(carId)
      .reverse()
      .toArray()
  );

  const handlePayFine = async (fineId: number) => {
    await db.fines.update(fineId, { isPaid: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Fines</h3>
        <Link to={`/fines/add?carId=${carId}`}>
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Add Fine
          </Button>
        </Link>
      </div>

      {fines?.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No fines</h3>
          <p className="mt-1 text-sm text-gray-500">
            Keep track of any traffic fines here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fines?.map((fine) => (
            <motion.div
              key={fine.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm ${
                fine.isPaid ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <DollarSign className="w-6 h-6 text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    NAD {fine.amount.toLocaleString()}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(fine.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">{fine.description}</p>
                </div>
              </div>
              {!fine.isPaid && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePayFine(fine.id!)}
                >
                  Mark as Paid
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FineList;