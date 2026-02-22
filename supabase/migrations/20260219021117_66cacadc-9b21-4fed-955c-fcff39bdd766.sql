
ALTER TABLE public.profiles
ADD COLUMN access_status text NOT NULL DEFAULT 'pending';

-- Update existing users to 'active' so they aren't locked out
UPDATE public.profiles SET access_status = 'active';
