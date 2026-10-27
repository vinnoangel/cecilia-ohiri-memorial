create or replace function public.tribute_exists_for_identity(
  p_name text,
  p_relationship text
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tributes
    where lower(regexp_replace(trim(name), '\s+', ' ', 'g')) =
          lower(regexp_replace(trim(p_name), '\s+', ' ', 'g'))
      and lower(regexp_replace(trim(relationship), '\s+', ' ', 'g')) =
          lower(regexp_replace(trim(p_relationship), '\s+', ' ', 'g'))
  );
$$;

revoke all on function public.tribute_exists_for_identity(text, text)
from public;

grant execute on function public.tribute_exists_for_identity(text, text)
to anon, authenticated;

create or replace function public.prevent_duplicate_tribute_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.tribute_exists_for_identity(new.name, new.relationship) then
    raise exception using
      errcode = '23514',
      message = 'A tribute from this name and relationship already exists.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_duplicate_tribute_identity on public.tributes;

create trigger prevent_duplicate_tribute_identity
before insert on public.tributes
for each row
execute function public.prevent_duplicate_tribute_identity();
