let GI_WORKSPACE_PROFILE=null;
let GI_WORKSPACE_PROJECT=null;

async function loadWorkspaceIdentity(){
  const session=await GI.requireSession('workspace.html');
  if(!session) return false;
  GI_WORKSPACE_PROFILE=await GI.getProfile();
  if(!GI_WORKSPACE_PROFILE || !['demo','realtest','paid','admin'].includes(GI_WORKSPACE_PROFILE.access_level)){
    location.replace('unlock.html'); return false;
  }

  let projectId=localStorage.getItem('giCurrentProjectId');
  let query=giSupabase.from('projects').select('*').eq('user_id',session.user.id).order('created_at',{ascending:false}).limit(1);
  if(projectId) query=giSupabase.from('projects').select('*').eq('id',projectId).eq('user_id',session.user.id).limit(1);
  const {data,error}=await query;
  if(error) throw error;
  GI_WORKSPACE_PROJECT=data?.[0]||null;

  const level=GI_WORKSPACE_PROFILE.access_level;
  const isDemo=level==='demo';
  const realTest=level==='realtest';
  document.getElementById('workspaceProjectName').textContent=GI_WORKSPACE_PROJECT?.project_name || 'Your Grant Intelligence Workspace';
  document.getElementById('workspaceSubtitle').textContent=
    `${session.user.email} • ${GI_WORKSPACE_PROJECT?.project_stage || 'Project intake pending'}`;
  document.getElementById('demoScore').textContent=
    GI_WORKSPACE_PROJECT?.readiness_score ?? localStorage.getItem('giLatestScore') ?? '—';
  document.getElementById('workspaceBadge').textContent=
    isDemo?'Demo Mode':realTest?'Real Test Mode':level==='paid'?'Paid Customer':'Admin';
  document.getElementById('sideMode').innerHTML=
    isDemo?'Demo mode<br>Supabase active • No Dify':
    realTest?'Real Test mode<br>Supabase active • Dify connection next':
    'Live mode<br>Supabase active';
  document.getElementById('modeStrip').textContent=
    isDemo
      ? 'DEMONSTRATION MODE — Your account and project are real Supabase records, but module previews use sample data and do not consume Dify credits.'
      : realTest
        ? 'REAL TEST MODE — This project uses real information saved to Supabase. The secure Dify connection is the next integration step; this v7.3 build does not call Dify yet.'
        : 'LIVE PROJECT MODE — Your account and project are stored securely in Supabase.';
  return true;
}

document.addEventListener('DOMContentLoaded',()=>{
  const signOut=document.getElementById('signOutLink');
  if(signOut) signOut.onclick=async e=>{e.preventDefault();await GI.signOut();};
});

loadWorkspaceIdentity().catch(err=>{
  console.error(err);
  const strip=document.getElementById('modeStrip');
  if(strip) strip.textContent='Workspace could not load from Supabase: '+err.message;
});

