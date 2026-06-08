/**
 * COMPANIES
 * */
-- Allow anyone (even without session) to create a company
-- In a real production app, you might want to restrict this or use a more complex check
CREATE POLICY "Enable insert for all users" ON "public".companies
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update/delete companies (For testing purposes)
-- WARNING: In production, these should be restricted to the company owner/admin
CREATE POLICY "Enable update for all users" ON "public".companies
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON "public".companies
    FOR DELETE USING (true);

-- Also allow anon to view companies for testing
CREATE POLICY "Enable select for anon users" ON "public".companies
    FOR SELECT USING (true);

/**
 * WAREHOUSES
 * */
-- Allow anyone (even without session) to create a company
-- In a real production app, you might want to restrict this or use a more complex check
CREATE POLICY "Enable insert for all users" ON "public".warehouses
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update/delete warehouses (For testing purposes)
-- WARNING: In production, these should be restricted to the company owner/admin
CREATE POLICY "Enable update for all users" ON "public".warehouses
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON "public".warehouses
    FOR DELETE USING (true);

-- Also allow anon to view warehouses for testing
CREATE POLICY "Enable select for anon users" ON "public".warehouses
    FOR SELECT USING (true);

/**
 * MOVEMENT TYPES
 * */
-- Allow anyone (even without session) to create a movement_types
CREATE POLICY "Enable insert for all users" ON "public".movement_types
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update/delete movement_types (For testing purposes)
-- WARNING: In production, these should be restricted to the company owner/admin
CREATE POLICY "Enable update for all users" ON "public".movement_types
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON "public".movement_types
    FOR DELETE USING (true);

-- Also allow anon to view movement_types for testing
CREATE POLICY "Enable select for anon users" ON "public".movement_types
    FOR SELECT USING (true);

/**
* EXPENSE TYPES
* */
-- Allow anyone (even without session) to create a expense_types
CREATE POLICY "Enable insert for all users" ON "public".expense_types
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update/delete expense_types (For testing purposes)
-- WARNING: In production, these should be restricted to the company owner/admin
CREATE POLICY "Enable update for all users" ON "public".expense_types
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON "public".expense_types
    FOR DELETE USING (true);

-- Also allow anon to view expense_types for testing
CREATE POLICY "Enable select for anon users" ON "public".expense_types
    FOR SELECT USING (true);

/**
* EQUIPMENT
* */
-- Allow anyone (even without session) to create a equipment
CREATE POLICY "Enable insert for all users" ON "public".equipment
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update/delete equipment (For testing purposes)
-- WARNING: In production, these should be restricted to the company owner/admin
CREATE POLICY "Enable update for all users" ON "public".equipment
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON "public".equipment
    FOR DELETE USING (true);

-- Also allow anon to view equipment for testing
CREATE POLICY "Enable select for anon users" ON "public".equipment
    FOR SELECT USING (true);

/**
* MAINTENANCE_TYPES
* */
-- Allow anyone (even without session) to create a maintenance_types
CREATE POLICY "Enable insert for all users" ON "public".maintenance_types
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update/delete maintenance_types (For testing purposes)
-- WARNING: In production, these should be restricted to the company owner/admin
CREATE POLICY "Enable update for all users" ON "public".maintenance_types
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON "public".maintenance_types
    FOR DELETE USING (true);

-- Also allow anon to view maintenance_types for testing
CREATE POLICY "Enable select for anon users" ON "public".maintenance_types
    FOR SELECT USING (true);

/**
* INVENTORY MOVEMENTS
* */
-- Allow anyone (even without session) to create a inventory_movements
CREATE POLICY "Enable insert for all users" ON "public".inventory_movements
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update/delete inventory_movements (For testing purposes)
-- WARNING: In production, these should be restricted to the company owner/admin
CREATE POLICY "Enable update for all users" ON "public".inventory_movements
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON "public".inventory_movements
    FOR DELETE USING (true);

-- Also allow anon to view inventory_movements for testing
CREATE POLICY "Enable select for anon users" ON "public".inventory_movements
    FOR SELECT USING (true);

/**
* MAINTENANCE SCHEDULES
* */
-- Allow anyone (even without session) to create a maintenance_schedules
CREATE POLICY "Enable insert for all users" ON "public".maintenance_schedules
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update/delete maintenance_schedules (For testing purposes)
-- WARNING: In production, these should be restricted to the company owner/admin
CREATE POLICY "Enable update for all users" ON "public".maintenance_schedules
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON "public".maintenance_schedules
    FOR DELETE USING (true);

-- Also allow anon to view maintenance_schedules for testing
CREATE POLICY "Enable select for anon users" ON "public".maintenance_schedules
    FOR SELECT USING (true);

/**
* MAINTENANCE TASKS
* */
-- Allow anyone (even without session) to create a maintenance_tasks
CREATE POLICY "Enable insert for all users" ON "public".maintenance_tasks
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update/delete maintenance_tasks (For testing purposes)
-- WARNING: In production, these should be restricted to the company owner/admin
CREATE POLICY "Enable update for all users" ON "public".maintenance_tasks
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON "public".maintenance_tasks
    FOR DELETE USING (true);

-- Also allow anon to view maintenance_tasks for testing
CREATE POLICY "Enable select for anon users" ON "public".maintenance_tasks
    FOR SELECT USING (true);
