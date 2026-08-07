const $ = id => document.getElementById(id);
const latest = localStorage.getItem('giLatestScore');
$('carryScore').textContent = latest !== null ? `${latest} / 100` : 'Not available';

let currentSession=null;
(async()=>{
  try{
    currentSession=await GI.requireSession('unlock.html');
    if(!currentSession) return;
    const profile=await GI.getProfile();
    $('accountStatus').innerHTML=`Signed in as <strong>${currentSession.user.email}</strong><br>Current access: <strong>${profile?.access_level || 'none'}</strong>`;
    if(profile && ['demo','realtest','paid','admin'].includes(profile.access_level)){
      localStorage.setItem('giAccessLevel',profile.access_level);
    }
  }catch(err){
    $('accountStatus').textContent='Unable to read your account: '+err.message;
  }
})();

$('codeBtn').addEventListener('click', async () => {
  const code = $('accessCode').value.trim().toUpperCase();
  const notice = $('codeNotice');
  if(!code){
    notice.className='notice bad'; notice.textContent='Enter an access code.'; return;
  }
  try{
    const session=await GI.requireSession('unlock.html');
    if(!session) return;
    $('codeBtn').disabled=true;
    $('codeBtn').textContent='Validating…';
    const {data,error}=await giSupabase.rpc('redeem_access_code',{p_code:code});
    if(error) throw error;
    if(!data?.success) throw new Error(data?.message || 'Access code was not accepted.');
    const level=data.access_level;
    localStorage.setItem('giAccessGranted','true');
    localStorage.setItem('giAccessMethod','supabase_access_code');
    localStorage.setItem('giAccessCodeUsed',code);
    localStorage.setItem('giAccessLevel',level);
    localStorage.setItem('giAccessGrantedAt',new Date().toISOString());
    notice.className='notice ok';
    notice.textContent=`Access granted: ${level.toUpperCase()} mode. Opening Module 00…`;
    setTimeout(()=>location.href='module00.html',550);
  }catch(err){
    notice.className='notice bad';
    notice.textContent=err.message || 'Unable to validate access code.';
  }finally{
    $('codeBtn').disabled=false;
    $('codeBtn').textContent='Unlock Module 00';
  }
});

$('purchaseBtn').addEventListener('click', () => {
  alert('Paid checkout is not connected yet. The paid mode will use the same Supabase account and workspace after payment verification.');
});
