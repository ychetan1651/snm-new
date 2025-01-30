/*
  # Add public access policy for teacher assignments

  1. Security Changes
    - Add public access policy for teacher_assignments table to allow all operations
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'teacher_assignments' 
    AND policyname = 'Allow public access to teacher_assignments'
  ) THEN
    CREATE POLICY "Allow public access to teacher_assignments"
      ON teacher_assignments
      FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;