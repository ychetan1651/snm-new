import React from 'react';
import {
  User,
  Mail,
  BookOpen,
  Clock,
  Calendar,
  Building
} from 'lucide-react';
import type { Teacher, Branch, TimeSlot } from '../../types';

interface TeacherProfileProps {
  teacher: Teacher;
  branch: Branch;
  slots: TimeSlot[];
}

export function TeacherProfile({ teacher, branch, slots }: TeacherProfileProps) {
  const currentWeekSlots = slots.filter((slot) => {
    const slotDate = new Date(slot.start);
    const now = new Date();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    const weekEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (6 - now.getDay())
    );
    return slotDate >= weekStart && slotDate <= weekEnd;
  });

  const weeklyHours = currentWeekSlots.reduce((total, slot) => {
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return total + hours;
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {teacher.name}
            </h2>
            <div className="flex items-center mt-1 text-gray-500">
              <Building className="h-4 w-4 mr-1" />
              <span>{branch.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-2" />
            <span>{teacher.email}</span>
          </div>
          
          <div>
            <h3 className="flex items-center text-sm font-medium text-gray-500 mb-2">
              <BookOpen className="h-5 w-5 mr-2" />
              Teaching Subjects
            </h3>
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map((subject) => (
                <span
                  key={subject}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="flex items-center text-sm font-medium text-gray-500 mb-2">
              <Clock className="h-5 w-5 mr-2" />
              Working Hours
            </h3>
            <div className="text-sm text-gray-600">
              <p>Preferred Hours: {teacher.preferredHours.start} - {teacher.preferredHours.end}</p>
              <p>Maximum Weekly Hours: {teacher.maxWeeklyHours}</p>
              <p>Current Week Hours: {weeklyHours}</p>
            </div>
          </div>

          <div>
            <h3 className="flex items-center text-sm font-medium text-gray-500 mb-2">
              <Calendar className="h-5 w-5 mr-2" />
              Current Week Schedule
            </h3>
            <div className="space-y-2">
              {currentWeekSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{slot.subject}</p>
                    <p className="text-sm text-gray-500">Room {slot.room}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(slot.start).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}