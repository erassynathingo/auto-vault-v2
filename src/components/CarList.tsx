import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Car } from '../db';
import { useAuth } from '../contexts/AuthContext';

const CarList = () => {
  const { currentUser } = useAuth();
  const cars = useLiveQuery(() => db.cars.where('userId').equals(currentUser?.id || 0).toArray());
  const [newCar, setNewCar] = useState<Omit<Car, 'id' | 'userId'>>({ make: '', model: '', year: 0 });

  const addCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      await db.cars.add({ ...newCar, userId: currentUser.id! });
      setNewCar({ make: '', model: '', year: 0 });
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Cars</h2>
      <form onSubmit={addCar} className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Make"
            value={newCar.make}
            onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Model"
            value={newCar.model}
            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={newCar.year || ''}
            onChange={(e) => setNewCar({ ...newCar, year: parseInt(e.target.value) })}
            className="border p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Car
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars?.map((car) => (
          <div key={car.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{car.make} {car.model}</h3>
            <p className="text-gray-600">Year: {car.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;