import React, { useState } from 'react';
import { Camera, X, Edit2, ExternalLink } from 'lucide-react';
import { Button } from '../../common/Button';

type PropertyImagesProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

export function PropertyImages({ images, onChange }: PropertyImagesProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editUrl, setEditUrl] = useState('');

  const handleAddImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      onChange([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    setEditUrl(images[index]);
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (editingIndex !== null && editUrl.trim()) {
      const updatedImages = [...images];
      updatedImages[editingIndex] = editUrl.trim();
      onChange(updatedImages);
      setEditingIndex(null);
      setEditUrl('');
    }
  };

  const handlePreviewImage = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Property Images</h3>
      
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button 
          onClick={handleAddImage}
          disabled={!newImageUrl.trim()}
        >
          <Camera className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            {editingIndex === index ? (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <Button onClick={handleSaveEdit} disabled={!editUrl.trim()}>
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingIndex(null)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-4 space-y-2">
                <div className="relative aspect-video">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handlePreviewImage(image)}
                      className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                      title="Preview image"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditImage(index)}
                      className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                      title="Edit URL"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                      title="Remove image"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500 truncate" title={image}>
                  {image}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}