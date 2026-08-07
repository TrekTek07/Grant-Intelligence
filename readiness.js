const questions = [
  {cat:'Starting Point', q:'Which best describes where you are today?', help:'There is no wrong starting point.', opts:[['I only have an idea right now',1],['I have notes or a rough concept',2],['I have a defined project or service idea',3],['I already operate a business, nonprofit, group, or program',4]]},
  {cat:'Purpose', q:'How clearly can you explain the problem or need you want to address?', opts:[['I am still figuring that out',1],['I know the general issue',2],['I can explain the need fairly clearly',3],['I have a clearly documented need or problem statement',4]]},
  {cat:'Purpose', q:'Do you have a mission statement?', opts:[['No',1],['I have ideas but nothing written',2],['I have a draft',3],['Yes, it is written and current',4]]},
  {cat:'Purpose', q:'Do you have a vision statement?', opts:[['No',1],['I have a general vision in mind',2],['I have a draft',3],['Yes, it is written and current',4]]},
  {cat:'Project Clarity', q:'How clearly do you know who you want to help or serve?', opts:[['I am not sure yet',1],['I have a broad audience in mind',2],['I know the main population or community',3],['The population and service area are clearly defined',4]]},
  {cat:'Project Clarity', q:'How developed is the project, program, product, or service you want funding for?', opts:[['Idea only',1],['Rough concept',2],['Basic activities are outlined',3],['Program design and activities are documented',4]]},
  {cat:'Organization', q:'Do you currently have a legal organization or business structure?', opts:[['No, and I may not know what I need yet',1],['I am exploring or forming one',2],['Yes, but some registrations are still in progress',3],['Yes, the structure is established',4]]},
  {cat:'Organization', q:'If your project needs leadership or governance, how developed is it?', opts:[['Not established',1],['I have potential people in mind',2],['A leadership team or board is forming',3],['Leadership / governance is established',4]]},
  {cat:'Planning', q:'Do you have a business plan, project plan, or strategic plan?', opts:[['No',1],['Only notes or an outline',2],['I have a basic draft',3],['Yes, I have a working plan',4]]},
  {cat:'Financial', q:'Do you know approximately what your project would cost?', opts:[['No',1],['I have a rough idea',2],['I have estimated major costs',3],['I have a written project budget',4]]},
  {cat:'Financial', q:'Do you have an operating budget or basic financial picture for your organization/project?', opts:[['No',1],['Not yet, but I know some costs/revenue',2],['I have a basic budget',3],['Yes, it is documented and current',4]]},
  {cat:'Financial', q:'Do you have financial records or statements available?', opts:[['No / not applicable yet',1],['I have some records',2],['Records are organized but not formalized',3],['Yes, current statements or equivalent records are available',4]]},
  {cat:'Evidence', q:'Can you describe what success would look like for the people or community you want to help?', opts:[['Not yet',1],['Generally',2],['Yes, I can describe several outcomes',3],['Yes, measurable outcomes are documented',4]]},
  {cat:'Evidence', q:'Do you have evidence that the need exists?', opts:[['No evidence collected yet',1],['Personal/community experience only',2],['Some data, feedback, or research',3],['Strong documented evidence is available',4]]},
  {cat:'Capacity', q:'Who would actually carry out the work?', opts:[['I do not know yet',1],['Primarily me',2],['I have possible helpers or collaborators',3],['Roles, staff, volunteers, or partners are identified',4]]},
  {cat:'Capacity', q:'Do you currently have partnerships or community relationships that could support the project?', opts:[['No',1],['Not yet, but I know who I may approach',2],['I have informal relationships',3],['Yes, active partnerships or support exist',4]]},
  {cat:'Grant Experience', q:'How much experience do you have with grants?', opts:[['None',1],['I have researched grants',2],['I have applied before',3],['I or my organization have managed grant funding',4]]},
  {cat:'Momentum', q:'How willing are you to work on the missing pieces needed to become more grant-ready?', opts:[['I am only exploring',1],['I am interested but unsure where to start',2],['I am ready to work through a plan',3],['I am ready to take action now',4]]}
];

let index = 0;
let answers = Array(questions.length).fill(null);
const intro = document.getElementById('assessmentIntro');
const quiz = document.getElementById('assessmentQuiz');
const results = document.getElementById('assessmentResults');
const card = document.getElementById('questionCard');
const next = document.getElementById('nextQuestion');
const prev = document.getElementById('prevQuestion');

function renderQuestion(){
  const item=questions[index];
  document.getElementById('questionCounter').textContent=`Question ${index+1} of ${questions.length}`;
  const pct=Math.round(((index+1)/questions.length)*100);
  document.getElementById('progressPercent').textContent=`${pct}%`;
  document.getElementById('progressBar').style.width=`${pct}%`;
  card.innerHTML=`<span class="q-cat">${item.cat.toUpperCase()}</span><h2>${item.q}</h2>${item.help?`<p>${item.help}</p>`:''}<div class="answer-options">${item.opts.map((o,i)=>`<label class="answer-option ${answers[index]===i?'selected':''}"><input type="radio" name="answer" value="${i}" ${answers[index]===i?'checked':''}><span>${o[0]}</span></label>`).join('')}</div>`;
  card.querySelectorAll('input').forEach(el=>el.addEventListener('change',e=>{answers[index]=Number(e.target.value);renderQuestion()}));
  prev.disabled=index===0;
  next.disabled=answers[index]===null;
  next.textContent=index===questions.length-1?'See My Score':'Next Question';
}

