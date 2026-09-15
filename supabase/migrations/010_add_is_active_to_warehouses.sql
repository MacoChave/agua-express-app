-- Add is_active column to warehouses table
ALTER TABLE "public".warehouses ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
