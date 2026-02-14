export const generateQRCode = (data) => {
  const qrData = encodeURIComponent(JSON.stringify(data));
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;
};

export const downloadQR = async (product) => {
  try {
    const response = await fetch(product.qrCode);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR_${product.name.replace(/\s+/g, '_')}_${product.slotId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading QR code:', error);
    throw error;
  }
};