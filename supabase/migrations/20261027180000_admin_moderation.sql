alter table public.tributes
  add column if not exists moderation_status text;

update public.tributes
set moderation_status = case
  when is_approved = true then 'approved'
  else 'pending'
end
where moderation_status is null;

alter table public.tributes
  alter column moderation_status set default 'pending';

alter table public.tributes
  add constraint tributes_moderation_status_check
  check (moderation_status in ('pending', 'approved', 'rejected'));

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.tributes enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "Public can read approved tributes" on public.tributes;
create policy "Public can read approved tributes"
on public.tributes for select
to anon, authenticated
using (moderation_status = 'approved' and is_approved = true);

drop policy if exists "Public can submit pending tributes" on public.tributes;
create policy "Public can submit pending tributes"
on public.tributes for insert
to anon, authenticated
with check (moderation_status = 'pending' and is_approved = false);

drop policy if exists "Admins can read all tributes" on public.tributes;
create policy "Admins can read all tributes"
on public.tributes for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can moderate tributes" on public.tributes;
create policy "Admins can moderate tributes"
on public.tributes for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read own admin record" on public.admin_users;
create policy "Admins can read own admin record"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());
