-- Fix infinite recursion in RLS policies for profiles table
-- Create a SECURITY DEFINER function to bypass RLS when checking roles
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Drop the old policy that was causing recursive RLS evaluation
DROP POLICY IF EXISTS "Admins can view company profiles" ON "public".profiles;

-- Create the new policy using the SECURITY DEFINER function
CREATE POLICY "Admins can view company profiles" ON "public".profiles
    FOR SELECT USING (
        company_id = public.get_my_company_id() 
        AND public.get_my_role() = 'admin'
    );
