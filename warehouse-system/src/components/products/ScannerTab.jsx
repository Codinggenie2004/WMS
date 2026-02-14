import React, { useState } from 'react';
import { Camera, Package, MapPin, Truck, Calendar, User } from 'lucide-react';
import QRScanner from './QRScanner';
import { api } from '../../utils/api';

const ScannerTab = ({ products, currentUser, loading, setLoading }) => {
    const [showScanner, setShowScanner] = useState(false);
    const [scannedProduct, setScannedProduct] = useState(null);

    const handleQRScan = async (data) => {
        console.log('Scanned QR data:', data);
        setLoading(true);

        try {
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
            } else {
                alert(`Product not found!\n\nScanned ID: ${productId}\n\nThis product may have been removed.`);
                setShowScanner(false);
            }
        } catch (error) {
            console.error('Error searching product:', error);
            alert('Error searching for product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Scanner Button */}
            <div className="bg-slate-800 rounded-lg p-6 sm:p-8 border border-slate-700 text-center">
                <Camera className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400 mx-auto mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Scan Product QR Code</h2>
                <p className="text-slate-400 mb-6 text-sm sm:text-base">
                    Point your camera at a product QR code to view details
                </p>
                <button
                    onClick={() => setShowScanner(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition flex items-center justify-center gap-2 text-base sm:text-lg font-medium mx-auto"
                >
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                    Start QR Scanner
                </button>
            </div>

            {/* Scanned Product Details */}
            {scannedProduct && (
                <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-green-400 flex items-center gap-2">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                            Product Found!
                        </h3>
                        <button
                            onClick={() => setScannedProduct(null)}
                            className="text-slate-400 hover:text-white text-sm"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Product Photo */}
                        <div>
                            <img
                                src={scannedProduct.photo}
                                alt={scannedProduct.name}
                                className="w-full aspect-video object-cover rounded-lg border-2 border-slate-700"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-1">{scannedProduct.name}</h4>
                                <p className="text-slate-400 text-sm">{scannedProduct.description || 'No description'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-slate-900 rounded-lg p-3">
                                    <p className="text-slate-400 mb-1">Quantity</p>
                                    <p className="text-green-400 font-bold text-lg">{scannedProduct.quantity}</p>
                                </div>

                                <div className="bg-slate-900 rounded-lg p-3">
                                    <p className="text-slate-400 mb-1">📍 Slot Location</p>
                                    <p className="text-orange-400 font-bold text-lg">{scannedProduct.slotId}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    <span className="text-slate-400">Origin:</span>
                                    <span className="text-blue-400 font-medium">{scannedProduct.origin}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Truck className="w-4 h-4 text-purple-400" />
                                    <span className="text-slate-400">Destination:</span>
                                    <span className="text-purple-400 font-medium">{scannedProduct.destination}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-400">Added by:</span>
                                    <span className="text-slate-300">{scannedProduct.addedBy}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-400">Date:</span>
                                    <span className="text-slate-300">{new Date(scannedProduct.dateAdded).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowScanner(true)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition text-sm"
                            >
                                Scan Another
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h4 className="font-medium mb-2 text-sm sm:text-base">How to use:</h4>
                <ul className="text-slate-400 text-xs sm:text-sm space-y-1">
                    <li>1. Click "Start QR Scanner" button</li>
                    <li>2. Allow camera access when prompted</li>
                    <li>3. Point camera at product QR code</li>
                    <li>4. Product details will appear automatically</li>
                    <li>5. Or enter Product ID manually if camera fails</li>
                </ul>
            </div>

            {/* QR Scanner Modal */}
            {showScanner && (
                <QRScanner
                    onScan={handleQRScan}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
};

export default ScannerTab;