import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { BranchList } from './BranchList';
import { BranchForm } from './BranchForm';
import type { Branch, BranchSchedule } from '../../types';

interface BranchManagementProps {
  branches: Branch[];
  branchSchedules: BranchSchedule[];
  onAdd: (branch: Omit<Branch, 'id'>) => void;
  onEdit: (branch: Branch) => void;
  onDelete: (branchId: string) => void;
}

export function BranchManagement({
  branches,
  branchSchedules,
  onAdd,
  onEdit,
  onDelete,
}: BranchManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | undefined>();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (branch: Omit<Branch, 'id'>) => {
    try {
      await onAdd(branch);
      setShowForm(false);
      setError(null);
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = async (branch: Branch) => {
    try {
      await onEdit(branch);
      setEditingBranch(undefined);
      setError(null);
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBranch(undefined);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
        {!showForm && !editingBranch && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </button>
        )}
      </div>

      {(showForm || editingBranch) && (
        <BranchForm
          branch={editingBranch}
          existingBranches={branches}
          onSubmit={editingBranch ? handleEdit : handleAdd}
          onCancel={handleCancel}
        />
      )}

      <BranchList
        branches={branches}
        branchSchedules={branchSchedules}
        onEdit={setEditingBranch}
        onDelete={onDelete}
      />
    </div>
  );
}