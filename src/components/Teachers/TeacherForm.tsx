import React, { useState } from 'react';
import { User, Check, AlertCircle } from 'lucide-react';
import type { Teacher } from '../../types';

interface TeacherFormProps {
  onSubmit: (teacher: Omit<Teacher, 'id'>) => void;
  onCancel: () => void;
  existingTeachers: Teacher[];
  editingTeacher?: Teacher;
}

export function TeacherForm({ onSubmit, onCancel, existingTeachers, editingTeacher }: TeacherFormProps) {
  const [name, setName] = useState(editingTeacher?.name || '');
  const [mobile, setMobile] = useState(editingTeacher?.mobile || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(editingTeacher?.gender || 'male');
  const [description, setDescription] = useState(editingTeacher?.description || '');
  const [specialties, setSpecialties] = useState<string[]>(editingTeacher?.specialties || []);
  const [workingHours, setWorkingHours] = useState({
    start: editingTeacher?.workingHours?.start || '09:00',
    end: editingTeacher?.workingHours?.end || '17:00'
  });
  const [maxHoursPerDay, setMaxHoursPerDay] = useState(editingTeacher?.maxHoursPerDay || 8);
  const [maxHoursPerWeek, setMaxHoursPerWeek] = useState(editingTeacher?.maxHoursPerWeek || 40);
  const [availableDays, setAvailableDays] = useState<string[]>(
    editingTeacher?.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  );
  const [error, setError] = useState('');

  const specialtyOptions = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Physical Education',
    'Art',
    'Music'
  ];

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    // Check for duplicate name
    const isDuplicate = existingTeachers.some(
      teacher => teacher.name.toLowerCase() === name.toLowerCase() && teacher.id !== editingTeacher?.id
    );

    if (isDuplicate) {
      setError('A teacher with this name already exists');
      return;
    }

    onSubmit({
      id: editingTeacher?.id,
      name,
      mobile,
      gender,
      description,
      specialties,
      workingHours,
      maxHoursPerDay,
      maxHoursPerWeek,
      availableDays,
      branchId: editingTeacher?.branchId || '',
      assignedDay: editingTeacher?.assignedDay
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <User className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
          </h3>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
            Mobile Number <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit mobile number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 space-x-4">
            {['male', 'female', 'other'].map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={gender === option}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Specialties <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {specialtyOptions.map((specialty) => (
              <label key={specialty} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={specialties.includes(specialty)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSpecialties([...specialties, specialty]);
                    } else {
                      setSpecialties(specialties.filter(s => s !== specialty));
                    }
                  }}
                  className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{specialty}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="workingHoursStart" className="block text-sm font-medium text-gray-700">
              Working Hours Start
            </label>
            <input
              type="time"
              id="workingHoursStart"
              value={workingHours.start}
              onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="workingHoursEnd" className="block text-sm font-medium text-gray-700">
              Working Hours End
            </label>
            <input
              type="time"
              id="workingHoursEnd"
              value={workingHours.end}
              onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxHoursPerDay" className="block text-sm font-medium text-gray-700">
              Max Hours Per Day
            </label>
            <input
              type="number"
              id="maxHoursPerDay"
              value={maxHoursPerDay}
              onChange={(e) => setMaxHoursPerDay(parseInt(e.target.value))}
              min="1"
              max="12"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="maxHoursPerWeek" className="block text-sm font-medium text-gray-700">
              Max Hours Per Week
            </label>
            <input
              type="number"
              id="maxHoursPerWeek"
              value={maxHoursPerWeek}
              onChange={(e) => setMaxHoursPerWeek(parseInt(e.target.value))}
              min="1"
              max="60"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Available Days
          </label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {daysOfWeek.map((day) => (
              <label key={day} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={availableDays.includes(day)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAvailableDays([...availableDays, day]);
                    } else {
                      setAvailableDays(availableDays.filter(d => d !== day));
                    }
                  }}
                  className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add any additional information about the teacher..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Check className="h-4 w-4 mr-2" />
          {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
        </button>
      </div>
    </form>
  );
}