import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { Car, DollarSign, Bell, FileText, TrendingUp, Calendar } from 'lucide-react';
import { db } from '../db';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import RecentActivities from '../components/dashboard/RecentActivities';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const cars = useLiveQuery(() => db.cars.where('userId').equals(currentUser?.id || '').toArray());
  const expenses = useLiveQuery(() => db.expenses.where('userId').equals(currentUser?.id || '').toArray());
  const reminders = useLiveQuery(() => 
    db.reminders
      .where('userId').equals(currentUser?.id || '')
      .filter(reminder => !reminder.isCompleted)
      .toArray()
  );

  const totalExpensesNAD = expenses?.reduce((sum, expense) => sum + expense.amountNAD, 0) || 0;
  const expensesByCategory = expenses?.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amountNAD;
    return acc;
  }, {} as Record<string, number>) || {};

  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category: category.replace(/_/g, ' ').toLowerCase(),
    amount,
  }));

  const expensesByCarId = expenses?.reduce((acc, expense) => {
    acc[expense.carId] = (acc[expense.carId] || 0) + expense.amountNAD;
    return acc;
  }, {} as Record<number, number>) || {};

  const carExpenseData = cars?.map(car => ({
    name: `${car.make} ${car.model}`,
    expenses: expensesByCarId[car.id!] || 0,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.firstName || 'User'}!</h1>
            <p className="text-primary-100">Here's what's happening with your vehicles</p>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl shadow-sm border border-primary-100"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Car className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cars</p>
              <p className="text-2xl font-bold text-gray-900">{cars?.length || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-accent-50 to-white p-6 rounded-xl shadow-sm border border-accent-100"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-accent-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">NAD {totalExpensesNAD.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-success-50 to-white p-6 rounded-xl shadow-sm border border-success-100"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-success-100 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Reminders</p>
              <p className="text-2xl font-bold text-gray-900">{reminders?.length || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-sm border border-purple-100"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{expenses?.length || 0}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Car</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carExpenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="expenses" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <RecentActivities />

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Link
          to="/add-car"
          className="group bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl shadow-sm border border-primary-100 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
              <Car className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add New Car</h3>
              <p className="text-sm text-gray-600">Register a new vehicle</p>
            </div>
          </div>
        </Link>

        <Link
          to="/add-expense"
          className="group bg-gradient-to-br from-accent-50 to-white p-6 rounded-xl shadow-sm border border-accent-100 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-accent-100 p-3 rounded-lg group-hover:bg-accent-200 transition-colors">
              <DollarSign className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Record Expense</h3>
              <p className="text-sm text-gray-600">Add new transaction</p>
            </div>
          </div>
        </Link>

        <Link
          to="/media"
          className="group bg-gradient-to-br from-success-50 to-white p-6 rounded-xl shadow-sm border border-success-100 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-success-100 p-3 rounded-lg group-hover:bg-success-200 transition-colors">
              <FileText className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Upload Media</h3>
              <p className="text-sm text-gray-600">Add photos or documents</p>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default Dashboard;