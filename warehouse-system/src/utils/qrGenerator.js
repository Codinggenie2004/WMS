import QRCode from 'qrcode';

/**
 * Generate a QR code data URL from product data (synchronous).
 * Uses QRCode.create() for synchronous QR matrix generation,
 * then draws onto a canvas to produce a data URL.
 */
export const generateQRCode = (productData) => {
    const qrData = JSON.stringify({
        id: productData.id,
        name: productData.name,
        origin: productData.origin,
        destination: productData.destination
    });

    // Use the low-level QRCode.create() which is synchronous
    const qr = QRCode.create(qrData, { errorCorrectionLevel: 'M' });
    const modules = qr.modules;
    const moduleCount = modules.size;
    const cellSize = 6;
    const margin = 2 * cellSize;
    const size = moduleCount * cellSize + margin * 2;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw QR modules
    ctx.fillStyle = '#000000';
    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (modules.get(row, col)) {
                ctx.fillRect(
                    margin + col * cellSize,
                    margin + row * cellSize,
                    cellSize,
                    cellSize
                );
            }
        }
    }

    return canvas.toDataURL('image/png');
};

/**
 * Download the QR code for a product as a PNG file.
 */
export const downloadQR = async (product) => {
    try {
        let dataUrl;

        if (product.qrCode) {
            // Use existing QR code data URL
            dataUrl = product.qrCode;
        } else {
            // Generate one
            const qrData = JSON.stringify({
                id: product.productId,
                name: product.name,
                origin: product.origin,
                destination: product.destination
            });
            dataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 2 });
        }

        // Convert data URL to Blob for reliable download
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `QR_${product.name || product.productId}.png`;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Error downloading QR code:', error);
        throw error;
    }
};
