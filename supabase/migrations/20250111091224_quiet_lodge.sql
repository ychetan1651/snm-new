/*
  # Add public access policy for branch_schedules

  1. Security Changes
    - Add public access policy for branch_schedules table to allow all operations
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'branch_schedules' 
    AND policyname = 'Allow public access to branch_schedules'
  ) THEN
    CREATE POLICY "Allow public access to branch_schedules"
      ON branch_schedules
      FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;