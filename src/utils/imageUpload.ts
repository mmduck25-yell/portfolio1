/**
 * Utility for reading and compressing local image files into Base64 Data URLs
 * Optimized for local webtoon storyboard cuts, photos, and project previews
 * to stay safely within browser storage limits.
 */

export function compressAndReadFile(file: File, maxWidth = 1600, quality = 0.84): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw with smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function readMultipleImages(fileList: FileList | File[]): Promise<string[]> {
  const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
  const promises = files.map((file) => compressAndReadFile(file));
  return Promise.all(promises);
}
