-- Grant usage on the schema to the API roles
GRANT USAGE ON SCHEMA "public" TO anon, authenticated, service_role;

-- Grant permissions on all existing tables, sequences and functions
GRANT ALL ON ALL TABLES IN SCHEMA "public" TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA "public" TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA "public" TO anon, authenticated, service_role;

-- Ensure future tables also have these permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- Update the search path for the postgres user (used by Supabase internally)
ALTER ROLE postgres SET search_path TO "$user", public, public;
ALTER ROLE authenticated SET search_path TO "$user", public, public;
ALTER ROLE anon SET search_path TO "$user", public, public;
