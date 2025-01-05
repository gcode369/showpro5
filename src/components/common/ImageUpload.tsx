import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './Button';
import { useImageUpload } from '../../hooks/useImageUpload';

type ImageUploadProps = {
  imageUrl?: string;
  onImageChange: (url: string) => void;
  folder?: string;
  className?: string;
};

export function ImageUpload({ 
  imageUrl, 
  onImageChange, 
  folder = 'general',
  className = '' 
}: ImageUploadProps) {
  const { uploadImage, deleteImage, uploading, error } = useImageUpload(folder);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      if (imageUrl) {
        await deleteImage(imageUrl);
      }
      onImageChange(url);
    }
  };

  const handleRemoveImage = async () => {
    if (imageUrl) {
      const success = await deleteImage(imageUrl);
      if (success) {
        onImageChange('');
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 relative group">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        disabled={uploading}
      />

      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-nowrap"
      >
        {uploading ? 'Uploading...' : imageUrl ? 'Change Photo' : 'Add Photo'}
      </Button>
    </div>
  );
}