CREATE INDEX IF NOT EXISTS idx_page_views_user_viewed ON public.page_views (user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON public.reading_progress (user_id, chapter);
CREATE INDEX IF NOT EXISTS idx_dynamics_usage_user ON public.dynamics_usage (user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages (recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_reads_user_msg ON public.message_reads (user_id, message_id);