import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Filter, Download, Search } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Expense, ExpenseCategory } from '../db';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

const ExpenseList = () => {
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState({
    carId: '',
    category: '' as ExpenseCategory | '',
    startDate: '',
    endDate: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const cars = useLiveQuery(() =>
    db.cars.where('userId').equals(currentUser?.id || 0).toArray()
  );

  const expenses = useLiveQuery(() => {
    let query = db.expenses.where('userId').equals(currentUser?.id || 0);

    if (filters.carId) {
      query = query.filter(expense => expense.carId === parseInt(filters.carId));
    }
    if (filters.category) {
      query = query.filter(expense => expense.category === filters.category);
    }
    if (filters.startDate) {
      query = query.filter(expense => new Date(expense.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      query = query.filter(expense => new Date(expense.date) <= new Date(filters.endDate));
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      query = query.filter(expense => 
        expense.description.toLowerCase().includes(searchLower)
      );
    }

    return query.reverse().toArray();
  }, [filters]);

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amountNAD, 0) || 0;

  const exportToCSV = () => {
    if (!expenses) return;

    const headers = ['Date', 'Car', 'Category', 'Amount (NAD)', 'Amount (JPY)', 'Description'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => [
        new Date(expense.date).toLocaleDateString(),
        cars?.find(car => car.id === expense.carId)?.make || '',
        expense.category,
        expense.amountNAD,
        expense.amountJPY || '',
        `"${expense.description.replace(/"/g, '""')}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track and manage your vehicle expenses</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-5 h-5 mr-2" />
            Export
          </Button>
          <Link to="/add-expense">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 block w-64 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-primary-600">
              NAD {totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Car</label>
                  <Select
                    options={[
                      { value: '', label: 'All Cars' },
                      ...(cars?.map(car => ({
                        value: car.id!.toString(),
                        label: `${car.make} ${car.model}`,
                      })) || []),
                    ]}
                    value={filters.carId ? { value: filters.carId, label: cars?.find(c => c.id === parseInt(filters.carId))?.make || '' } : null}
                    onChange={(selected) => setFilters(prev => ({ ...prev, carId: selected.value }))}
                    placeholder="Select car"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select
                    options={[
                      { value: '', label: 'All Categories' },
                      ...EXPENSE_CATEGORIES,
                    ]}
                    value={filters.category ? EXPENSE_CATEGORIES.find(c => c.value === filters.category) || null : null}
                    onChange={(selected) => setFilters(prev => ({ ...prev, category: selected.value as ExpenseCategory }))}
                    placeholder="Select category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car
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
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cars?.find(car => car.id === expense.carId)?.make} {cars?.find(car => car.id === expense.carId)?.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
              <p className="text-gray-500">No expenses found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;