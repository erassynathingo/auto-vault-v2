import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Statistics = () => {
  const { currentUser } = useAuth();
  const expenses = useLiveQuery(() => db.expenses.where('userId').equals(currentUser?.id || 0).toArray());
  const cars = useLiveQuery(() => db.cars.where('userId').equals(currentUser?.id || 0).toArray());

  const expensesByCategory = expenses?.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>) || {};

  const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

  const expensesByCar = expenses?.reduce((acc, expense) => {
    acc[expense.carId] = (acc[expense.carId] || 0) + expense.amount;
    return acc;
  }, {} as Record<number, number>) || {};

  const carExpenseData = cars?.map(car => ({
    name: `${car.make} ${car.model}`,
    value: expensesByCar[car.id!] || 0
  })) || [];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-4">Statistics</h2>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Expenses by Car</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={carExpenseData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {carExpenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;