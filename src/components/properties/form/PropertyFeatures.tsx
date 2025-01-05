import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../../common/Button';

type PropertyFeaturesProps = {
  features: string[];
  onChange: (features: string[]) => void;
};

export function PropertyFeatures({ features, onChange }: PropertyFeaturesProps) {
  const [newFeature, setNewFeature] = useState('');

  const handleAddFeature = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newFeature.trim()) {
      onChange([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Property Features</h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Add a feature (e.g., Hardwood floors)"
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button 
          onClick={handleAddFeature} 
          disabled={!newFeature.trim()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm"
          >
            {feature}
            <button
              type="button"
              onClick={() => handleRemoveFeature(index)}
              className="text-blue-500 hover:text-blue-700"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}