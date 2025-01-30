import React from 'react';
import { Clock, BookOpen, Home, Users, Pencil, Trash2, GitBranch } from 'lucide-react';
import type { TimeSlot, Branch } from '../types';

interface TimeSlotCardProps {
  slot: TimeSlot;
  branches: Branch[];
  onEdit: (slot: TimeSlot) => void;
  onDelete: (id: string) => void;
}

export function TimeSlotCard({ slot, branches, onEdit, onDelete }: TimeSlotCardProps) {
  const branch = branches.find(b => b.id === slot.branch);

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow ${
      branch ? `border-l-4 border-[${branch.color}]` : ''
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span className="font-medium">
            {slot.startTime} - {slot.endTime}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(slot)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(slot.id)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-gray-600" />
          <span>{slot.subject}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Home className="w-4 h-4 text-gray-600" />
          <span>Room {slot.room}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-600" />
          <span>Grade {slot.grade}</span>
        </div>
        {branch && (
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4" style={{ color: branch.color }} />
            <span style={{ color: branch.color }}>{branch.name}</span>
          </div>
        )}
      </div>
      
      {slot.notes && (
        <p className="mt-2 text-sm text-gray-600 border-t pt-2">{slot.notes}</p>
      )}
    </div>
  );
}