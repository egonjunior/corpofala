-- Block manual profile insertion (trigger handle_new_user handles creation automatically)
CREATE POLICY "Prevent manual profile creation"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (false);

-- Block profile deletion entirely (admin operations use service role)
CREATE POLICY "Prevent profile deletion"
  ON public.profiles FOR DELETE TO authenticated
  USING (false);