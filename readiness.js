const questions = [
  {id:'stage',cat:'Foundation',weight:6,q:'Which statement best describes where you are today?',help:'You can start with nothing more than an idea.',options:[['I have an idea and want to explore what I could build',0],['I have written notes or a rough concept',2],['I am already doing some of this work informally',3],['I have a new business, nonprofit, project, or program',5],['I have an established organization or program',6]]},
  {id:'problem',cat:'Foundation',weight:6,q:'How clearly can you describe the problem or need you want to address?',options:[['I am still figuring that out',0],['I have a general idea of the problem',2],['I can explain the problem clearly',4],['I can explain the problem and why it matters',6]]},
  {id:'mission',cat:'Foundation',weight:5,q:'Do you have a clear mission, purpose statement, or one-sentence description of what you want to accomplish?',options:[['No',0],['I have ideas but nothing written',2],['I have a draft',4],['Yes, it is clearly written',5]]},
  {id:'population',cat:'Program',weight:5,q:'Do you know who your project, service, or idea is intended to help?',options:[['Not yet',0],['Generally',2],['Yes, I can identify the group',4],['Yes, I can clearly describe the people and their needs',5]]},
  {id:'geography',cat:'Program',weight:4,q:'Do you know the geographic area your work would serve?',options:[['Not yet',0],['I have a general area in mind',2],['Yes, it is clearly defined',4]]},
  {id:'program',cat:'Program',weight:6,q:'How clearly can you describe what you would actually do with funding?',options:[['I only have the basic idea',0],['I can describe some activities',2],['I have a fairly clear program or service concept',4],['I can clearly explain the activities, services, and intended benefit',6]]},
  {id:'needEvidence',cat:'Program',weight:5,q:'Do you have any information showing that the problem or community need exists?',help:'This could be observations, community feedback, existing reports, statistics, or lived experience.',options:[['Not yet',0],['I have informal observations or experience',2],['I have some documented information',4],['I have strong documented evidence from multiple sources',5]]},
  {id:'outcomes',cat:'Program',weight:6,q:'Have you identified what should change or improve because of your project?',options:[['Not yet',0],['I have general hopes for the project',2],['I have clear intended outcomes',4],['I have measurable outcomes or success indicators',6]]},
  {id:'leadership',cat:'Capacity',weight:5,q:'Who would help lead or carry out the work?',options:[['It is currently just me / I have not decided',1],['I have one or two people who may help',2],['I have a small team, advisors, or committed helpers',4],['I have an established leadership or operating team',5]]},
  {id:'legal',cat:'Organization',weight:6,q:'What is your current legal or organizational status?',help:'Having no formal organization does not disqualify you from this process.',options:[['I am an individual with an idea',0],['I am exploring a business or nonprofit structure',2],['Formation is in progress',3],['I have a registered business or organization',5],['I have an established eligible nonprofit or other grant-ready structure',6]]},
  {id:'financials',cat:'Financial',weight:6,q:'Do you currently have financial records for the work or organization?',options:[['Not applicable yet / no records',0],['Basic records or receipts',2],['Organized income and expense records',4],['Current financial statements or equivalent records',6]]},
  {id:'opBudget',cat:'Financial',weight:6,q:'Do you have an annual operating budget?',options:[['No / not applicable yet',0],['I have a rough estimate',2],['I have a draft budget',4],['Yes, it is current and documented',6]]},
  {id:'projectBudget',cat:'Financial',weight:6,q:'Could you estimate how much your proposed project would cost?',options:[['Not yet',0],['I could make a rough estimate',2],['I have identified major cost categories',4],['I have a detailed project budget',6]]},
  {id:'accounting',cat:'Financial',weight:4,q:'How prepared are you to track and document how grant money is spent?',options:[['I have not considered this yet',0],['I understand that records would be required',1],['I have a basic bookkeeping process or plan',3],['I have an established accounting/bookkeeping system',4]]},
  {id:'documents',cat:'Documentation',weight:5,q:'How much supporting documentation do you already have?',help:'Examples: mission statement, resume, business plan, program description, budget, board list, policies, financial records.',options:[['Almost none—and I am starting from an idea',0],['A few notes or a resume',1],['Several useful documents',3],['Most core documents are organized and current',5]]},
  {id:'partners',cat:'Capacity',weight:5,q:'Do other people or organizations support, advise, refer to, or potentially partner with your idea or work?',options:[['Not yet',0],['I have informal contacts or supporters',2],['I have interested collaborators',3],['I have documented or active partnerships/support',5]]},
  {id:'fundingGoal',cat:'Funding',weight:5,q:'How clear are you about what funding would pay for?',options:[['I am still exploring possibilities',0],['I have a general use in mind',2],['I can identify the main project costs or needs',4],['I have a specific funding request and purpose',5]]},
  {id:'management',cat:'Funding',weight:9,q:'How prepared are you to manage grant responsibilities such as deadlines, documentation, reporting, and follow-up?',options:[['I am new to all of this',0],['I am willing to learn and follow a process',3],['I understand the basic responsibilities',5],['I have some grant/project management experience',7],['I have an established grant-management process',9]]}
];

