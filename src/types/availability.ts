export type TimeSlot = {
  start: string;
  end: string;
};

export type DayAvailability = {
  date: string;
  slots: TimeSlot[];
};

export type AgentAvailability = {
  agentId: string;
  schedule: DayAvailability[];
  defaultHours?: {
    start: string;
    end: string;
    daysOfWeek: number[]; // 0-6, where 0 is Sunday
  };
};