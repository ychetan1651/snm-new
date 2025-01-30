import React from 'react';
import {
  Users,
  Calendar,
  Clock,
  Building2
} from 'lucide-react';
import type { Branch, Teacher, TimeSlot } from '../../types';

interface StatsProps {
  branches: Branch[];
  teachers: Teacher[];
  slots: TimeSlot[];
}

export function OverviewStats({ branches, teachers, slots }: StatsProps) {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  const stats = [
    {
      label: 'Total Branches',
      value: branches.length,
      icon: Building2,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Total Teachers',
      value: teachers.length,
      icon: Users,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: `${currentMonth} Classes`,
      value: slots.length,
      icon: Calendar,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg shadow-md p-6 flex items-center transform hover:scale-[1.02] transition-transform"
        >
          <div className={`p-4 rounded-full ${stat.color.split(' ')[1]} bg-opacity-20`}>
            <stat.icon className={`h-6 w-6 ${stat.color.split(' ')[0]}`} />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}