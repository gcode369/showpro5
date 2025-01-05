import { supabase } from '../supabase';
import type { VerificationRequest } from '../../types/verification';

export class VerificationService {
  async submitVerification(userId: string, documents: any[]) {
    const { data, error } = await supabase
      .from('agent_verification_requests')
      .insert({
        agent_id: userId,
        documents: documents,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getVerificationStatus(userId: string) {
    const { data, error } = await supabase
      .from('agent_verification_requests')
      .select('*')
      .eq('agent_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async uploadDocument(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `verification-docs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  }
}

export const verificationService = new VerificationService();