function scoreAssessment(){
  let points=0,max=questions.length*4;
  const cats={};
  questions.forEach((q,i)=>{const p=q.opts[answers[i]][1];points+=p;if(!cats[q.cat])cats[q.cat]={p:0,m:0};cats[q.cat].p+=p;cats[q.cat].m+=4});
  const raw=(points-questions.length)/(max-questions.length)*100;
  const score=Math.max(0,Math.min(100,Math.round(raw)));
  return {score,cats};
}

function recsFor(cats){
  const labels={
    'Starting Point':['Clarify your starting idea','Write down the problem you care about, who you hope to help, and what you would like to change.'],
    'Purpose':['Strengthen your mission and vision','Turn your interests into simple mission and vision statements you can refine over time.'],
    'Project Clarity':['Define the project','Describe the people you want to serve, the basic activities, and the change you hope to create.'],
    'Organization':['Build the organizational foundation','Determine what legal or organizational structure fits the opportunity you eventually choose.'],
    'Planning':['Create a starter plan','Build a simple business/project plan so your idea has a structure funders can understand.'],
    'Financial':['Develop the financial picture','Estimate project costs and begin a basic project and operating budget.'],
    'Evidence':['Document the need and outcomes','Gather credible information about the need and define how you will recognize progress.'],
    'Capacity':['Identify people and partners','List the roles, helpers, advisors, and community relationships that could strengthen delivery.'],
    'Grant Experience':['Learn the grant pathway','Focus first on fit, eligibility, documentation, and readiness rather than simply finding applications.'],
    'Momentum':['Turn interest into a sequence of actions','Choose a few manageable readiness tasks and complete them in priority order.']
  };
  return Object.entries(cats).map(([cat,v])=>({cat,pct:Math.round(v.p/v.m*100),...{title:labels[cat][0],text:labels[cat][1]}})).sort((a,b)=>a.pct-b.pct).slice(0,5);
}

function showResults(){
  const {score,cats}=scoreAssessment();
  let level,message,meaning;
  if(score<30){level='Idea & Foundation Stage';message='You have plenty of room to build—and that is exactly what a starting point is for.';meaning='Your strongest opportunity right now is to turn your idea into a clearer project foundation. The missing pieces can become your development checklist.'}
  else if(score<50){level='Developing';message='You have important pieces in place, but your project needs more structure before pursuing many grants.';meaning='You are far enough along to begin building starter documents, clarifying your project, and closing the most important readiness gaps.'}
  else if(score<70){level='Emerging Grant Ready';message='Your foundation is taking shape. A focused development plan could move you considerably closer to funder readiness.';meaning='You have several usable building blocks. Your next gains are likely to come from documentation, evidence, budgeting, and project detail.'}
  else if(score<85){level='Nearly Grant Ready';message='You have a strong preliminary foundation, with several items to verify or strengthen before applications.';meaning='You may be ready for deeper funder matching and proposal planning once priority gaps and current eligibility requirements are addressed.'}
  else {level='Strong Preliminary Readiness';message='Your answers suggest a strong preliminary foundation for deeper grant intelligence analysis.';meaning='Your next step is to verify opportunity-specific eligibility, requirements, documentation, budget fit, and proposal readiness.'}
  document.getElementById('finalScore').textContent=score;
  document.getElementById('readinessLevel').textContent=level;
  document.getElementById('readinessMessage').textContent=message;
  document.getElementById('resultMeaning').textContent=meaning;
  document.getElementById('resultIntro').textContent=score<50?'This is not a failing score. It is a map of what to build next.':'Your answers provide a preliminary snapshot of where you stand today.';
  document.getElementById('categoryBars').innerHTML=Object.entries(cats).map(([cat,v])=>{const p=Math.round(v.p/v.m*100);return `<div class="category-row"><span>${cat}</span><div class="category-track"><i style="width:${p}%"></i></div><strong>${p}%</strong></div>`}).join('');
  document.getElementById('recommendations').innerHTML=recsFor(cats).map((r,i)=>`<div class="recommendation-item"><b>${i+1}</b><div><strong>${r.title}</strong><small>${r.text}</small></div></div>`).join('');
  quiz.hidden=true;results.hidden=false;window.scrollTo({top:0,behavior:'smooth'});
}

document.getElementById('startAssessment').addEventListener('click',()=>{intro.hidden=true;quiz.hidden=false;renderQuestion();window.scrollTo({top:0,behavior:'smooth'})});
next.addEventListener('click',()=>{if(answers[index]===null)return;if(index<questions.length-1){index++;renderQuestion();window.scrollTo({top:80,behavior:'smooth'})}else showResults()});
prev.addEventListener('click',()=>{if(index>0){index--;renderQuestion()}});
document.getElementById('retakeAssessment').addEventListener('click',()=>{answers=Array(questions.length).fill(null);index=0;results.hidden=true;intro.hidden=false;window.scrollTo({top:0,behavior:'smooth'})});
document.getElementById('purchaseButton').addEventListener('click',e=>{if(e.currentTarget.getAttribute('href')==='#'){e.preventDefault();alert('Purchase link placeholder: connect this button to your $29 checkout when ready.')}});
