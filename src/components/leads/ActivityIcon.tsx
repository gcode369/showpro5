import { Clock, Home, User, Calendar, Phone } from 'lucide-react';
import type { ActivityType } from '../../types/lead';

type ActivityIconProps = {
  type: ActivityType;
  className?: string;
};

export function ActivityIcon({ type, className = '' }: ActivityIconProps) {
  const Icon = getActivityIcon(type);
  return <Icon className={className} />;
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case 'property_view':
      return Home;
    case 'booking_request':
      return Clock;
    case 'open_house_registration':
      return Calendar;
    case 'contact_agent':
      return Phone;
    default:
      return User;
  }
}