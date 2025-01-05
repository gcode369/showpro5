import { useState } from 'react';
import { supabase } from '../services/supabase';

export function useImageUpload(folder: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      setError(null);
      const filePath = url.split('/').pop();
      if (!filePath) return false;

      const { error: deleteError } = await supabase.storage
        .from('images')
        .remove([`${folder}/${filePath}`]);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
      return false;
    }
  };

  return { uploadImage, deleteImage, uploading, error };
}