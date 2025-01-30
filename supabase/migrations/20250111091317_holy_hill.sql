/*
  # Add public access policy for teachers

  1. Security Changes
    - Add public access policy for teachers table to allow all operations
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'teachers' 
    AND policyname = 'Allow public access to teachers'
  ) THEN
    CREATE POLICY "Allow public access to teachers"
      ON teachers
      FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;