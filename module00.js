const $=id=>document.getElementById(id);
const latest=localStorage.getItem('giLatestScore');
$('startScore').textContent=latest!==null?`${latest} / 100`:'Not assessed';
let session=null, profile=null;

(async()=>{
  try{
    session=await GI.requireSession('module00.html');
    if(!session) return;
    profile=await GI.getProfile();
    if(!profile || !['demo','realtest','paid','admin'].includes(profile.access_level)){
      location.replace('unlock.html'); return;
    }
    localStorage.setItem('giAccessLevel',profile.access_level);
    const difyText = profile.access_level==='demo'
      ? 'Demo mode — sample workflow only; Dify will not be called.'
      : profile.access_level==='realtest'
        ? 'Real Test mode — real project data is saved now. Dify connection will be enabled in the next integration step.'
        : 'Live access mode.';
    $('modeStatus').innerHTML=`Signed in as <strong>${session.user.email}</strong><br>Access level: <strong>${profile.access_level}</strong><br>${difyText}`;
  }catch(err){
    $('modeStatus').textContent='Unable to load account: '+err.message;
  }
})();

$('intakeForm').addEventListener('submit', async e=>{
  e.preventDefault();
  try{
    if(!session) session=await GI.requireSession('module00.html');
    if(!session) return;
    if(!profile) profile=await GI.getProfile();

    const accessMode = profile.access_level==='admin' ? 'realtest' : profile.access_level;
    const row={
      user_id:session.user.id,
      project_name:$('projectName').value.trim(),
      organization_name:$('organizationName').value.trim() || null,
      project_stage:$('stage').value,
      project_description:$('projectDescription').value.trim(),
      mission_statement:$('mission').value.trim() || null,
      primary_goal:$('goal').value,
      access_mode:accessMode,
      readiness_score:latest!==null?Number(latest):null,
      current_module:0,
      status:'active'
    };

    const {data:project,error}=await giSupabase.from('projects').insert(row).select('*').single();
    if(error) throw error;

    const latestAssessmentRaw=localStorage.getItem('giLatestAssessment');
    if(latestAssessmentRaw){
      try{
        const a=JSON.parse(latestAssessmentRaw);
        const {error:aerr}=await giSupabase.from('assessments').insert({
          user_id:session.user.id,
          project_id:project.id,
          assessment_type:'free_readiness',
          score:a.score,
          category_scores:a.categoryScores||{},
          answers:a.answers||{},
          recommendations:a.recommendations||[]
        });
        if(aerr) console.warn('Assessment save warning:',aerr);
      }catch(ex){ console.warn('Assessment parse warning:',ex); }
    }

    const {error:merr}=await giSupabase.from('module_results').upsert({
      user_id:session.user.id,
      project_id:project.id,
      module_number:0,
      module_name:'Client Intake & Project Creation',
      status:'completed',
      report_text:'Module 00 intake completed.',
      output_data:{
        project_stage:row.project_stage,
        project_name:row.project_name,
        organization_name:row.organization_name,
        project_description:row.project_description,
        mission_statement:row.mission_statement,
        primary_goal:row.primary_goal,
        readiness_score:row.readiness_score,
        access_mode:row.access_mode
      },
      completed_at:new Date().toISOString()
    },{onConflict:'project_id,module_number'});
    if(merr) console.warn('Module 00 result warning:',merr);

    await giSupabase.from('activity_log').insert({
      user_id:session.user.id,
      project_id:project.id,
      event_type:'module00_completed',
      event_data:{access_mode:row.access_mode,readiness_score:row.readiness_score}
    });

    localStorage.setItem('giCurrentProjectId',project.id);
    localStorage.setItem('giModule00Complete','true');
    location.href='workspace.html?mode=intake';
  }catch(err){
    alert('Module 00 could not be saved: '+(err.message||err));
    console.error(err);
  }
});

$('exitBtn').addEventListener('click',async()=>{
  if(confirm('Sign out of Grant Intelligence?')){
    await GI.signOut();
  }
});
