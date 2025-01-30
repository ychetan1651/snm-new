import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import type { Branch } from '../../types';

interface BranchFormProps {
  branch?: Branch;
  onSubmit: (branch: Omit<Branch, 'id'> | Branch) => void;
  onCancel: () => void;
  existingBranches: Branch[];
}

const colorOptions = [
  { label: 'Blue', value: 'bg-blue-100 text-blue-800' },
  { label: 'Green', value: 'bg-green-100 text-green-800' },
  { label: 'Yellow', value: 'bg-yellow-100 text-yellow-800' },
  { label: 'Red', value: 'bg-red-100 text-red-800' },
  { label: 'Purple', value: 'bg-purple-100 text-purple-800' },
  { label: 'Pink', value: 'bg-pink-100 text-pink-800' },
  { label: 'Indigo', value: 'bg-indigo-100 text-indigo-800' },
];

export function BranchForm({ branch, onSubmit, onCancel, existingBranches }: BranchFormProps) {
  const [name, setName] = useState(branch?.name || '');
  const [color, setColor] = useState(branch?.color || colorOptions[0].value);
  const [error, setError] = useState('');
  const [isDuplicateName, setIsDuplicateName] = useState(false);

  useEffect(() => {
    if (branch) {
      setName(branch.name);
      setColor(branch.color);
    }
  }, [branch]);

  const checkDuplicateName = useCallback((value: string) => {
    const isDuplicate = existingBranches.some(
      existingBranch => 
        existingBranch.name.toLowerCase() === value.toLowerCase() &&
        existingBranch.id !== branch?.id
    );
    setIsDuplicateName(isDuplicate);
    setError(isDuplicate ? 'A branch with this name already exists' : '');
  }, [existingBranches, branch]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isDuplicateName) {
      return;
    }

    const branchData = {
      name,
      color,
      ...(branch?.id ? { id: branch.id } : {}),
    };
    
    try {
      await onSubmit(branchData);
      if (!branch) {
        setName('');
        setColor(colorOptions[0].value);
      }
    } catch (error) {
      if ((error as any)?.message?.toLowerCase().includes('duplicate')) {
        setError('A branch with this name already exists');
      } else {
        setError('An error occurred while saving the branch');
      }
    }
  }, [name, color, branch, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {branch ? 'Edit Branch' : 'Add New Branch'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Branch Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            checkDuplicateName(e.target.value);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Theme
        </label>
        <div className="grid grid-cols-4 gap-2">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setColor(option.value)}
              className={`p-2 rounded-md ${option.value} ${
                color === option.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
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
          <Plus className="h-4 w-4 mr-2" />
          {branch ? 'Update Branch' : 'Add Branch'}
        </button>
      </div>
    </form>
  );
}