-- Grant Intelligence™ Supabase Auth Patch v1.1
-- Run this ONCE after Foundation v1.0 and before testing access-code redemption.
--
-- Why this patch exists:
-- Foundation v1.0 protected access_level with a SECURITY DEFINER trigger.
-- That also blocked the secure redeem_access_code() function from changing access_level.
-- This version keeps direct browser users from changing access_level/account_status,
-- while allowing the SECURITY DEFINER redemption function to do so.

create or replace function public.protect_profile_access_level()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Direct PostgREST requests use the "authenticated" role.
  -- Calls executed inside approved SECURITY DEFINER functions execute as the function owner.
  if current_user = 'authenticated' then
    if new.access_level is distinct from old.access_level then
      raise exception 'access_level cannot be changed directly';
    end if;
    if new.account_status is distinct from old.account_status then
      raise exception 'account_status cannot be changed directly';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_access_level on public.profiles;
create trigger trg_protect_profile_access_level
before update on public.profiles
for each row execute function public.protect_profile_access_level();

select 'Grant Intelligence Auth Patch v1.1 installed successfully.' as status;
