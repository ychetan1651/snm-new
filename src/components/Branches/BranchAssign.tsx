import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, Check, X, Clock, AlertCircle, Search, ChevronDown, AlertTriangle } from 'lucide-react';
import type { Branch, BranchSchedule } from '../../types';

interface BranchAssignProps {
  branches: Branch[];
  branchSchedules: BranchSchedule[];
  onAssign: (schedule: Omit<BranchSchedule, 'id'>) => void;
  onUnassign: (scheduleId: string) => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  branchName: string;
  dayOfWeek: string;
}

interface RulesViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function ConfirmationModal({ isOpen, onClose, onConfirm, branchName, dayOfWeek }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Confirm Unassign
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to unassign <span className="font-semibold">{branchName}</span> from <span className="font-semibold">{dayOfWeek}</span>?
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
              Unassign
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
                Assignment Rule Violation
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
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

export function BranchAssign({ branches, branchSchedules, onAssign, onUnassign }: BranchAssignProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'branch' | 'day'>('branch');
  const [dropdownQuery, setDropdownQuery] = useState('');
  const [dayDropdownQuery, setDayDropdownQuery] = useState('');
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRulesViolationModalOpen, setIsRulesViolationModalOpen] = useState(false);
  const [rulesViolationMessage, setRulesViolationMessage] = useState('');
  const [unassignData, setUnassignData] = useState<{ scheduleId: string; branchName: string; dayOfWeek: string } | null>(null);
  
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const dayDropdownRef = useRef<HTMLDivElement>(null);

  const filteredDropdownBranches = useMemo(() => {
    // Filter out already assigned branches and apply search
    const assignedBranchIds = branchSchedules.map(schedule => schedule.branchId);
    return branches.filter(branch => 
      !assignedBranchIds.includes(branch.id) && 
      branch.name.toLowerCase().includes(dropdownQuery.toLowerCase())
    );
  }, [branches, branchSchedules, dropdownQuery]);

  const filteredDays = useMemo(() => {
    return DAYS_OF_WEEK.filter(day =>
      day.toLowerCase().includes(dayDropdownQuery.toLowerCase())
    );
  }, [dayDropdownQuery]);

  const schedulesByDay = useMemo(() => {
    return DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = branchSchedules.filter(schedule => schedule.dayOfWeek === day);
      return acc;
    }, {} as Record<string, BranchSchedule[]>);
  }, [branchSchedules]);

  const filteredScheduleData = useMemo(() => {
    if (!searchQuery) return DAYS_OF_WEEK;

    if (searchType === 'day') {
      return DAYS_OF_WEEK.filter(day =>
        day.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Search by branch name
    return DAYS_OF_WEEK.filter(day => {
      const daySchedules = schedulesByDay[day] || [];
      return daySchedules.some(schedule => {
        const branch = branches.find(b => b.id === schedule.branchId);
        return branch?.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [searchQuery, searchType, schedulesByDay, branches]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (dayDropdownRef.current && !dayDropdownRef.current.contains(event.target as Node)) {
        setIsDayDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBranch && selectedDay) {
      // Check if this branch is already assigned to any day
      const isAlreadyAssigned = branchSchedules.some(schedule => 
        schedule.branchId === selectedBranch
      );

      if (isAlreadyAssigned) {
        setRulesViolationMessage('This branch is already assigned to a day. Each branch can only be assigned once.');
        setIsRulesViolationModalOpen(true);
        return;
      }

      onAssign({
        branchId: selectedBranch,
        dayOfWeek: selectedDay,
        isActive: true,
      });

      setSelectedBranch('');
      setSelectedDay('');
    }
  };

  const handleUnassign = (scheduleId: string, branchId: string, dayOfWeek: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setUnassignData({
        scheduleId,
        branchName: branch.name,
        dayOfWeek,
      });
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmUnassign = () => {
    if (unassignData) {
      onUnassign(unassignData.scheduleId);
      setUnassignData(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 text-blue-600 mr-2" />
            Branch Assignment Schedule
          </h2>
        </div>

        <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4" ref={branchDropdownRef}>
            <label className="block text-sm font-medium text-gray-700">
              Select Branch
            </label>
            <div className="relative">
              <div
                className="relative w-full cursor-pointer"
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              >
                <div className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2">
                  <span className={selectedBranch ? 'text-gray-900' : 'text-gray-500'}>
                    {branches.find(b => b.id === selectedBranch)?.name || 'Choose a branch'}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {isBranchDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Search branches..."
                        value={dropdownQuery}
                        onChange={(e) => setDropdownQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <ul className="max-h-60 overflow-auto py-1">
                    {filteredDropdownBranches.map((branch) => (
                      <li
                        key={branch.id}
                        className={`px-3 py-2 cursor-pointer flex items-center space-x-2 ${
                          selectedBranch === branch.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedBranch(branch.id);
                          setIsBranchDropdownOpen(false);
                          setDropdownQuery('');
                        }}
                      >
                        <div className={`w-3 h-3 rounded-full ${branch.color.split(' ')[0]}`} />
                        <span>{branch.name}</span>
                        {selectedBranch === branch.id && (
                          <Check className="h-4 w-4 ml-auto text-blue-600" />
                        )}
                      </li>
                    ))}
                    {filteredDropdownBranches.length === 0 && (
                      <li className="px-3 py-2 text-sm text-gray-500 text-center">
                        No available branches found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4" ref={dayDropdownRef}>
            <label className="block text-sm font-medium text-gray-700">
              Select Day
            </label>
            <div className="relative">
              <div
                className="relative w-full cursor-pointer"
                onClick={() => setIsDayDropdownOpen(!isDayDropdownOpen)}
              >
                <div className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2">
                  <span className={selectedDay ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedDay || 'Choose a day'}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {isDayDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Search days..."
                        value={dayDropdownQuery}
                        onChange={(e) => setDayDropdownQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <ul className="max-h-60 overflow-auto py-1">
                    {filteredDays.map((day) => (
                      <li
                        key={day}
                        className={`px-3 py-2 cursor-pointer flex items-center space-x-2 ${
                          selectedDay === day
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedDay(day);
                          setIsDayDropdownOpen(false);
                          setDayDropdownQuery('');
                        }}
                      >
                        <span>{day}</span>
                        {selectedDay === day && (
                          <Check className="h-4 w-4 ml-auto text-blue-600" />
                        )}
                      </li>
                    ))}
                    {filteredDays.length === 0 && (
                      <li className="px-3 py-2 text-sm text-gray-500 text-center">
                        No available days found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={!selectedBranch || !selectedDay}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Clock className="h-5 w-5 mr-2" />
              Assign Branch to Schedule
            </button>
          </div>
        </form>
      </div>

      {/* Schedule Overview Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
              Current Schedule Overview
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Search by:</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'branch' | 'day')}
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="branch">Branch</option>
                  <option value="day">Day</option>
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${searchType === 'branch' ? 'branches' : 'days'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Branches
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredScheduleData.map((day) => {
                const daySchedules = schedulesByDay[day] || [];
                const assignedBranches = daySchedules
                  .map(schedule => ({
                    schedule,
                    branch: branches.find(b => b.id === schedule.branchId)
                  }))
                  .filter((item): item is { schedule: BranchSchedule; branch: Branch } => item.branch !== undefined);

                return (
                  <tr key={day} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {assignedBranches.map(({ schedule, branch }) => (
                          <div
                            key={schedule.id}
                            className="flex items-center space-x-2 bg-gray-100 rounded-full pl-2 pr-1 py-1"
                          >
                            <div className={`w-2 h-2 rounded-full ${branch.color.split(' ')[0]}`} />
                            <span className="text-sm text-gray-700">{branch.name}</span>
                            <button
                              onClick={() => handleUnassign(schedule.id, branch.id, day)}
                              className="hover:bg-gray-200 rounded-full p-1"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        ))}
                        {assignedBranches.length === 0 && (
                          <span className="text-sm text-gray-500">No branches assigned</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUnassign}
        branchName={unassignData?.branchName || ''}
        dayOfWeek={unassignData?.dayOfWeek || ''}
      />
      
      {/* Rules Violation Modal */}
      <RulesViolationModal
        isOpen={isRulesViolationModalOpen}
        onClose={() => setIsRulesViolationModalOpen(false)}
        message={rulesViolationMessage}
      />
    </div>
  );
}