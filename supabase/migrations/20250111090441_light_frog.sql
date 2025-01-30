/*
  # Initial schema setup for teacher assignment system

  1. New Tables
    - `branches`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `color` (text)
      - `created_at` (timestamp)
    
    - `branch_schedules`
      - `id` (uuid, primary key)
      - `branch_id` (uuid, references branches)
      - `day_of_week` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    
    - `teachers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `mobile` (text)
      - `gender` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `teacher_assignments`
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, references teachers)
      - `branch_id` (uuid, references branches)
      - `day_of_week` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to branches"
  ON branches
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create branch_schedules table
CREATE TABLE IF NOT EXISTS branch_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES branches ON DELETE CASCADE NOT NULL,
  day_of_week text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(branch_id, day_of_week)
);

ALTER TABLE branch_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to branch_schedules"
  ON branch_schedules
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile text,
  gender text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to teachers"
  ON teachers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create teacher_assignments table
CREATE TABLE IF NOT EXISTS teacher_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers ON DELETE CASCADE NOT NULL,
  branch_id uuid REFERENCES branches ON DELETE CASCADE NOT NULL,
  day_of_week text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, day_of_week),
  UNIQUE(branch_id, day_of_week)
);

ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to teacher_assignments"
  ON teacher_assignments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);