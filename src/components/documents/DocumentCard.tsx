import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, ExternalLink } from 'lucide-react';
import { Document } from '../../db';

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {document.title}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{document.type}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href={document.fileUrl}
              download
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            >
              <Download className="w-5 h-5" />
            </motion.a>
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(document.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Added to {document.type === 'invoice' ? 'expense records' : 'documentation'}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard;