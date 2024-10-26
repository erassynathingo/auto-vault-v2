import React from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2 } from 'lucide-react';
import Button from '../ui/Button';
import { Car } from '../../db';

interface QRCodeGeneratorProps {
  car: Car;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ car }) => {
  const carData = {
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    chassisNumber: car.chassisNumber,
  };

  const qrValue = JSON.stringify(carData);

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${car.make}-${car.model}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${car.make} ${car.model}`,
        text: `Vehicle Information QR Code`,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access QR Code</h3>
      
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-white rounded-lg shadow-sm"
        >
          <QRCodeSVG
            value={qrValue}
            size={200}
            level="H"
            includeMargin
            imageSettings={{
              src: "/logo.png",
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
        </motion.div>

        <p className="text-sm text-gray-600 text-center">
          Scan this QR code to quickly access vehicle information
        </p>

        <div className="flex space-x-4">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;