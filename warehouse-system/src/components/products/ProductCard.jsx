import React from 'react';
import { QrCode, MapPin, Truck } from 'lucide-react';
import { downloadQR } from '../../utils/qrGenerator';

const ProductCard = ({ product, currentUser, onDelete, loading }) => {
  const handleDownload = async () => {
    try {
      await downloadQR(product);
    } catch (error) {
      alert('Failed to download QR code');
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Product Photo */}
        <div className="flex-shrink-0">
          <img
            src={product.photo}
            alt={product.name}
            className="w-full lg:w-40 h-48 lg:h-40 object-cover rounded-lg border-2 border-slate-700"
          />
        </div>

        {/* QR Code */}
        <div className="flex-shrink-0">
          <img
            src={product.qrCode}
            alt="QR Code"
            className="w-full sm:w-40 h-auto sm:h-40 bg-white p-2 rounded-lg mx-auto"
          />
          <button
            onClick={handleDownload}
            className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition flex items-center justify-center gap-1"
          >
            <QrCode className="w-4 h-4" />
            Download QR
          </button>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold mb-3 break-words">{product.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-400 mb-1">Description</p>
              <p className="text-slate-300 break-words">{product.description || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Quantity</p>
              <p className="text-green-400 font-medium">{product.quantity}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                Origin
              </p>
              <p className="text-blue-400 font-medium break-words">{product.origin}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">
                <Truck className="w-3 h-3 inline mr-1" />
                Destination
              </p>
              <p className="text-purple-400 font-medium break-words">{product.destination}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">📍 Slot Location</p>
              <p className="text-orange-400 font-medium">{product.slotId}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Added By</p>
              <p className="text-slate-300">{product.addedBy}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-slate-500 text-xs">
                Added: {new Date(product.dateAdded).toLocaleString()}
              </p>
            </div>
          </div>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => onDelete(product.productId)}
              className="mt-4 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Remove Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;