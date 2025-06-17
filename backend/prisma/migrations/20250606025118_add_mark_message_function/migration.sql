CREATE OR REPLACE FUNCTION mark_message_as_read(msg_id TEXT)
RETURNS boolean
LANGUAGE plpgsql
 AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE "ContactMessage"
  SET read = true
  WHERE id = msg_id
  RETURNING 1 INTO updated_rows;

  RETURN updated_rows IS NOT NULL;
END;
$$;
