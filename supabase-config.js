// Grant Intelligence™ Supabase browser configuration.
// The publishable key is intentionally browser-safe.
// NEVER place a secret/service-role key in this file.
window.GI_SUPABASE_URL = "https://wuagmhkqzrugizbqkrgy.supabase.co";
window.GI_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_yPwdvjVr1wtJKn0XbFQ4Qw_7tKiwBas";

if (!window.supabase) {
  throw new Error('Supabase JavaScript library did not load.');
}

window.giSupabase = window.supabase.createClient(
  window.GI_SUPABASE_URL,
  window.GI_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

window.GI = window.GI || {};

window.GI.getSession = async function() {
  const { data, error } = await window.giSupabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

window.GI.requireSession = async function(next = window.location.pathname.split('/').pop() || 'index.html') {
  const session = await window.GI.getSession();
  if (!session) {
    localStorage.setItem('giPostAuthRedirect', next);
    window.location.replace('auth.html');
    return null;
  }
  return session;
};

window.GI.getProfile = async function() {
  const session = await window.GI.getSession();
  if (!session) return null;
  const { data, error } = await window.giSupabase
    .from('profiles')
    .select('id,email,display_name,access_level,account_status,created_at')
    .eq('id', session.user.id)
    .single();
  if (error) throw error;
  return data;
};

window.GI.signOut = async function() {
  await window.giSupabase.auth.signOut();
  [
    'giCurrentProjectId',
    'giAccessLevel',
    'giAccessGranted',
    'giAccessMethod',
    'giAccessCodeUsed',
    'giModule00Complete'
  ].forEach(k => localStorage.removeItem(k));
  window.location.href = 'index.html';
};
