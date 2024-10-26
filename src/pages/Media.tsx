import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, Video, Upload, X, Plus, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../db';
import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useLiveQuery } from 'dexie-react-hooks';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import MediaGrid from '../components/media/MediaGrid';
import MediaUploadModal from '../components/media/MediaUploadModal';
import toast from 'react-hot-toast';

const Media = () => {
  const { currentUser } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    carId: '',
    type: '',
    search: '',
  });

  const cars = useLiveQuery(() =>
    db.cars.where('userId').equals(currentUser?.id || 0).toArray()
  );

  const media = useLiveQuery(() => {
    let query = db.media.where('userId').equals(currentUser?.id || 0);

    if (filters.carId) {
      query = query.filter(item => item.carId === parseInt(filters.carId));
    }
    if (filters.type) {
      query = query.filter(item => item.type === filters.type);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      query = query.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    }

    return query.reverse().toArray();
  }, [filters]);

  const handleUploadComplete = () => {
    setIsUploadModalOpen(false);
    toast.success('Media uploaded successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Gallery</h1>
          <p className="text-gray-600 mt-1">Manage your vehicle photos and videos</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Media
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
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
          <div className="flex-1 min-w-[200px]">
            <Select
              options={[
                { value: '', label: 'All Types' },
                { value: 'image', label: 'Images' },
                { value: 'video', label: 'Videos' },
              ]}
              value={filters.type ? { value: filters.type, label: filters.type === 'image' ? 'Images' : 'Videos' } : null}
              onChange={(selected) => setFilters(prev => ({ ...prev, type: selected.value }))}
              placeholder="Select type"
            />
          </div>
          <div className="flex-[2] min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search media..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        <MediaGrid media={media || []} />
      </div>

      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        cars={cars || []}
      />
    </div>
  );
};

export default Media;