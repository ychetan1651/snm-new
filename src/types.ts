export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  grade: string;
  branch?: string;
  notes?: string;
}

export interface DaySchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  slots: TimeSlot[];
}

export interface Branch {
  id: string;
  name: string;
  color: string;
}