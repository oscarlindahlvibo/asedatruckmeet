-- One-time bootstrap for the first Truckmeet administrator.
-- This is deliberately scoped to the truckmeet schema in the shared database.
CREATE SCHEMA IF NOT EXISTS "truckmeet";
SET search_path TO "truckmeet", public;

CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'SUPER_ADMIN'
    CHECK (role IN ('SUPER_ADMIN', 'EVENT_ADMIN', 'CONTENT_EDITOR', 'TICKET_ADMIN', 'TRUCK_MODERATOR', 'MAP_EDITOR', 'VOTE_ADMIN', 'STAFF_READONLY')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_read_own" ON admin_users;
CREATE POLICY "admin_users_read_own"
  ON admin_users FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = truckmeet, public
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  current_email text := COALESCE(auth.jwt() ->> 'email', '');
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Serialize the first claim so two simultaneous setup attempts cannot both win.
  PERFORM pg_advisory_xact_lock(hashtextextended('truckmeet:first-admin', 0));

  IF EXISTS (SELECT 1 FROM truckmeet.admin_users LIMIT 1) THEN
    RETURN false;
  END IF;

  INSERT INTO truckmeet.admin_users (user_id, email, role)
  VALUES (current_user_id, current_email, 'SUPER_ADMIN');

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION claim_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION claim_first_admin() TO authenticated;

CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
