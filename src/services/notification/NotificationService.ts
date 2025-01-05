import { supabase } from '../supabase';
import type { Notification } from '../../types/notification';

export class NotificationService {
  async createNotification(userId: string, data: {
    type: Notification['type'];
    title: string;
    message?: string;
  }) {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: data.type,
        title: data.title,
        message: data.message
      })
      .select()
      .single();

    if (error) throw error;
    return notification;
  }

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  }
}

export const notificationService = new NotificationService();