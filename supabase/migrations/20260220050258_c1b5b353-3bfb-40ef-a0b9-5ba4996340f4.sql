
-- Inserir emails 2-6 na fila para egonjuniorg@gmail.com
-- user_id: 704e2df0-bf69-4935-bc3f-8f5a83d37691
-- Base: perfil criado em 2026-02-20 02:43:21 UTC

INSERT INTO email_queue (email, user_id, email_number, subject, scheduled_at, status)
VALUES
  ('egonjuniorg@gmail.com', '704e2df0-bf69-4935-bc3f-8f5a83d37691', 2, 'Eu entendo.',                 '2026-02-20 02:43:21'::timestamptz + interval '24 hours',  'pending'),
  ('egonjuniorg@gmail.com', '704e2df0-bf69-4935-bc3f-8f5a83d37691', 3, 'Quando foi a última vez?',    '2026-02-20 02:43:21'::timestamptz + interval '72 hours',  'pending'),
  ('egonjuniorg@gmail.com', '704e2df0-bf69-4935-bc3f-8f5a83d37691', 4, 'Você não tá sozinha nisso.', '2026-02-20 02:43:21'::timestamptz + interval '120 hours', 'pending'),
  ('egonjuniorg@gmail.com', '704e2df0-bf69-4935-bc3f-8f5a83d37691', 5, 'Uma semana.',                 '2026-02-20 02:43:21'::timestamptz + interval '168 hours', 'pending'),
  ('egonjuniorg@gmail.com', '704e2df0-bf69-4935-bc3f-8f5a83d37691', 6, 'Última conversa.',            '2026-02-20 02:43:21'::timestamptz + interval '336 hours', 'pending');
