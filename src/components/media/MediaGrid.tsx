import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Masonry from 'react-masonry-css';
import { Media } from '../../db';
import MediaCard from './MediaCard';
import MediaViewModal from './MediaViewModal';

interface MediaGridProps {
  media: Media[];
}

const MediaGrid: React.FC<MediaGridProps> = ({ media }) => {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1,
  };

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {media.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No media found</p>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex -ml-4 w-auto"
            columnClassName="pl-4 bg-clip-padding"
          >
            {media.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4"
              >
                <MediaCard
                  media={item}
                  onClick={() => setSelectedMedia(item)}
                />
              </motion.div>
            ))}
          </Masonry>
        )}
      </motion.div>

      <MediaViewModal
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </>
  );
};

export default MediaGrid;