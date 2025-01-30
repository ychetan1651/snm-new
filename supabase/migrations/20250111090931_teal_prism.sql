/*
  # Add public access policy for branches

  1. Security Changes
    - Add policy to allow public access to branches table
    - This allows unauthenticated users to perform operations on branches
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'branches' 
    AND policyname = 'Allow public access to branches'
  ) THEN
    CREATE POLICY "Allow public access to branches"
      ON branches
      FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;