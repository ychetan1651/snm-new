import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, Check, X, Clock, AlertCircle, Search, ChevronDown, AlertTriangle, Calendar as CalendarIcon, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Teacher, Branch, BranchSchedule } from '../../types';

interface RulesViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
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

type SearchType = 'teacher' | 'branch' | 'day';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

interface TeacherAssignProps {
  teachers: Teacher[];
  branches: Branch[];
  branchSchedules: BranchSchedule[];
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  onAssign: (teacherId: string, branchId: string, day: string) => void;
  onUnassign: (teacherId: string) => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teacherName: string;
  branchName: string;
}

function ConfirmationModal({ isOpen, onClose, onConfirm, teacherName, branchName }: ConfirmationModalProps) {
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
                Confirm Unassign
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to unassign <span className="font-semibold">{teacherName}</span> from <span className="font-semibold">{branchName}</span>?
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

export function TeacherAssign({ 
  teachers, 
  branches, 
  branchSchedules, 
  selectedWeek,
  onWeekChange,
  onAssign, 
  onUnassign 
}: TeacherAssignProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('teacher');
  const [teacherDropdownQuery, setTeacherDropdownQuery] = useState('');
  const [branchDropdownQuery, setBranchDropdownQuery] = useState('');
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRulesViolationModalOpen, setIsRulesViolationModalOpen] = useState(false);
  const [rulesViolationMessage, setRulesViolationMessage] = useState('');
  const [unassignData, setUnassignData] = useState<{ teacherId: string; branchId: string } | null>(null);

  const teacherDropdownRef = useRef<HTMLDivElement>(null);
  const branchDropdownRef = useRef<HTMLDivElement>(null);

  const daysWithBranches = useMemo(() => 
    DAYS_OF_WEEK.filter(day => 
      branchSchedules.some(schedule => schedule.dayOfWeek === day)
    ), [branchSchedules]
  );

  const filteredAssignments = useMemo(() => {
    if (!searchQuery) return daysWithBranches;

    const weekStart = new Date(selectedWeek);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const formattedWeekStart = weekStart.toISOString().split('T')[0];

    return daysWithBranches.filter(day => {
      const assignments = branchSchedules
        .filter(schedule => schedule.dayOfWeek === day)
        .map(schedule => ({
          schedule,
          branch: branches.find(b => b.id === schedule.branchId),
          teacher: teachers.find(t =>
            t.weeklyAssignments?.some(assignment =>
              assignment.branchId === schedule.branchId &&
              assignment.dayOfWeek === day &&
              assignment.weekStartDate === formattedWeekStart
            )
          )
        }))
        .filter((item): item is { 
          schedule: BranchSchedule; 
          branch: Branch; 
          teacher: Teacher | undefined 
        } => item.branch !== undefined);

      switch (searchType) {
        case 'teacher':
          return assignments.some(({ teacher }) => 
            teacher?.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        case 'branch':
          return assignments.some(({ branch }) => 
            branch.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        case 'day':
          return day.toLowerCase().includes(searchQuery.toLowerCase());
        default:
          return true;
      }
    });
  }, [searchQuery, searchType, daysWithBranches, branchSchedules, branches, teachers]);

  const filteredDropdownTeachers = useMemo(() => {
    const weekStart = new Date(selectedWeek);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const formattedWeekStart = weekStart.toISOString().split('T')[0];

    return teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(teacherDropdownQuery.toLowerCase()) &&
      !teachers.some(t => 
        t.id === teacher.id && 
        t.weeklyAssignments?.some(assignment => 
          assignment.dayOfWeek === selectedDay &&
          assignment.weekStartDate === formattedWeekStart
        )
      )
    );
  }, [teachers, teacherDropdownQuery, selectedDay, selectedWeek]);

  const filteredDropdownBranches = useMemo(() => {
    const scheduledBranches = branchSchedules
      .filter(schedule => schedule.dayOfWeek === selectedDay)
      .map(schedule => schedule.branchId);

    const assignedBranches = teachers
      .filter(teacher => teacher.assignedDay === selectedDay)
      .map(teacher => teacher.branchId)
      .filter(Boolean);

    return branches
      .filter(branch => 
        scheduledBranches.includes(branch.id) && 
        !assignedBranches.includes(branch.id) &&
        branch.name.toLowerCase().includes(branchDropdownQuery.toLowerCase())
      );
  }, [branches, branchSchedules, teachers, selectedDay, branchDropdownQuery]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teachers, searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
        setIsTeacherDropdownOpen(false);
      }
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedBranch('');
  }, [selectedDay]);
  
  const getWeekDates = () => {
    const curr = new Date(selectedWeek);
    const first = curr.getDate() - curr.getDay();
    const last = first + 6;

    const firstDay = new Date(curr.setDate(first));
    const lastDay = new Date(curr.setDate(last));

    return {
      start: firstDay,
      end: lastDay
    };
  };

  const formatWeekRange = () => {
    const { start, end } = getWeekDates();
    return `${start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} - ${end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })}`;
  };

  const handlePrevWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() - 7);
    onWeekChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + 7);
    onWeekChange(newDate);
  };

  const handleCurrentWeek = () => {
    onWeekChange(new Date());
  };

  const renderDaySelectionButtons = () => (
    <div className="flex space-x-2 mb-6">
      {DAYS_OF_WEEK.map((day) => (
        <button
          key={day}
          onClick={() => setSelectedDay(day)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            selectedDay === day
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeacher && selectedBranch) {
      try {
        const isTeacherAssigned = teachers.some(
          t => t.id === selectedTeacher && t.assignedDay === selectedDay
        );

        if (isTeacherAssigned) {
          setRulesViolationMessage(`This teacher is already assigned to a branch for ${selectedDay}`);
          setIsRulesViolationModalOpen(true);
          return;
        }

        onAssign(selectedTeacher, selectedBranch, selectedDay);
        setSelectedTeacher('');
        setSelectedBranch('');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred while assigning the teacher';
        setRulesViolationMessage(message);
        setIsRulesViolationModalOpen(true);
      }
    }
  };

  const handleUnassign = (teacherId: string, branchId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    const branch = branches.find(b => b.id === branchId);
    if (teacher && branch) {
      setUnassignData({ teacherId, branchId });
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmUnassign = () => {
    if (unassignData) {
      onUnassign(unassignData.teacherId);
      setUnassignData(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="h-6 w-6 text-blue-600 mr-2" />
            Teacher Branch Assignment - Week Schedule
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCurrentWeek}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              Current Week
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevWeek}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-gray-600">
                {formatWeekRange()}
              </span>
              <button
                onClick={handleNextWeek}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {renderDaySelectionButtons()}

        <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4" ref={teacherDropdownRef}>
            <label className="block text-sm font-medium text-gray-700">
              Select Teacher
            </label>
            <div className="relative">
              <div
                className="relative w-full cursor-pointer"
                onClick={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
              >
                <div className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2">
                  <span className={selectedTeacher ? 'text-gray-900' : 'text-gray-500'}>
                    {teachers.find(t => t.id === selectedTeacher)?.name || 'Choose a teacher'}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {isTeacherDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Search teachers..."
                        value={teacherDropdownQuery}
                        onChange={(e) => setTeacherDropdownQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <ul className="max-h-60 overflow-auto py-1">
                    {filteredDropdownTeachers.map((teacher) => (
                      <li
                        key={teacher.id}
                        className={`px-3 py-2 cursor-pointer flex items-center space-x-2 ${
                          selectedTeacher === teacher.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedTeacher(teacher.id);
                          setIsTeacherDropdownOpen(false);
                          setTeacherDropdownQuery('');
                        }}
                      >
                        <span>{teacher.name}</span>
                        {selectedTeacher === teacher.id && (
                          <Check className="h-4 w-4 ml-auto text-blue-600" />
                        )}
                      </li>
                    ))}
                    {filteredDropdownTeachers.length === 0 && (
                      <li className="px-3 py-2 text-sm text-gray-500 text-center">
                        No available teachers found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

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
                        value={branchDropdownQuery}
                        onChange={(e) => setBranchDropdownQuery(e.target.value)}
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
                          setBranchDropdownQuery('');
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

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={!selectedTeacher || !selectedBranch}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Clock className="h-5 w-5 mr-2" />
              Assign Teacher to Branch
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
              Current Assignments
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Search by:</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="teacher">Teacher</option>
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
                  placeholder={`Search ${searchType}s...`}
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
              <tr className="divide-x divide-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Teachers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((day) => {
                const assignments = branchSchedules
                  .filter(schedule => schedule.dayOfWeek === day)
                  .map(schedule => ({
                    schedule,
                    branch: branches.find(b => b.id === schedule.branchId)
                  }))
                  .filter((item): item is { schedule: BranchSchedule; branch: Branch } => 
                    item.branch !== undefined
                  );

                return (
                  <tr key={day} className="hover:bg-gray-50 divide-x divide-gray-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        {assignments.map(({ schedule, branch }) => {
                          const teacher = teachers.find(
                            t => t.weeklyAssignments?.some(
                              assignment =>
                                assignment.branchId === branch.id &&
                                assignment.dayOfWeek === day &&
                                assignment.weekStartDate === new Date(selectedWeek.getTime() - selectedWeek.getDay() * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                            )
                          );
                          return (
                            <div
                              key={schedule.id}
                              className="flex items-center justify-between"
                            >
                              {teacher ? (
                                <div className="flex items-center space-x-2 bg-gray-100 rounded-full pl-3 pr-1 py-1">
                                  <span className="text-sm text-gray-700">{teacher.name}</span>
                                  <button
                                    onClick={() => handleUnassign(teacher.id, branch.id)}
                                    className="hover:bg-gray-200 rounded-full p-1"
                                  >
                                    <X className="h-4 w-4 text-gray-500" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500 italic">No teacher assigned</span>
                              )}
                            </div>
                          );
                        })}
                        {assignments.length === 0 && (
                          <span className="text-sm text-gray-500">No teachers assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        {assignments.map(({ schedule, branch }) => (
                          <div
                            key={schedule.id}
                            className="flex items-center space-x-2"
                          >
                            <div className={`w-2 h-2 rounded-full ${branch.color.split(' ')[0]}`} />
                            <span className="text-sm text-gray-700">{branch.name}</span>
                          </div>
                        ))}
                        {assignments.length === 0 && (
                          <span className="text-sm text-gray-500">-</span>
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

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUnassign}
        teacherName={unassignData ? teachers.find(t => t.id === unassignData.teacherId)?.name || '' : ''}
        branchName={unassignData ? branches.find(b => b.id === unassignData.branchId)?.name || '' : ''}
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