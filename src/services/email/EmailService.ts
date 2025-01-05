import { emailTemplateService } from './EmailTemplateService';
import { supabase } from '../supabase';

export class EmailService {
  async sendEmail(to: string, templateName: string, variables: Record<string, any>) {
    try {
      const template = await emailTemplateService.getTemplate(templateName);
      const html = await emailTemplateService.renderTemplate(template.html_content, variables);
      const text = await emailTemplateService.renderTemplate(template.text_content, variables);

      const { error } = await supabase.functions.invoke('send-email', {
        body: { to, subject: template.subject, html, text }
      });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to send email:', err);
      throw err;
    }
  }
}

export const emailService = new EmailService();