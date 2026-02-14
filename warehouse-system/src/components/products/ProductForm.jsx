import React, { useState, useRef, useEffect } from 'react';
import { Package, QrCode, MapPin, Truck } from 'lucide-react';
import CameraCapture from './CameraCapture';
import { api, API_URL } from '../../utils/api';
import { generateQRCode } from '../../utils/qrGenerator';

const ProductForm = ({ currentUser, onProductAdded, loading, setLoading }) => {
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productQty, setProductQty] = useState(1);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [productPhoto, setProductPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraInitializing, setCameraInitializing] = useState(false);
  const streamRef = useRef(null);
  const videoRef = useRef(null);

  // Custom allocation
  const [customAllocation, setCustomAllocation] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (customAllocation && currentUser.role === 'admin') {
      fetchEmptySlots();
    }
  }, [customAllocation]);

  // Initialize camera when showCamera becomes true
  useEffect(() => {
    if (showCamera && !cameraInitializing && videoRef.current) {
      initializeCamera();
    }
  }, [showCamera]);

  const fetchEmptySlots = async () => {
    try {
      const slots = await api.getSlots();
      const emptySlots = slots.filter(s => s.isEmpty).sort((a, b) =>
        a.slotId.localeCompare(b.slotId, undefined, { numeric: true })
      );
      setAvailableSlots(emptySlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleStartCamera = () => {
    setShowCamera(true);
  };

  const initializeCamera = async () => {
    setCameraInitializing(true);
    try {
      // Try environment (back) camera first
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
        console.log('✅ Back camera accessed successfully');
      } catch (err) {
        console.warn('⚠️ Environment camera not available, trying default:', err);
        // Fallback to any available camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        console.log('✅ Default camera accessed successfully');
      }

      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for video to be ready
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Video loading timeout'));
          }, 5000);

          videoRef.current.onloadedmetadata = () => {
            clearTimeout(timeout);
            videoRef.current.play().then(() => {
              console.log('✅ Video stream started');
              resolve();
            }).catch(reject);
          };
        });
      } else {
        throw new Error('Failed to get camera stream');
      }
    } catch (err) {
      console.error('❌ Error accessing camera:', err);
      let errorMessage = 'Unable to access camera.\n\n';

      if (err.name === 'NotAllowedError') {
        errorMessage += '🔒 Camera permission denied.\n\nPlease:\n1. Click the camera icon in your browser address bar\n2. Allow camera access\n3. Refresh the page and try again';
      } else if (err.name === 'NotFoundError') {
        errorMessage += '📷 No camera found on this device.\n\nPlease use the "Upload Photo" option instead.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += '⚠️ Camera is already in use.\n\nPlease close other apps using the camera and try again.';
      } else if (err.name === 'SecurityError') {
        errorMessage += '🔐 Camera access blocked by security settings.\n\nMake sure you\'re using HTTPS (https://...) to access this page.';
      } else {
        errorMessage += '❌ ' + (err.message || 'Unknown error occurred.') + '\n\nPlease check permissions and try again.';
      }

      alert(errorMessage);
      setShowCamera(false);
    } finally {
      setCameraInitializing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleCapture = (photoData) => {
    setProductPhoto(photoData);
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!productName.trim()) {
      alert('Please enter product name');
      return;
    }
    if (!origin.trim() || !destination.trim()) {
      alert('Please enter origin and destination');
      return;
    }
    if (!productPhoto) {
      alert('Please capture or upload a product photo');
      return;
    }
    if (customAllocation && !selectedSlot) {
      alert('Please select a slot for custom allocation');
      return;
    }

    setLoading(true);

    try {
      const productId = Date.now().toString();
      const qrCode = generateQRCode({
        id: productId,
        name: productName,
        origin: origin,
        destination: destination
      });

      const endpoint = customAllocation ? 'allocate-custom' : 'auto-store';
      const payload = {
        productId: productId,
        name: productName,
        description: productDesc,
        quantity: productQty,
        origin: origin,
        destination: destination,
        photo: productPhoto,
        qrCode: qrCode,
        addedBy: currentUser.name,
        ...(customAllocation && { slotId: selectedSlot })
      };

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Product added successfully!\nAssigned to slot: ${data.slotAssigned}`);

        // Reset form
        setProductName('');
        setProductDesc('');
        setProductQty(1);
        setOrigin('');
        setDestination('');
        setProductPhoto(null);
        setSelectedSlot('');
        setCustomAllocation(false);

        onProductAdded();
      } else {
        alert(data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="bg-slate-800 rounded-lg p-3 sm:p-6 border border-slate-700">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="truncate">Add New Product</span>
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter product name"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">
              Description
            </label>
            <textarea
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter description"
              rows="2"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">
              Quantity *
            </label>
            <input
              type="number"
              value={productQty}
              onChange={(e) => setProductQty(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              min="1"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Origin *
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter origin location"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">
              <Truck className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Destination *
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter destination location"
              disabled={loading}
            />
          </div>

          {/* Custom Allocation - Admin Only */}
          {currentUser.role === 'admin' && (
            <div className="border-t border-slate-700 pt-3 sm:pt-4">
              <label className="flex items-center gap-2 cursor-pointer mb-2 sm:mb-3">
                <input
                  type="checkbox"
                  checked={customAllocation}
                  onChange={(e) => setCustomAllocation(e.target.checked)}
                  className="w-4 h-4"
                  disabled={loading}
                />
                <span className="text-xs sm:text-sm font-medium text-slate-300">
                  Custom Slot Allocation
                </span>
              </label>

              {customAllocation && (
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">-- Select Slot --</option>
                  {availableSlots.map(slot => (
                    <option key={slot._id} value={slot.slotId}>
                      {slot.slotId} ({slot.area})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        <CameraCapture
          productPhoto={productPhoto}
          showCamera={showCamera}
          videoRef={videoRef}
          onStartCamera={handleStartCamera}
          onStopCamera={stopCamera}
          onCapture={handleCapture}
          onFileUpload={handleFileUpload}
          onRemovePhoto={() => setProductPhoto(null)}
          loading={loading}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-4 sm:mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        disabled={loading}
      >
        <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
        {loading ? 'Adding...' : customAllocation ? 'Allocate to Slot' : 'Add Product'}
      </button>
    </div>
  );
};

export default ProductForm;