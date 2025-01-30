export interface Branch {
  id: string;
  name: string;
  color: string;
}

export interface BranchSchedule {
  id: string;
  branchId: string;
  dayOfWeek: string;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'branch_admin';
  branchId?: string;
}

export interface Teacher {
  id: string;
  name: string;
  mobile: string;
  gender: 'male' | 'female' | 'other';
  description?: string;
  specialties: string[];
  workingHours: {
    start: string;
    end: string;
  };
  maxHoursPerDay: number;
  maxHoursPerWeek: number;
  availableDays: string[];
  branchId: string;
  assignedDay?: string;
  weeklyAssignments?: {
    branchId: string;
    dayOfWeek: string;
    weekStartDate: string;
  }[];
}

export interface TimeSlot {
  id: string;
  teacherId: string;
  branchId: string;
  subject: string;
  room: string;
  start: string;
  end: string;
  isRecurring: boolean;
}

export interface ScheduleConflict {
  id: string;
  type: 'double_booking' | 'availability' | 'max_hours';
  teacherId: string;
  slotId: string;
  description: string;
}