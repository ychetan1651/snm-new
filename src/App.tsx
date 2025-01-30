import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Database } from './lib/database.types';
import {
  LayoutDashboard,
  Users,
  Calendar as CalendarIcon,
  FileText,
  Settings,
  LogOut,
  Building2,
  Calendar,
  UserPlus
} from 'lucide-react';
import { OverviewStats } from './components/Dashboard/OverviewStats';
import { MonthlyCalendar } from './components/Calendar/MonthlyCalendar';
import { TeacherManagement } from './components/Teachers/TeacherManagement';
import { TeacherAssign } from './components/Teachers/TeacherAssign';
import { ScheduleConflicts } from './components/Schedule/ScheduleConflicts';
import { BranchManagement } from './components/Branches/BranchManagement';
import { BranchAssign } from './components/Branches/BranchAssign';
import type {
  User,
  Teacher,
  Branch,
  TimeSlot,
  ScheduleConflict,
  BranchSchedule
} from './types';

function App() {
  const [currentView, setCurrentView] = useState<
    'dashboard' | 'teachers' | 'teacher-assign' | 'schedule' | 'reports' | 'settings' | 'branches' | 'branch-assign'
  >('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  // State for branches
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchSchedules, setBranchSchedules] = useState<BranchSchedule[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [slots] = useState<TimeSlot[]>([]);
  const [conflicts] = useState<ScheduleConflict[]>([]);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' as const },
    { name: 'Branches', icon: Building2, view: 'branches' as const },
    { name: 'Branch Assign', icon: Calendar, view: 'branch-assign' as const },
    { name: 'Teachers', icon: Users, view: 'teachers' as const },
    { name: 'Teacher Assign', icon: UserPlus, view: 'teacher-assign' as const },
    { name: 'Schedule', icon: CalendarIcon, view: 'schedule' as const },
    { name: 'Reports', icon: FileText, view: 'reports' as const },
    { name: 'Settings', icon: Settings, view: 'settings' as const },
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch branches
      const { data: branchesData } = await supabase
        .from('branches')
        .select('*')
        .order('created_at', { ascending: true });

      if (branchesData) {
        setBranches(branchesData.map(branch => ({
          id: branch.id,
          name: branch.name,
          color: branch.color
        })));
      }

      // Fetch branch schedules
      const { data: schedulesData } = await supabase
        .from('branch_schedules')
        .select('*')
        .order('created_at', { ascending: true });

      if (schedulesData) {
        setBranchSchedules(schedulesData.map(schedule => ({
          id: schedule.id,
          branchId: schedule.branch_id,
          dayOfWeek: schedule.day_of_week,
          isActive: schedule.is_active
        })));
      }

      // Fetch teachers and their assignments
      const { data: teachersData } = await supabase
        .from('teachers')
        .select('*');

      // Fetch weekly assignments
      const { data: weeklyAssignmentsData } = await supabase
        .from('weekly_teacher_assignments')
        .select('*');

      if (teachersData) {
        setTeachers(teachersData.map(teacher => ({
          id: teacher.id,
          name: teacher.name,
          mobile: teacher.mobile || '',
          gender: teacher.gender as 'male' | 'female' | 'other',
          description: teacher.description || '',
          weeklyAssignments: weeklyAssignmentsData
            ?.filter(assignment => assignment.teacher_id === teacher.id)
            .map(assignment => ({
              branchId: assignment.branch_id,
              dayOfWeek: assignment.day_of_week,
              weekStartDate: assignment.week_start_date
            })) || []
        })));
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const handleAddBranch = async (branch: Omit<Branch, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([{
          name: branch.name,
          color: branch.color
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setBranches([...branches, {
          id: data.id,
          name: data.name,
          color: data.color
        }]);
      }
    } catch (error) {
      console.error('Error adding branch:', error);
    }
  };

  const handleEditBranch = async (updatedBranch: Branch) => {
    try {
      const { error } = await supabase
        .from('branches')
        .update({
          name: updatedBranch.name,
          color: updatedBranch.color
        })
        .eq('id', updatedBranch.id);

      if (error) throw error;
      setBranches(branches.map(branch => 
        branch.id === updatedBranch.id ? updatedBranch : branch
      ));
    } catch (error) {
      console.error('Error updating branch:', error);
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', branchId);

      if (error) throw error;
      setBranches(branches.filter(branch => branch.id !== branchId));
      setBranchSchedules(branchSchedules.filter(schedule => schedule.branchId !== branchId));
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

  const handleAssignBranch = async (schedule: Omit<BranchSchedule, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('branch_schedules')
        .insert([{
          branch_id: schedule.branchId,
          day_of_week: schedule.dayOfWeek,
          is_active: schedule.isActive
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setBranchSchedules([...branchSchedules, {
          id: data.id,
          branchId: data.branch_id,
          dayOfWeek: data.day_of_week,
          isActive: data.is_active
        }]);
      }
    } catch (error) {
      console.error('Error assigning branch:', error);
    }
  };

  const handleUnassignBranch = async (scheduleId: string) => {
    try {
      const { error } = await supabase
        .from('branch_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;
      setBranchSchedules(branchSchedules.filter(s => s.id !== scheduleId));
    } catch (error) {
      console.error('Error unassigning branch:', error);
    }
  };

  const handleAddTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .insert([{
          name: teacher.name,
          mobile: teacher.mobile,
          gender: teacher.gender,
          description: teacher.description
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTeachers([...teachers, {
          id: data.id,
          name: data.name,
          mobile: data.mobile || '',
          gender: data.gender as 'male' | 'female' | 'other',
          description: data.description || '',
          branchId: '',
        }]);
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const handleEditTeacher = async (updatedTeacher: Teacher) => {
    try {
      const teacherId = updatedTeacher.id;
      if (!teacherId) throw new Error('Teacher ID is required for updates');

      const { error } = await supabase
        .from('teachers')
        .update({
          name: updatedTeacher.name,
          mobile: updatedTeacher.mobile,
          gender: updatedTeacher.gender,
          description: updatedTeacher.description
        })
        .eq('id', teacherId);

      if (error) throw error;

      setTeachers(teachers.map(teacher => 
        teacher.id === teacherId ? {
          ...teacher,
          ...updatedTeacher,
          branchId: teacher.branchId, // Preserve existing assignments
          assignedDay: teacher.assignedDay
        } : teacher
      ));
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error; // Re-throw to allow handling in components
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      if (!teacherId) {
        throw new Error('Teacher ID is required for deletion');
      }

      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', teacherId);

      if (error) throw error;
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleAssignTeacher = async (teacherId: string, branchId: string, day: string) => {
    try {
      if (!teacherId || !branchId || !day) {
        return;
      }

      // Format week start date
      const weekStart = new Date(selectedWeek);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Get Sunday
      const formattedWeekStart = weekStart.toISOString().split('T')[0];

      // Check if the assignment already exists for this week
      const { data: existingAssignments, error: fetchError } = await supabase
        .from('weekly_teacher_assignments')
        .select('*')
        .eq('branch_id', branchId)
        .eq('day_of_week', day)
        .eq('week_start_date', formattedWeekStart);

      if (fetchError) throw fetchError;

      if (existingAssignments && existingAssignments.length > 0) {
        throw new Error('This branch is already assigned to a teacher for this day and week');
      }

      // Create new assignment
      const { data, error } = await supabase
        .from('weekly_teacher_assignments')
        .insert([{
          teacher_id: teacherId,
          branch_id: branchId,
          day_of_week: day,
          week_start_date: formattedWeekStart
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTeachers(teachers.map(teacher =>
          teacher.id === teacherId ? {
            ...teacher,
            weeklyAssignments: [
              ...(teacher.weeklyAssignments || []),
              {
                branchId,
                dayOfWeek: day,
                weekStartDate: formattedWeekStart
              }
            ]
          } : teacher
        ));
      }
    } catch (error) {
      throw error;
    }
  };

  const handleUnassignTeacher = async (teacherId: string) => {
    try {
      if (!teacherId) {
        throw new Error('Teacher ID is required for unassignment');
      }

      const { error } = await supabase
        .from('teacher_assignments')
        .delete()
        .eq('teacher_id', teacherId);

      if (error) throw error;
      setTeachers(teachers.map(teacher =>
        teacher.id === teacherId ? { ...teacher, branchId: '', assignedDay: undefined } : teacher
      ));
    } catch (error) {
      console.error('Error unassigning teacher:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">
              TimeTable Pro
            </h1>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setCurrentView(item.view)}
                className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                  currentView === item.view
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 ${
                    currentView === item.view
                      ? 'text-blue-700'
                      : 'text-gray-400'
                  }`}
                />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
              <LogOut className="h-5 w-5 mr-3 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          {currentView === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <OverviewStats
                branches={branches}
                teachers={teachers}
                slots={slots}
              />

              <div className="w-full">
                <MonthlyCalendar
                  slots={slots}
                  teachers={teachers}
                  branches={branches}
                  branchSchedules={branchSchedules}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onSlotClick={() => {}}
                />
              </div>
            </div>
          )}

          {currentView === 'branches' && (
            <BranchManagement
              branches={branches}
              branchSchedules={branchSchedules}
              onAdd={handleAddBranch}
              onEdit={handleEditBranch}
              onDelete={handleDeleteBranch}
            />
          )}

          {currentView === 'branch-assign' && (
            <BranchAssign
              branches={branches}
              branchSchedules={branchSchedules}
              onAssign={handleAssignBranch}
              onUnassign={handleUnassignBranch}
            />
          )}

          {currentView === 'teachers' && (
            <TeacherManagement
              teachers={teachers}
              onAdd={handleAddTeacher}
              onEdit={handleEditTeacher}
              onDelete={handleDeleteTeacher}
            />
          )}

          {currentView === 'teacher-assign' && (
            <TeacherAssign
              teachers={teachers}
              branches={branches}
              branchSchedules={branchSchedules}
              selectedWeek={selectedWeek}
              onWeekChange={setSelectedWeek}
              onAssign={handleAssignTeacher}
              onUnassign={handleUnassignTeacher}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;