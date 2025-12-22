-- Create login_logs table
create table public.login_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  roll_number text,
  email text,
  phone text,
  college text,
  branch text,
  section text
);

-- Create users table (for quiz registration)
create table public.users (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  roll_number text not null unique,
  email text,
  branch text,
  year text,
  college text
);

-- Create quiz_attempts table
create table public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.users(id),
  level integer,
  score integer,
  time_taken_seconds integer,
  answers jsonb
);

-- Enable Row Level Security (RLS)
alter table public.login_logs enable row level security;
alter table public.users enable row level security;
alter table public.quiz_attempts enable row level security;

-- Policies (Allow public insert for demo/MVP, restrict read to anon/authenticated as needed)
-- For now, allow public to insert/select for ease of development (in a real app, strict RLS is needed)
create policy "Allow public insert to login_logs" on public.login_logs for insert with check (true);
create policy "Allow public read on login_logs" on public.login_logs for select using (true);

create policy "Allow public insert to users" on public.users for insert with check (true);
create policy "Allow public read on users" on public.users for select using (true);

create policy "Allow public insert to quiz_attempts" on public.quiz_attempts for insert with check (true);
create policy "Allow public read on quiz_attempts" on public.quiz_attempts for select using (true);
