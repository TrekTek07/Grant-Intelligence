(async()=>{
  const status=document.getElementById('status');
  try{
    const params=new URLSearchParams(location.search);
    const code=params.get('code');
    if(code){
      const {error}=await giSupabase.auth.exchangeCodeForSession(code);
      if(error && !/already/i.test(error.message||'')) throw error;
    }
    // Give detectSessionInUrl a moment in implicit-flow cases.
    let session=(await giSupabase.auth.getSession()).data.session;
    if(!session){
      await new Promise(r=>setTimeout(r,600));
      session=(await giSupabase.auth.getSession()).data.session;
    }
    if(!session){
      status.textContent='Email verified. Please sign in to continue.';
      setTimeout(()=>location.href='auth.html',900);
      return;
    }
    status.textContent='Email verified. Opening Grant Intelligence…';
    setTimeout(()=>location.href='unlock.html',600);
  }catch(err){
    status.textContent='Verification completed, but the session could not be opened automatically. Please sign in.';
    console.error(err);
    setTimeout(()=>location.href='auth.html',1400);
  }
})();