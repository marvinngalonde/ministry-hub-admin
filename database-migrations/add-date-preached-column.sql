-- Add date_preached column to sermons table
-- This column allows storing the date when the sermon was preached

ALTER TABLE sermons ADD COLUMN IF NOT EXISTS date_preached TIMESTAMP WITH TIME ZONE;

-- Add comment for documentation
COMMENT ON COLUMN sermons.date_preached IS 'The date and time when the sermon was preached';

-- Create index for performance on date queries
CREATE INDEX IF NOT EXISTS idx_sermons_date_preached ON sermons(date_preached);

-- Verification query
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'sermons'
    AND column_name = 'date_preached'
ORDER BY ordinal_position;