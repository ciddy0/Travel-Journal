-- Add visited_at column to locations table
ALTER TABLE locations 
ADD COLUMN visited_at TIMESTAMPTZ;

-- Create index for faster queries on visited_at
CREATE INDEX idx_locations_visited_at ON locations(visited_at DESC);