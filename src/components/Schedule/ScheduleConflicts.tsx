import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import type { ScheduleConflict, Teacher } from '../../types';

interface ConflictsProps {
  conflicts: ScheduleConflict[];
  teachers: Teacher[];
  onResolve: (conflictId: string) => void;
}

export function ScheduleConflicts({ conflicts, teachers, onResolve }: ConflictsProps) {
  const getConflictIcon = (type: ScheduleConflict['type']) => {
    switch (type) {
      case 'double_booking':
        return 'text-red-500';
      case 'availability':
        return 'text-yellow-500';
      case 'max_hours':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getConflictTitle = (type: ScheduleConflict['type']) => {
    switch (type) {
      case 'double_booking':
        return 'Double Booking';
      case 'availability':
        return 'Availability Conflict';
      case 'max_hours':
        return 'Maximum Hours Exceeded';
      default:
        return 'Unknown Conflict';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          Schedule Conflicts
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {conflicts.map((conflict) => {
          const teacher = teachers.find((t) => t.id === conflict.teacherId);
          return (
            <div key={conflict.id} className="p-4">
              <div className="flex items-start">
                <div
                  className={`p-2 rounded-full ${getConflictIcon(
                    conflict.type
                  )} bg-opacity-10`}
                >
                  <Info className={`h-5 w-5 ${getConflictIcon(conflict.type)}`} />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {getConflictTitle(conflict.type)}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {teacher?.name}: {conflict.description}
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={() => onResolve(conflict.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Resolve Conflict
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {conflicts.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No conflicts found
          </div>
        )}
      </div>
    </div>
  );
}