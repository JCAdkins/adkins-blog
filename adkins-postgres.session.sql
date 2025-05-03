INSERT INTO "User" (
  id,
  email,
  password,
  username,
  "first_name",
  "last_name",
  role,
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(), -- or a static UUID
  'test@test.com',
  '$2b$10$abc123HereHashedPassword',
  'testee',
  'Fatty',
  'McFat',
  'user',
  NOW(),
  NOW()
);
