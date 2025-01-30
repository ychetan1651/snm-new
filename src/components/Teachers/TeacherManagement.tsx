import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TeacherList } from './TeacherList';
import { TeacherForm } from './TeacherForm';
import type { Teacher } from '../../types';

interface TeacherManagementProps {
  teachers: Teacher[];
  onAdd: (teacher: Omit<Teacher, 'id'>) => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacherId: string) => void;
}

export function TeacherManagement({
  teachers,
  onAdd,
  onEdit,
  onDelete,
}: TeacherManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | undefined>();

  const handleAdd = (teacher: Omit<Teacher, 'id'>) => {
    onAdd(teacher);
    setShowForm(false);
  };

  const handleEdit = (teacher: Teacher) => {
    try {
      onEdit(teacher);
      setEditingTeacher(undefined);
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTeacher(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
        {!showForm && !editingTeacher && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </button>
        )}
      </div>

      {(showForm || editingTeacher) && (
        <TeacherForm
          onSubmit={editingTeacher ? handleEdit : handleAdd}
          onCancel={handleCancel}
          existingTeachers={teachers}
          editingTeacher={editingTeacher}
        />
      )}

      <TeacherList
        teachers={teachers}
        onEdit={setEditingTeacher}
        onDelete={onDelete}
      />
    </div>
  );
}