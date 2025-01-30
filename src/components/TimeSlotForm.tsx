import React from 'react';
import { Calendar } from 'lucide-react';
import type { TimeSlot, Teacher } from '../types';

interface TimeSlotFormProps {
  teachers: Teacher[];
  onSubmit: (slot: Omit<TimeSlot, 'id'>) => void;
}

export function TimeSlotForm({ teachers, onSubmit }: TimeSlotFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const teacher = teachers.find(t => t.id === formData.get('teacherId') as string);
    
    onSubmit({
      teacherId: formData.get('teacherId') as string,
      day: formData.get('day') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      subject: formData.get('subject') as string,
      branch: teacher?.branch || '',
      room: formData.get('room') as string,
    });
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">Schedule Class</h3>
      
      <div>
        <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">Teacher</label>
        <select
          id="teacherId"
          name="teacherId"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name} - {teacher.branch}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="day" className="block text-sm font-medium text-gray-700">Day</label>
          <select
            id="day"
            name="day"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
          <select
            id="startTime"
            name="startTime"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Time</option>
            <option value="9:00">9:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="room" className="block text-sm font-medium text-gray-700">Room Number</label>
        <input
          type="text"
          id="room"
          name="room"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Schedule Class
      </button>
    </form>
  );
}