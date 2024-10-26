import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Plus, Image as ImageIcon } from 'lucide-react';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

interface MediaGridProps {
  carId: number;
}

const MediaGrid: React.FC<MediaGridProps> = ({ carId }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const media = useLiveQuery(() =>
    db.media
      .where('carId')
      .equals(carId)
      .reverse()
      .toArray()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Media Gallery</h3>
        <Link to={`/media/upload?carId=${carId}`}>
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Add Media
          </Button>
        </Link>
      </div>

      {media?.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No media</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding photos or videos.
          </p>
        </div>
      ) : (
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {media?.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              {item.type === 'image' ? (
                <img
                  src={item.fileUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.fileUrl}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
                  <p className="text-white text-sm font-medium">{item.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGrid;