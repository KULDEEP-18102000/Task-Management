-- Fix tasks table schema
-- Run this SQL script to remove the old user_id column

-- Check if user_id column exists and drop it
ALTER TABLE tasks DROP COLUMN IF EXISTS user_id;

-- Verify the table structure
DESCRIBE tasks;
