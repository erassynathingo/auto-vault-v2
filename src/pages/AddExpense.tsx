import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Upload, Calendar, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db, ExpenseCategory } from '../db';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import FileUpload from '../components/ui/FileUpload';
import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { useLiveQuery } from 'dexie-react-hooks';

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'PAYMENT_PAYPAL', label: 'Payment (PayPal)' },
  { value: 'PAYMENT_BANK', label: 'Payment (Bank)' },
  { value: 'VAT_PAYMENT', label: 'VAT Payment' },
  { value: 'ADD_MEDIA', label: 'Add Media' },
  { value: 'YARD_STORAGE_NAM', label: 'Yard Storage (NAM)' },
  { value: 'YARD_STORAGE_JAPAN', label: 'Yard Storage (Japan)' },
  { value: 'POLICE_CLEARANCE', label: 'Police Clearance' },
  { value: 'DISC_PAYMENT', label: 'Disc Payment' },
  { value: 'DISC_RENEWAL', label: 'Disc Renewal' },
  { value: 'FOB_PAYMENT', label: 'FOB Payment' },
  { value: 'FREIGHT_PAYMENT', label: 'Freight Payment' },
  { value: 'BODY_WORKS', label: 'Body Works' },
  { value: 'MECHANICAL_WORKS', label: 'Mechanical Works' },
  { value: 'OTHER', label: 'Other' },
];

const AddExpense = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const cars = useLiveQuery(() =>
    db.cars.where('userId').equals(currentUser?.id || 0).toArray()
  );

  const [formData, setFormData] = useState({
    carId: '',
    amountNAD: '',
    amountJPY: '',
    date: new Date().toISOString().split('T')[0],
    category: '' as ExpenseCategory,
    description: '',
  });

  const handleFileSelect = (file: File) => {
    setFiles(prev => [...prev, file]);
  };

  const handleFileRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmitting(true);

    try {
      // Upload files first
      const fileUrls = await Promise.all(
        files.map(async (file) => {
          const storageRef = ref(storage, `expenses/${currentUser.id}/${Date.now()}_${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          return new Promise<string>((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(prev => ({
                  ...prev,
                  [file.name]: progress,
                }));
              },
              reject,
              async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              }
            );
          });
        })
      );

      // Add expense
      const expenseId = await db.expenses.add({
        userId: currentUser.id!,
        carId: parseInt(formData.carId),
        amountNAD: parseFloat(formData.amountNAD),
        amountJPY: formData.amountJPY ? parseFloat(formData.amountJPY) : undefined,
        date: new Date(formData.date),
        category: formData.category,
        description: formData.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add documents
      await Promise.all(
        fileUrls.map((url) =>
          db.documents.add({
            userId: currentUser.id!,
            carId: parseInt(formData.carId),
            expenseId,
            title: 'Expense Document',
            type: 'invoice',
            fileUrl: url,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        )
      );

      toast.success('Expense added successfully!');
      navigate('/expenses');
    } catch (error) {
      toast.error('Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
            <p className="text-gray-600 mt-1">Record a new expense or transaction</p>
          </div>
          <DollarSign className="h-8 w-8 text-primary-600" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Car</label>
              <Select
                options={cars?.map(car => ({
                  value: car.id!.toString(),
                  label: `${car.make} ${car.model} (${car.year})`,
                })) || []}
                value={formData.carId ? { value: formData.carId, label: cars?.find(c => c.id === parseInt(formData.carId))?.make || '' } : null}
                onChange={(selected) => setFormData(prev => ({ ...prev, carId: selected.value }))}
                placeholder="Select car"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select
                options={EXPENSE_CATEGORIES}
                value={formData.category ? EXPENSE_CATEGORIES.find(c => c.value === formData.category) || null : null}
                onChange={(selected) => setFormData(prev => ({ ...prev, category: selected.value as ExpenseCategory }))}
                placeholder="Select category"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (NAD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={formData.amountNAD}
                  onChange={(e) => setFormData(prev => ({ ...prev, amountNAD: e.target.value }))}
                  className="pl-7 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (JPY)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">¥</span>
                </div>
                <input
                  type="number"
                  value={formData.amountJPY}
                  onChange={(e) => setFormData(prev => ({ ...prev, amountJPY: e.target.value }))}
                  className="pl-7 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
            <div className="space-y-4">
              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={() => setFiles([])}
                accept={{ 'image/*': [], 'application/pdf': [] }}
                maxSize={5242880}
              />
              
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                    </div>
                  </div>
                  {uploadProgress[file.name] > 0 && uploadProgress[file.name] < 100 && (
                    <div className="w-24">
                      <div className="bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleFileRemove(index)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Remove</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/expenses')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Add Expense
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;