/*
  # Add weekly teacher assignments

  1. New Tables
    - `weekly_teacher_assignments`
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, references teachers)
      - `branch_id` (uuid, references branches)
      - `day_of_week` (text)
      - `week_start_date` (date)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `weekly_teacher_assignments` table
    - Add policy for authenticated users
*/

CREATE TABLE IF NOT EXISTS weekly_teacher_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers ON DELETE CASCADE NOT NULL,
  branch_id uuid REFERENCES branches ON DELETE CASCADE NOT NULL,
  day_of_week text NOT NULL,
  week_start_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(branch_id, day_of_week, week_start_date)
);

ALTER TABLE weekly_teacher_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to weekly_teacher_assignments"
  ON weekly_teacher_assignments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to weekly_teacher_assignments"
  ON weekly_teacher_assignments
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);