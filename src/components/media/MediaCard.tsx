import React from 'react';
import { motion } from 'framer-motion';
import { Play, Image as ImageIcon, FileText, Calendar } from 'lucide-react';
import { Media } from '../../db';

interface MediaCardProps {
  media: Media;
  onClick: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {media.type === 'video' ? (
          <>
            <div
              className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
              style={{ backgroundImage: `url(${media.fileUrl}#t=0.1)` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
          </>
        ) : (
          <img
            src={media.fileUrl}
            alt={media.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 group-hover:from-black/80 transition-all duration-300" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform">
        <h3 className="text-lg font-semibold mb-1 truncate">{media.title}</h3>
        {media.description && (
          <p className="text-sm text-gray-200 line-clamp-2">{media.description}</p>
        )}
        <div className="flex items-center mt-2 text-xs text-gray-300">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(media.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <div className="px-2 py-1 bg-black/50 rounded-full backdrop-blur-sm">
          {media.type === 'image' ? (
            <ImageIcon className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MediaCard;