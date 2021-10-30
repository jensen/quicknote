CREATE TABLE notes (
  id uuid DEFAULT extensions.uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text,
  summary text,
  content text,

  primary key (id)
);