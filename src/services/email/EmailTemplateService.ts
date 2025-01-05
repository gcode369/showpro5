import { supabase } from '../supabase';

export class EmailTemplateService {
  async getTemplate(name: string) {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', name)
      .single();

    if (error) throw error;
    return data;
  }

  async renderTemplate(template: string, variables: Record<string, any>) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
  }
}

export const emailTemplateService = new EmailTemplateService();