const $ = id => document.getElementById(id);
const notice = $('authNotice');
const button = $('emailBtn');

function setNotice(message, ok=true){
  notice.textContent = message;
  notice.className = `notice show ${ok ? 'ok' : 'bad'}`;
}

(async()=>{
  try{
    const session = await GI.getSession();
    if(session){
      const next = localStorage.getItem('giPostAuthRedirect') || 'unlock.html';
      localStorage.removeItem('giPostAuthRedirect');
      location.replace(next);
    }
  }catch(err){
    console.error(err);
  }
})();

$('emailForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const email = $('email').value.trim();
  if(!email) return;

  button.disabled = true;
  button.textContent = 'Sending secure link…';

  try{
    const base = location.href.replace(/auth\.html.*$/,'');
    const { error } = await giSupabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: base + 'auth-callback.html'
      }
    });

    if(error) throw error;

    setNotice(
      'Secure sign-in link sent. Check your email, then click the verification link to continue to Grant Intelligence.',
      true
    );
    $('email').value = '';
  }catch(err){
    setNotice(err.message || 'Unable to send the secure sign-in link.', false);
  }finally{
    button.disabled = false;
    button.textContent = 'Send Secure Sign-In Link';
  }
});