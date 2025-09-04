-- Update the StudentExit table to match the new schema
ALTER TABLE StudentExit ADD COLUMN destinationSchool TEXT;
ALTER TABLE StudentExit ADD COLUMN nextClass TEXT;
ALTER TABLE StudentExit ADD COLUMN reasonForExit TEXT;
ALTER TABLE StudentExit ADD COLUMN exitStatement TEXT;
ALTER TABLE StudentExit ADD COLUMN studentClearanceForm TEXT;
ALTER TABLE StudentExit ADD COLUMN otherExitDocuments TEXT;

-- Update the StaffExit table to add exitStatement
ALTER TABLE StaffExit ADD COLUMN exitStatement TEXT;

-- Remove old columns that are no longer needed
-- Note: SQLite doesn't support DROP COLUMN, so we'll keep them for backward compatibility