const categoryMax = questions.reduce((a,q)=>(a[q.cat]=(a[q.cat]||0)+q.weight,a),{});
let index=0;
let answers={};
const intro=document.getElementById('assessmentIntro');
const quiz=document.getElementById('assessmentQuiz');
const results=document.getElementById('assessmentResults');
const card=document.getElementById('questionCard');
const nextBtn=document.getElementById('nextQuestion');
const prevBtn=document.getElementById('prevQuestion');

function renderQuestion(){
  const q=questions[index];
  document.getElementById('questionCounter').textContent=`Question ${index+1} of ${questions.length}`;
  const pct=Math.round(((index+1)/questions.length)*100);
  document.getElementById('progressPercent').textContent=`${pct}%`;
  document.getElementById('progressBar').style.width=`${pct}%`;
  card.innerHTML=`<div class="question-number">${String(index+1).padStart(2,'0')}</div><div class="eyebrow">${q.cat.toUpperCase()} READINESS</div><h2>${q.q}</h2>${q.help?`<p class="question-help">${q.help}</p>`:''}<div class="answer-options">${q.options.map((o,i)=>`<label class="answer-option ${answers[q.id]?.i===i?'selected':''}"><input type="radio" name="answer" value="${i}" ${answers[q.id]?.i===i?'checked':''}><span>${o[0]}</span><i></i></label>`).join('')}</div>`;
  card.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{
    const i=Number(input.value); answers[q.id]={i,score:q.options[i][1],label:q.options[i][0]}; renderQuestion();
  }));
  prevBtn.style.visibility=index===0?'hidden':'visible';
  nextBtn.disabled=!answers[q.id];
  nextBtn.textContent=index===questions.length-1?'See My Score':'Next Question';
}

document.getElementById('startAssessment').addEventListener('click',()=>{intro.hidden=true;quiz.hidden=false;renderQuestion();window.scrollTo({top:0,behavior:'smooth'});});
prevBtn.addEventListener('click',()=>{if(index>0){index--;renderQuestion();window.scrollTo({top:80,behavior:'smooth'});}});
nextBtn.addEventListener('click',()=>{if(!answers[questions[index].id])return;if(index<questions.length-1){index++;renderQuestion();window.scrollTo({top:80,behavior:'smooth'});}else showResults();});

