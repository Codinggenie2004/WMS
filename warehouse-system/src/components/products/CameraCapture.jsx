import React, { useRef } from 'react';
import { Camera, Package } from 'lucide-react';

const CameraCapture = ({
  productPhoto,
  showCamera,
  videoRef,
  onStartCamera,
  onStopCamera,
  onCapture,
  onFileUpload,
  onRemovePhoto,
  loading
}) => {
  const canvasRef = useRef(null);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Verify video is actually playing and has data
      if (video.readyState < video.HAVE_CURRENT_DATA) {
        alert('⏳ Camera not ready yet. Please wait a moment and try again.');
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (canvas.width === 0 || canvas.height === 0) {
        alert('❌ Camera feed not initialized properly.\n\nPlease click "Cancel" and try "Capture Photo" again.');
        return;
      }

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const photoData = canvas.toDataURL('image/jpeg', 0.85);

      console.log('✅ Photo captured:', canvas.width + 'x' + canvas.height);
      onCapture(photoData, videoRef);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">
        <Camera className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
        Product Photo *
      </label>

      {!productPhoto && !showCamera && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={onStartCamera}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 sm:py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
            disabled={loading}
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            Capture Photo
          </button>
          <label className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base">
            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            Upload Photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFileUpload}
              className="hidden"
              disabled={loading}
            />
          </label>
        </div>
      )}

      {showCamera && (
        <div className="space-y-2">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full aspect-video rounded-lg border-2 border-slate-700 bg-black"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCapture}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 sm:py-2.5 rounded-lg transition text-sm"
            >
              Capture
            </button>
            <button
              type="button"
              onClick={onStopCamera}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 sm:py-2.5 rounded-lg transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {productPhoto && (
        <div className="space-y-2">
          <img
            src={productPhoto}
            alt="Product"
            className="w-full aspect-video object-cover rounded-lg border-2 border-green-500"
          />
          <button
            type="button"
            onClick={onRemovePhoto}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 sm:py-2.5 rounded-lg transition text-sm"
            disabled={loading}
          >
            Remove Photo
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;