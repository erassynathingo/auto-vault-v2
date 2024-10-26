import React from 'react';
import { motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, FileText, Download } from 'lucide-react';
import { db } from '../db';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

interface DocumentListProps {
  carId: number;
}

const DocumentList: React.FC<DocumentListProps> = ({ carId }) => {
  const documents = useLiveQuery(() =>
    db.documents
      .where('carId')
      .equals(carId)
      .reverse()
      .toArray()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
        <Link to={`/documents/upload?carId=${carId}`}>
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Add Document
          </Button>
        </Link>
      </div>

      {documents?.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding important documents.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents?.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <FileText className="w-6 h-6 text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{doc.title}</h4>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                </div>
              </div>
              <a
                href={doc.fileUrl}
                download
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Download className="w-5 h-5" />
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;