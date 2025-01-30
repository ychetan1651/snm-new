import React, { useState } from 'react';
import { User, Pencil, Trash2, Phone, Users, FileText, AlertTriangle } from 'lucide-react';
import type { Teacher } from '../../types';

interface TeacherListProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacherId: string) => void;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teacherName: string;
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, teacherName }: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Delete Teacher
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <span className="font-semibold">{teacherName}</span>? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeacherList({ teachers, onEdit, onDelete }: TeacherListProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (teacherToDelete) {
      onDelete(teacherToDelete.id);
    }
  };

  const maleCount = teachers.filter(t => t.gender === 'male').length;
  const femaleCount = teachers.filter(t => t.gender === 'female').length;
  const otherCount = teachers.filter(t => t.gender === 'other').length;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Teachers</h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Male: {maleCount}
            </span>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Female: {femaleCount}
            </span>
            {otherCount > 0 && (
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Other: {otherCount}
              </span>
            )}
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Total: {teachers.length}
            </span>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{teacher.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {teacher.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                {teacher.mobile && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Phone className="h-4 w-4 mr-1" />
                    {teacher.mobile}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {teacher.workingHours.start} - {teacher.workingHours.end}
                </div>
                {teacher.description && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <FileText className="h-4 w-4 mr-1" />
                    <p className="line-clamp-1">{teacher.description}</p>
                  </div>
                )}
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" 
                style={{
                  backgroundColor: teacher.gender === 'male' ? '#e0f2fe' : 
                                 teacher.gender === 'female' ? '#fce7f3' : '#f3f4f6',
                  color: teacher.gender === 'male' ? '#0369a1' : 
                         teacher.gender === 'female' ? '#be185d' : '#374151'
                }}>
                {teacher.gender}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(teacher)}
                className="p-1 text-gray-400 hover:text-blue-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteClick(teacher)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {teachers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No teachers found. Add your first teacher to get started.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTeacherToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        teacherName={teacherToDelete?.name || ''}
      />
    </div>
  );
}