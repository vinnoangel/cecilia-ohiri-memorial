do $$
begin
  alter publication supabase_realtime add table public.tributes;
exception
  when duplicate_object then null;
end
$$;
