CREATE OR REPLACE FUNCTION mark_message_as_read(msg_id TEXT)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE "ContactMessage"
  SET read = true
  WHERE id = msg_id;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;

  RETURN updated_rows > 0;
END;
$$;
