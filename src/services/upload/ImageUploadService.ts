```typescript
import { supabase } from '../supabase';

export class ImageUploadService {
  private readonly BUCKET_NAME = 'images';
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  async uploadImage(file: File, folder: string): Promise<string> {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrl;
  }

  async deleteImage(url: string): Promise<void> {
    const path = url.split('/').pop();
    if (!path) return;

    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([path]);

    if (error) throw error;
  }
}
```