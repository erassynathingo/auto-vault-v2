import React from 'react';
import { motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, DollarSign } from 'lucide-react';
import { db } from '../../db';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface ExpenseListProps {
  carId: number;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ carId }) => {
  const expenses = useLiveQuery(() =>
    db.expenses
      .where('carId')
      .equals(carId)
      .reverse()
      .toArray()
  );

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amountNAD, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Expenses</h3>
          <p className="text-sm text-gray-600">Total: NAD {totalExpenses.toLocaleString()}</p>
        </div>
        <Link to={`/add-expense?carId=${carId}`}>
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount (NAD)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount (JPY)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses?.map((expense) => (
              <motion.tr
                key={expense.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {expense.category.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  NAD {expense.amountNAD.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {expense.amountJPY ? `¥${expense.amountJPY.toLocaleString()}` : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {expense.description}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {expenses?.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first expense.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;