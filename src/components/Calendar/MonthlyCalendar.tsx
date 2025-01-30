import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TimeSlot, Teacher, Branch, BranchSchedule } from '../../types';

interface CalendarProps {
  slots: TimeSlot[];
  teachers: Teacher[];
  branches: Branch[];
  branchSchedules: BranchSchedule[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onSlotClick: (slot: TimeSlot) => void;
}

export function MonthlyCalendar({
  slots,
  teachers,
  branches,
  branchSchedules,
  selectedDate,
  onDateChange,
  onSlotClick,
}: CalendarProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add padding days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({ date: prevDate, isCurrentMonth: false });
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Add padding days from next month
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const days = getDaysInMonth(selectedDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getSlotsForDate = (date: Date) => {
    return slots.filter((slot) => {
      const slotDate = new Date(slot.start);
      return (
        slotDate.getDate() === date.getDate() &&
        slotDate.getMonth() === date.getMonth() &&
        slotDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getAssignmentsForDay = (date: Date) => {
    const dayName = date.toLocaleString('en-US', { weekday: 'long' });
    const schedules = branchSchedules.filter(schedule => schedule.dayOfWeek === dayName);
    
    return schedules.map(schedule => {
      const branch = branches.find(b => b.id === schedule.branchId);
      const teacher = teachers.find(t => 
        t.branchId === schedule.branchId && 
        t.assignedDay === dayName
      );
      return { schedule, branch, teacher };
    }).filter((item): item is { 
      schedule: BranchSchedule; 
      branch: Branch; 
      teacher: Teacher | undefined 
    } => item.branch !== undefined);
  };

  const handlePrevMonth = () => {
    onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onDateChange(new Date())}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            Today
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-white p-3 text-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}

        {days.map(({ date, isCurrentMonth }, idx) => {
          const daySlots = getSlotsForDate(date);
          const isToday =
            date.toDateString() === new Date().toDateString();

          return (
            <div
              key={idx}
              className={`min-h-[140px] p-3 bg-white hover:bg-gray-50 transition-colors ${
                !isCurrentMonth ? 'bg-gray-50/50' : ''
              } ${
                isToday ? 'ring-2 ring-blue-500 ring-inset' : ''
              }`}
            >
              <div
                className={`text-sm font-medium ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {date.getDate()}
              </div>
              <div className="mt-1 space-y-1">
                {getAssignmentsForDay(date).map(({ branch, teacher }) => {
                  return (
                    <button
                      key={`${branch.id}-${teacher?.id || 'unassigned'}`}
                      className={`w-full text-left p-2 rounded-md ${branch.color} hover:ring-2 hover:ring-gray-200 transition-shadow`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm truncate">
                            {branch.name}
                          </div>
                          <div className="text-xs truncate opacity-75">
                            {teacher ? teacher.name : 'Unassigned'}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {getAssignmentsForDay(date).length === 0 && isCurrentMonth && (
                  <div className="text-xs text-gray-400 mt-2 text-center">No assignments</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}