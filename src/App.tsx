import React, { useState } from 'react';
import { Calendar, Plus, GitBranch } from 'lucide-react';
import type { TimeSlot, DaySchedule, Branch } from './types';
import { TimeSlotCard } from './components/TimeSlotCard';
import { TimeSlotForm } from './components/TimeSlotForm';
import { BranchForm } from './components/BranchForm';

const DAYS: DaySchedule['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function App() {
  const [selectedDay, setSelectedDay] = useState<DaySchedule['day']>('Monday');
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    DAYS.map(day => ({ day, slots: [] }))
  );
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const currentSchedule = schedule.find(s => s.day === selectedDay)!;

  const handleSaveSlot = (slot: TimeSlot) => {
    setSchedule(prev => prev.map(daySchedule => {
      if (daySchedule.day === selectedDay) {
        const slots = editingSlot
          ? daySchedule.slots.map(s => s.id === editingSlot.id ? slot : s)
          : [...daySchedule.slots, slot].sort((a, b) => a.startTime.localeCompare(b.startTime));
        return { ...daySchedule, slots };
      }
      return daySchedule;
    }));
    setIsAddingSlot(false);
    setEditingSlot(null);
  };

  const handleDeleteSlot = (id: string) => {
    setSchedule(prev => prev.map(daySchedule => {
      if (daySchedule.day === selectedDay) {
        return { ...daySchedule, slots: daySchedule.slots.filter(slot => slot.id !== id) };
      }
      return daySchedule;
    }));
  };

  const handleSaveBranch = (branch: Branch) => {
    setBranches(prev => {
      const newBranches = editingBranch
        ? prev.map(b => b.id === editingBranch.id ? branch : b)
        : [...prev, branch];
      return newBranches.sort((a, b) => a.name.localeCompare(b.name));
    });
    setIsAddingBranch(false);
    setEditingBranch(null);
  };

  const handleDeleteBranch = (id: string) => {
    setBranches(prev => prev.filter(branch => branch.id !== id));
    // Remove branch from all time slots
    setSchedule(prev => prev.map(daySchedule => ({
      ...daySchedule,
      slots: daySchedule.slots.map(slot => ({
        ...slot,
        branch: slot.branch === id ? undefined : slot.branch
      }))
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Teacher Schedule</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex space-x-1 bg-white p-1 rounded-lg shadow">
                {DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                      ${selectedDay === day
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {(isAddingSlot || editingSlot) ? (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">
                  {editingSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
                </h2>
                <TimeSlotForm
                  slot={editingSlot || undefined}
                  branches={branches}
                  onSave={handleSaveSlot}
                  onCancel={() => {
                    setIsAddingSlot(false);
                    setEditingSlot(null);
                  }}
                />
              </div>
            ) : (
              <button
                onClick={() => setIsAddingSlot(true)}
                className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Time Slot
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {currentSchedule.slots.map(slot => (
                <TimeSlotCard
                  key={slot.id}
                  slot={slot}
                  branches={branches}
                  onEdit={setEditingSlot}
                  onDelete={handleDeleteSlot}
                />
              ))}
              {currentSchedule.slots.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-8">
                  No time slots scheduled for {selectedDay}. Click "Add Time Slot" to get started.
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <GitBranch className="w-5 h-5 mr-2 text-indigo-600" />
                  Branches
                </h2>
                <button
                  onClick={() => setIsAddingBranch(true)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Plus className="w-5 h-5 text-indigo-600" />
                </button>
              </div>

              {(isAddingBranch || editingBranch) ? (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">
                    {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                  </h3>
                  <BranchForm
                    branch={editingBranch || undefined}
                    onSave={handleSaveBranch}
                    onCancel={() => {
                      setIsAddingBranch(false);
                      setEditingBranch(null);
                    }}
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                {branches.map(branch => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: branch.color }}
                      />
                      <span className="font-medium">{branch.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingBranch(branch)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
                {branches.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No branches created yet. Click the plus icon to add one.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;