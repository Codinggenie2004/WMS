import React, { useState } from 'react';
import { Search, Package, Camera } from 'lucide-react';
import ProductCard from './ProductCard';
import QRScanner from './QRScanner';
import { api } from '../../utils/api';

const ProductList = ({ products, currentUser, onRefresh, loading, setLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);

  const filteredProducts = scannedProduct
    ? [scannedProduct]
    : products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.slotId && p.slotId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleQRScan = async (data) => {
    console.log('Scanned QR data:', data);
    setLoading(true);

    try {
      // Extract product ID from scanned data
      const productId = data.id || data.productId;

      if (!productId) {
        alert('Invalid QR code. No product ID found.');
        setLoading(false);
        return;
      }

      const response = await api.searchProduct({ productId });
      const productData = await response.json();

      if (response.ok) {
        setScannedProduct(productData);
        setShowScanner(false);

        // Show success message
        alert(`Product Found!\n\nName: ${productData.name}\nLocation: ${productData.slotId}\nOrigin: ${productData.origin}\nDestination: ${productData.destination}`);
      } else {
        alert(`Product not found!\n\nScanned ID: ${productId}\n\nThis product may have been removed or the QR code is invalid.`);
        setShowScanner(false);
      }
    } catch (error) {
      console.error('Error searching product:', error);
      alert('Error searching for product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this product?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.deleteProduct(productId);

      if (response.ok) {
        alert('Product removed successfully!');
        setScannedProduct(null);
        onRefresh();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to remove product');
      }
    } catch (error) {
      console.error('Error removing product:', error);
      alert('Error removing product');
    } finally {
      setLoading(false);
    }
  };

  const handleClearScan = () => {
    setScannedProduct(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-700">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Search products..."
            />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No products found</p>
          {scannedProduct === null && searchQuery && (
            <p className="text-slate-500 text-sm mt-2">Try a different search term</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              currentUser={currentUser}
              onDelete={handleDelete}
              loading={loading}
            />
          ))}
        </div>
      )}

      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default ProductList;