import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import type { TimeSlot } from '../types';

interface TimeTableProps {
  slots: TimeSlot[];
  onDeleteSlot: (id: string) => void;
}

export function TimeTable({ slots, onDeleteSlot }: TimeTableProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            {days.map((day) => (
              <th
                key={day}
                className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time) => (
            <tr key={time} className="border-t border-gray-200">
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {time}
                </div>
              </td>
              {days.map((day) => {
                const slot = slots.find(
                  (s) => s.day === day && s.startTime === time
                );
                return (
                  <td key={`${day}-${time}`} className="px-4 py-2 whitespace-nowrap">
                    {slot ? (
                      <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                        <div>
                          <p className="text-sm font-medium text-blue-900">{slot.subject}</p>
                          <p className="text-xs text-blue-700">Room: {slot.room}</p>
                        </div>
                        <button
                          onClick={() => onDeleteSlot(slot.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}