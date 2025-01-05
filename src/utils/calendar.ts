export function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // Add padding days from previous month
  for (let i = 0; i < firstDay.getDay(); i++) {
    const prevDate = new Date(year, month, -i);
    days.unshift({ date: prevDate, isPadding: true });
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), isPadding: false });
  }

  // Add padding days for next month to complete the grid
  const remainingDays = 42 - days.length; // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ date: new Date(year, month + 1, i), isPadding: true });
  }

  return days;
}

export function formatTime(time: string): string {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit'
  });
}

export function isTimeSlotAvailable(slot: { 
  isBooked: boolean; 
  currentAttendees: number; 
  maxAttendees: number; 
}): boolean {
  return !slot.isBooked && slot.currentAttendees < slot.maxAttendees;
}

export function getDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}