-- Confirm email for ejgitermediacoes@gmail.com
UPDATE auth.users SET email_confirmed_at = now() WHERE id = 'f6fc9b0f-fc12-4122-97a5-c0d6934047f8';

-- Assign admin role
INSERT INTO public.user_roles (user_id, role) VALUES ('f6fc9b0f-fc12-4122-97a5-c0d6934047f8', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;