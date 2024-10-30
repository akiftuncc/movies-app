import { UpsertSessionDto } from 'proto-generated/manager_messages';
import { formatDate } from './functions';
import { TimeSlot } from '@prisma/client';

export type SessionBulkData = {
  date: string;
  timeSlot: TimeSlot;
  roomNumber: number;
};

export const sessionBulkDataCreator = (
  sessions: UpsertSessionDto[],
): SessionBulkData[] => {
  const data = sessions.flatMap((session) => {
    return session.dates.map((date) => {
      return date.timeSlots.map((time) => {
        return {
          date: formatDate(new Date(date.date), time as unknown as TimeSlot),
          timeSlot: time as unknown as TimeSlot,
          roomNumber: Number(session.roomNumber),
        };
      });
    });
  });
  return data.flat();
};
