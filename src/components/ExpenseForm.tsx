import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Expense } from '../db';
import { useAuth } from '../contexts/AuthContext';

const ExpenseForm = () => {
  const { currentUser } = useAuth();
  const cars = useLiveQuery(() => db.cars.where('userId').equals(currentUser?.id || 0).toArray());
  const [expense, setExpense] = useState<Omit<Expense, 'id' | 'userId'>>({
    carId: 0,
    amount: 0,
    date: new Date(),
    category: 'purchase',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const expenseId = await db.expenses.add({ ...expense, userId: currentUser.id! });
      
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            await db.documents.add({
              userId: currentUser.id!,
              expenseId,
              type: 'invoice',
              fileUrl: event.target.result as string,
            });
          }
        };
        reader.readAsDataURL(file);
      }

      setExpense({
        carId: 0,
        amount: 0,
        date: new Date(),
        category: 'purchase',
        description: '',
      });
      setFile(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Add Expense</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block mb-1">Car</label>
          <select
            value={expense.carId}
            onChange={(e) => setExpense({ ...expense, carId: parseInt(e.target.value) })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select a car</option>
            {cars?.map((car) => (
              <option key={car.id} value={car.id}>
                {car.make} {car.model} ({car.year})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            value={expense.amount}
            onChange={(e) => setExpense({ ...expense, amount: parseFloat(e.target.value) })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            value={expense.date.toISOString().split('T')[0]}
            onChange={(e) => setExpense({ ...expense, date: new Date(e.target.value) })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <select
            value={expense.category}
            onChange={(e) => setExpense({ ...expense, category: e.target.value as Expense['category'] })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="purchase">Purchase</option>
            <option value="repair">Repair</option>
            <option value="paypal">PayPal</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={expense.description}
            onChange={(e) => setExpense({ ...expense, description: e.target.value })}
            className="w-full border p-2 rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">Upload Invoice/Receipt</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded"
            accept="image/*,application/pdf"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;