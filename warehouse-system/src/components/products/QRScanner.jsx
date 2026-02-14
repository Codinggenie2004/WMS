import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Search } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [scannerInitializing, setScannerInitializing] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');
  const [cameraId, setCameraId] = useState('');
  const [cameras, setCameras] = useState([]);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Get available cameras
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          setCameras(devices);
          // Prefer back camera on mobile
          const backCamera = devices.find(device =>
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('rear')
          );
          setCameraId(backCamera ? backCamera.id : devices[0].id);
        }
      })
      .catch(err => {
        console.error('Error getting cameras:', err);
        setError('Unable to access cameras');
      });

    return () => {
      stopScanning();
    };
  }, []);

  // Initialize scanner when scanning becomes true
  useEffect(() => {
    if (scanning && !scannerInitializing) {
      initializeScanner();
    }
  }, [scanning]);

  const handleStartScanning = () => {
    if (!cameraId) {
      setError('No camera available. Please check your device.');
      return;
    }
    setError('');
    setScanning(true);
  };

  const initializeScanner = async () => {
    setScannerInitializing(true);
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
          // QR code successfully scanned
          console.log('✅ QR Code detected:', decodedText);
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Scanning error (this is normal, happens when no QR in view)
        }
      );

      console.log('✅ QR Scanner started successfully');
    } catch (err) {
      console.error('❌ Error starting QR scanner:', err);

      let errorMessage = 'Failed to start camera.\n\n';

      if (err.name === 'NotAllowedError') {
        errorMessage += '🔒 Camera permission denied.\n\nPlease:\n1. Click the camera/lock icon in your browser address bar\n2. Allow camera access for this site\n3. Refresh the page and try again';
      } else if (err.name === 'NotFoundError') {
        errorMessage += '📷 No camera found.\n\nPlease check that your device has a camera.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += '⚠️ Camera is in use by another application.\n\nPlease close other apps and try again.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage += '⚙️ Camera constraints not supported.\n\nTrying to use a different camera...';
        // Try with a different camera if available
        if (cameras.length > 1) {
          const nextCamera = cameras.find(c => c.id !== cameraId);
          if (nextCamera) {
            setCameraId(nextCamera.id);
            setScanning(false);
            setTimeout(() => setScanning(true), 500);
            return;
          }
        }
      } else {
        errorMessage += '❌ ' + (err.message || 'Unknown error.\n\nPlease check camera permissions and try again.');
      }

      setError(errorMessage);
      setScanning(false);
    } finally {
      setScannerInitializing(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setScanning(false);
  };

  const handleScanSuccess = (decodedText) => {
    try {
      // Try to parse as JSON first
      const data = JSON.parse(decodedText);
      stopScanning();
      onScan(data);
    } catch (error) {
      // If not JSON, treat as plain text (product ID)
      stopScanning();
      onScan({ id: decodedText });
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      try {
        const data = JSON.parse(manualInput);
        onScan(data);
      } catch (error) {
        // If not JSON, treat as product ID
        onScan({ id: manualInput });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg p-4 sm:p-6 max-w-md w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
            Scan QR Code
          </h3>
          <button
            onClick={() => {
              stopScanning();
              onClose();
            }}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-3 py-2 rounded-lg text-sm mb-4 whitespace-pre-line">
            {error}
          </div>
        )}

        {/* Camera Scanner */}
        <div className="space-y-4">
          {!scanning ? (
            <div className="space-y-3">
              {/* Camera Selection */}
              {cameras.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select Camera
                  </label>
                  <select
                    value={cameraId}
                    onChange={(e) => setCameraId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
                  >
                    {cameras.map(camera => (
                      <option key={camera.id} value={camera.id}>
                        {camera.label || `Camera ${camera.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleStartScanning}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
                disabled={!cameraId}
              >
                <Camera className="w-5 h-5" />
                Start Camera Scan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div id="qr-reader" className="rounded-lg overflow-hidden border-2 border-blue-500"></div>
              <button
                onClick={stopScanning}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition"
              >
                Stop Scanning
              </button>
              <p className="text-center text-slate-400 text-sm">
                Point your camera at a QR code
              </p>
            </div>
          )}

          {/* Manual Input Fallback */}
          {!scanning && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-slate-800 text-slate-400">OR</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Manual Entry
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
                    placeholder="Enter Product ID or QR data"
                    onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
                  />
                  <button
                    onClick={handleManualSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 text-xs text-slate-500 space-y-1">
          <p>• Point camera at QR code to scan automatically</p>
          <p>• Or enter Product ID manually</p>
          <p>• Make sure the QR code is well-lit and in focus</p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;