const modules=[
['01','Organization Intelligence','Turn your idea or organization into a structured profile.'],
['02','Grant Readiness','Identify readiness strengths, missing documents, and preparation gaps.'],
['03','Funding Intelligence','Define funding strategy, priorities, and realistic funding paths.'],
['04','Opportunity Intelligence','Review a ranked portfolio of potential funding opportunities.'],
['05','Funder Alignment','Compare selected funders against mission, eligibility, and readiness.'],
['06','Proposal Development','Build requirements, narrative, budget, evaluation, and compliance plans.'],
['07','Proposal Writing','Create an evidence-governed planning draft and quality review.']
];
const sampleReports={
'Organization Intelligence':`SAMPLE ORGANIZATION INTELLIGENCE REPORT\n\nStage: Early Development\nMission Direction: Community health and wellness\nTarget Population: Underserved families\nStrengths: Clear desire to help, relevant skills, preliminary project concept\nDevelopment Needs: Legal structure, governance, operating budget, measurable outcomes\n\nThis is sample demonstration content only.`,
'Grant Readiness':`SAMPLE GRANT READINESS REPORT\n\nOverall Classification: Developing Readiness\nStrengths: Mission clarity, defined population, preliminary program concept\nPriority Gaps: Operating budget, project budget, evaluation plan, supporting documents\nRecommended Action: Complete foundational planning before submission.`,
'Funding Intelligence':`SAMPLE FUNDING INTELLIGENCE REPORT\n\nRecommended Funding Categories:\n• Health education\n• Community wellness\n• Youth development\n• Capacity building\n\nStrategy: Begin with smaller planning, pilot, and capacity-building opportunities while organizational readiness improves.`,
'Opportunity Intelligence':`SAMPLE OPPORTUNITY INTELLIGENCE REPORT\n\nFive illustrative opportunities are displayed below for demonstration. In production, the website will show the actual funder portfolio returned by Module 04.`,
'Funder Alignment':`SAMPLE FUNDER ALIGNMENT REPORT\n\nSelected Funder: Example Health Foundation\nCompatibility: Strong Preliminary Match\nMission Alignment: Strong\nPopulation Alignment: Strong\nGeographic Alignment: Requires Current Verification\nEligibility: Requires Current Verification\nRecommended Next Step: Verify current application pathway before proposal development.`,
'Proposal Development':`SAMPLE PROPOSAL DEVELOPMENT REPORT\n\nPlanning Sections:\n• Executive Summary\n• Needs Assessment\n• Program Design\n• Goals and Objectives\n• Implementation Plan\n• Evaluation Plan\n• Sustainability Plan\n• Budget Narrative\n\nMissing evidence remains clearly identified before drafting.`,
'Proposal Writing':`SAMPLE PROPOSAL WRITING OUTPUT\n\nThe paid workflow produces an evidence-governed planning proposal, a Proposal Quality Review, and a transfer package for refinement. Unsupported claims remain labeled rather than being presented as facts.`
};
const list=document.getElementById('moduleList');
modules.forEach(([n,title,desc],idx)=>{const el=document.createElement('div');el.className='module';el.innerHTML=`<div class="module-num">${n}</div><div class="module-title"><strong>${title}</strong><span>${desc}</span></div><div class="module-actions"><button class="small-btn primary">View Sample</button></div>`;el.querySelector('button').onclick=()=>openReport(title);list.appendChild(el)});
const opps=[['Community Health Foundation','91'],['Regional Wellness Fund','87'],['Youth Opportunity Initiative','84'],['Healthy Communities Fund','81'],['Local Community Foundation','78']];
const ol=document.getElementById('opportunityList');opps.forEach(([name,score],idx)=>{const el=document.createElement('label');el.className='opp';el.innerHTML=`<div><strong><input type="checkbox" class="oppCheck" value="${name}" ${idx===0?'checked':''}> ${name}</strong><br><small>Sample opportunity • Current eligibility requires verification</small></div><span class="score-chip">${score}%</span>`;ol.appendChild(el)});
function openReport(title){document.getElementById('reportTitle').textContent=title+' — Sample';document.getElementById('reportContent').textContent=sampleReports[title]||'';document.getElementById('reportViewer').classList.add('active');document.getElementById('reportViewer').scrollIntoView({behavior:'smooth',block:'start'})}
document.getElementById('closeReport').onclick=()=>document.getElementById('reportViewer').classList.remove('active');
document.getElementById('continueAlignment').onclick=()=>{const picks=[...document.querySelectorAll('.oppCheck:checked')].map(x=>x.value);if(!picks.length){alert('Select at least one opportunity.');return}openReport('Funder Alignment');document.getElementById('reportContent').textContent=`SAMPLE FUNDER ALIGNMENT REPORT\n\nSelected Opportunities:\n${picks.map(x=>'• '+x).join('\n')}\n\nThe real Module 05 would evaluate your selected funders against your organization profile, eligibility, readiness, award strategy, and proposal strategy.`};
function downloadSample(name){const text=`Grant Intelligence™\n${name}\n\nThis is a static demonstration download. The production version will save and provide the actual report generated for the customer.`;const b=new Blob([text],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name.replace(/\s+/g,'_')+'_SAMPLE.txt';a.click();URL.revokeObjectURL(a.href)}
window.downloadSample=downloadSample;
document.getElementById('downloadTxt').onclick=()=>downloadSample(document.getElementById('reportTitle').textContent);