function tier(score){
  if(score>=85)return ['Strong Grant Readiness','You already have many of the building blocks funders commonly expect. Your next step is to verify funder-specific eligibility, strengthen evidence, and prepare a targeted funding strategy.','You appear well positioned for deeper funder research and proposal development, although every opportunity still requires its own eligibility and documentation review.'];
  if(score>=70)return ['Nearly Grant Ready','You have a strong foundation, but a few gaps may keep an otherwise good opportunity from becoming a strong application.','You are close. Focus on the weakest categories below before treating any proposal as submission-ready.'];
  if(score>=50)return ['Developing Grant Readiness','You have meaningful pieces in place. The opportunity now is to turn your idea or organization into a more complete, documented funding story.','You are not starting over—you are building. A focused action plan can move several of these categories forward quickly.'];
  if(score>=30)return ['Emerging Funding Potential','Your idea has begun to take shape, but the foundation needs more definition before grant applications should become the main focus.','This stage is ideal for clarifying the problem, project, people served, costs, and organizational path before spending time on applications.'];
  return ['Idea & Foundation Stage','You are early in the process—and that is exactly why Grant Intelligence™ can be useful. A good funding journey can start with an idea, a skill, and a willingness to help.','Your next goal is not “write a grant.” It is to turn your idea into a clear project with a defined purpose, population, plan, and path to eligibility.'];
}
function showResults(){
  quiz.hidden=true;results.hidden=false;
  const total=questions.reduce((sum,q)=>sum+(answers[q.id]?.score||0),0);
  const [level,msg,meaning]=tier(total);
  document.getElementById('finalScore').textContent=total;
  localStorage.setItem('gi_readiness_score', String(total));
  localStorage.setItem('gi_readiness_level', level);
  document.getElementById('readinessLevel').textContent=level;
  document.getElementById('readinessMessage').textContent=msg;
  document.getElementById('resultMeaning').textContent=meaning;
  document.getElementById('resultIntro').textContent=`You scored ${total} out of 100. This is a preliminary planning score—not a determination of grant eligibility.`;
  const catScores={}; questions.forEach(q=>catScores[q.cat]=(catScores[q.cat]||0)+(answers[q.id]?.score||0));
  document.getElementById('categoryBars').innerHTML=Object.keys(categoryMax).map(cat=>{const p=Math.round(catScores[cat]/categoryMax[cat]*100);return `<div class="category-row"><div><strong>${cat}</strong><span>${p}%</span></div><div class="category-track"><i style="width:${p}%"></i></div></div>`}).join('');
  const recs=[];
  const add=(title,text,priority='Build')=>recs.push({title,text,priority});
  if((answers.problem?.score||0)<4)add('Clarify the problem you want to solve','Write one clear paragraph describing the problem, who experiences it, and why solving it matters.');
  if((answers.mission?.score||0)<4)add('Turn your idea into a purpose statement','Create a one- or two-sentence mission or purpose statement that explains what you want to accomplish.');
  if((answers.population?.score||0)<4)add('Define who you want to help','Describe the specific people, community, or group your idea is intended to benefit.');
  if((answers.program?.score||0)<4)add('Define what the project would actually do','List the services, activities, or resources you would provide if funding became available.');
  if((answers.needEvidence?.score||0)<4)add('Gather evidence of need','Collect credible information—community feedback, existing reports, statistics, or documented experience—that supports the need you want to address.');
  if((answers.outcomes?.score||0)<4)add('Define success','Identify what you hope will change for participants or the community and how you might know that change occurred.');
  if((answers.legal?.score||0)<5)add('Choose the right organizational path','Explore whether your idea should operate through a nonprofit, business, fiscal sponsor, partnership, or another eligible structure.','Structure');
  if((answers.opBudget?.score||0)<4)add('Build a basic operating budget','Even a simple estimate of expected income and expenses makes the project easier to evaluate and fund.','Financial');
  if((answers.projectBudget?.score||0)<4)add('Estimate the project cost','List the major things the project would need and create a preliminary cost estimate.','Financial');
  if((answers.documents?.score||0)<3)add('Create your core project file','Start collecting your mission, resume, project description, budgets, organizational documents, and other supporting materials in one place.','Documentation');
  if((answers.partners?.score||0)<3)add('Build your support network','Identify people or organizations that may advise, refer, collaborate, provide space, or support the project.','Capacity');
  if((answers.fundingGoal?.score||0)<4)add('Clarify the funding request','Define what money would allow you to do that you cannot do today.','Funding');
  if((answers.management?.score||0)<5)add('Prepare for grant management','Learn the basic responsibilities that follow an award: documentation, deadlines, spending records, outcomes, and reporting.','Funding');
  if(recs.length<4)add('Verify real funder requirements','Your preliminary score is strong enough to move into funder-specific research. Eligibility, deadlines, award ranges, and application rules must still be verified.','Next');
  document.getElementById('recommendations').innerHTML=recs.slice(0,7).map((r,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><small>${r.priority}</small><h3>${r.title}</h3><p>${r.text}</p></div></article>`).join('');
  window.scrollTo({top:0,behavior:'smooth'});
}

document.getElementById('retakeAssessment').addEventListener('click',()=>{answers={};index=0;results.hidden=true;intro.hidden=false;window.scrollTo({top:0,behavior:'smooth'});});
// The prototype paid-experience button opens demo.html. No checkout or Dify call is made.
