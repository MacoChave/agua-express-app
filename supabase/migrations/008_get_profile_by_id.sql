-- Migration: Create get_profile_by_id function

CREATE OR REPLACE FUNCTION public.get_profile_by_id(user_id UUID)
RETURNS public.profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.profiles
  WHERE id = user_id;
$$;
