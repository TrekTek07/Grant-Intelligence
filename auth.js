const $ = id => document.getElementById(id);
const notice = $('authNotice');

function setNotice(message, ok=true){
  notice.textContent = message;
  notice.className = `notice show ${ok ? 'ok':'bad'}`;
}
function show(which){
  const signup = which === 'signup';
  $('signupTab').classList.toggle('active', signup);
  $('signinTab').classList.toggle('active', !signup);
  $('signupForm').classList.toggle('active', signup);
  $('signinForm').classList.toggle('active', !signup);
  notice.className='notice';
}
$('signupTab').onclick=()=>show('signup');
$('signinTab').onclick=()=>show('signin');

(async()=>{
  const session = await GI.getSession();
  if(session){
    const next = localStorage.getItem('giPostAuthRedirect') || 'unlock.html';
    localStorage.removeItem('giPostAuthRedirect');
    location.replace(next);
  }
})();

$('signupForm').addEventListener('submit', async e=>{
  e.preventDefault();
  try{
    const email=$('signupEmail').value.trim();
    const password=$('signupPassword').value;
    const display_name=$('signupName').value.trim();
    const base = location.href.replace(/auth\.html.*$/,'');
    const {data,error}=await giSupabase.auth.signUp({
      email,password,
      options:{
        data:{display_name},
        emailRedirectTo: base+'auth-callback.html'
      }
    });
    if(error) throw error;
    if(data.session){
      setNotice('Account created and signed in. Continuing…');
      setTimeout(()=>location.href='unlock.html',500);
    } else {
      setNotice('Account created. Check your email and click the verification link. After verification, you will return to Grant Intelligence.');
    }
  }catch(err){ setNotice(err.message || 'Unable to create account.',false); }
});

$('signinForm').addEventListener('submit', async e=>{
  e.preventDefault();
  try{
    const {data,error}=await giSupabase.auth.signInWithPassword({
      email:$('signinEmail').value.trim(),
      password:$('signinPassword').value
    });
    if(error) throw error;
    if(!data.session) throw new Error('No session was created.');
    setNotice('Signed in. Opening secure access…');
    const next = localStorage.getItem('giPostAuthRedirect') || 'unlock.html';
    localStorage.removeItem('giPostAuthRedirect');
    setTimeout(()=>location.href=next,350);
  }catch(err){ setNotice(err.message || 'Unable to sign in.',false); }
});
