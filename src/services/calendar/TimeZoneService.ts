import { DateTime } from 'luxon';

export class TimeZoneService {
  convertToUserTimeZone(date: string, time: string, fromZone: string, toZone: string) {
    const dt = DateTime.fromFormat(`${date} ${time}`, 'yyyy-MM-dd HH:mm', { zone: fromZone });
    return dt.setZone(toZone);
  }

  getAvailableTimeSlots(slots: any[], userTimeZone: string) {
    return slots.map(slot => ({
      ...slot,
      startTime: this.convertToUserTimeZone(
        slot.date,
        slot.startTime,
        slot.timeZone,
        userTimeZone
      ).toFormat('HH:mm'),
      endTime: this.convertToUserTimeZone(
        slot.date,
        slot.endTime,
        slot.timeZone,
        userTimeZone
      ).toFormat('HH:mm')
    }));
  }
}