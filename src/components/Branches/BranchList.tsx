import React, { useState } from 'react';
import { Pencil, Trash2, Building2, AlertTriangle } from 'lucide-react';
import type { Branch, BranchSchedule } from '../../types';

interface BranchListProps {
  branches: Branch[];
  branchSchedules: BranchSchedule[];
  onEdit: (branch: Branch) => void;
  onDelete: (branchId: string) => void;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  branchName: string;
}

interface RulesViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, branchName }: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Delete Branch
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <span className="font-semibold">{branchName}</span>? This action cannot be undone.
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

function RulesViolationModal({ isOpen, onClose, message }: RulesViolationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Cannot Delete Branch
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BranchList({ branches, branchSchedules, onEdit, onDelete }: BranchListProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRulesViolationModalOpen, setIsRulesViolationModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  const handleDeleteClick = (branch: Branch) => {
    // Check if branch is assigned to any schedule
    const isAssigned = branchSchedules.some(schedule => schedule.branchId === branch.id);
    
    if (isAssigned) {
      setIsRulesViolationModalOpen(true);
      return;
    }
    
    setBranchToDelete(branch);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (branchToDelete) {
      onDelete(branchToDelete.id);
      setBranchToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Branches</h2>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Total: {branches.length}
          </span>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {branches.map((branch) => (
          <div key={branch.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${branch.color.split(' ')[0]}`} />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{branch.name}</h3>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(branch)}
                className="p-1 text-gray-400 hover:text-blue-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteClick(branch)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {branches.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No branches found. Add your first branch to get started.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBranchToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        branchName={branchToDelete?.name || ''}
      />

      {/* Rules Violation Modal */}
      <RulesViolationModal
        isOpen={isRulesViolationModalOpen}
        onClose={() => setIsRulesViolationModalOpen(false)}
        message="Cannot delete branch while it has assignments. Please remove all assignments first."
      />
    </div>
  );
}