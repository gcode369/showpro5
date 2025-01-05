import React from 'react';
import { ActivityIcon } from './ActivityIcon';
import { formatActivityType, formatDateTime } from '../../utils/formatters';
import type { LeadActivity } from '../../types/lead';

type ActivityItemProps = {
  activity: LeadActivity;
};

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-blue-50 p-2 rounded-lg">
        <ActivityIcon type={activity.activity_type} className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <div className="font-medium">
          {formatActivityType(activity.activity_type)}
        </div>
        <div className="text-sm text-gray-600">
          {formatDateTime(activity.created_at)}
        </div>
        {activity.metadata && (
          <div className="mt-1 text-sm text-gray-600">
            {JSON.stringify(activity.metadata, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
}