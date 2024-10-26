import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ReactPlayer from 'react-player';
import { Media } from '../../db';

interface MediaViewModalProps {
  media: Media | null;
  onClose: () => void;
}

const MediaViewModal: React.FC<MediaViewModalProps> = ({ media, onClose }) => {
  if (!media) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-7xl w-full bg-white rounded-lg overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative aspect-video">
            {media.type === 'image' ? (
              <img
                src={media.fileUrl}
                alt={media.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <ReactPlayer
                url={media.fileUrl}
                width="100%"
                height="100%"
                controls
                playing
              />
            )}
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">{media.title}</h2>
            {media.description && (
              <p className="mt-2 text-gray-600">{media.description}</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaViewModal;