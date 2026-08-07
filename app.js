const modules=[
{n:'01',name:'Organization Intelligence',desc:'Organization profile, mission, programs, population and capacity.',state:'complete'},
{n:'02',name:'Grant Readiness',desc:'Readiness gaps, documents, registrations and next actions.',state:'complete'},
{n:'03',name:'Funding Intelligence',desc:'Funding strategy, categories, priorities and restrictions.',state:'complete'},
{n:'04',name:'Opportunity Intelligence',desc:'Candidate funders, award amounts and opportunity data.',state:'complete'},
{n:'05',name:'Funder Alignment',desc:'Compatibility, eligibility, readiness and award strategy.',state:'ready'},
{n:'06',name:'Proposal Development',desc:'Requirements, outline, narrative and compliance planning.',state:'locked'},
{n:'07',name:'Proposal Writing',desc:'Evidence-governed planning drafts and quality review.',state:'locked'},
{n:'08',name:'Proposal Refinement',desc:'Evidence improvement, consistency and revision workflow.',state:'future'},
{n:'09',name:'Submission Readiness',desc:'Final requirements, attachments and compliance checks.',state:'future'},
{n:'10',name:'Submission Package',desc:'Assemble a funder-specific final grant package.',state:'future'},
{n:'11',name:'Award Intelligence',desc:'Post-submission and post-award intelligence.',state:'future'}
];
const list=document.getElementById('moduleList');
list.innerHTML=modules.map(m=>`<article class="module-item ${m.state==='complete'?'complete':''} ${m.state==='ready'?'ready':''}"><div class="module-num">${m.n}</div><div><h3>${m.name}</h3><p>${m.desc}</p></div><div class="module-actions">${m.state==='complete'?'<span class="state-pill done">Complete</span><button class="mini-action">View</button><button class="mini-action">PDF</button><button class="mini-action">DOCX</button><button class="mini-action">Run Again</button>':m.state==='ready'?'<span class="state-pill">Ready</span><button class="mini-action run-action">Run Module</button>':'<span class="state-pill locked">'+(m.state==='future'?'Coming later':'Locked')+'</span>'}</div></article>`).join('');

const opps=[
{name:'The California Endowment',program:'Building Healthy Communities',match:'92%',award:'$15K–$500K',verify:'Current verification'},
{name:'California Wellness Foundation',program:'Community Well-Being',match:'89%',award:'Award range varies',verify:'Current verification'},
{name:'Kaiser Permanente',program:'Community Health',match:'86%',award:'Program dependent',verify:'Current verification'},
{name:'Weingart Foundation',program:'Unrestricted / Capacity',match:'83%',award:'Program dependent',verify:'Current verification'},
{name:'LA84 Foundation',program:'Youth Development',match:'78%',award:'Program dependent',verify:'Current verification'}
];
const grid=document.getElementById('opportunityGrid');
let selected=new Set();
function renderOpps(){grid.innerHTML=opps.map((o,i)=>`<article class="opp-card ${selected.has(i)?'selected':''}" data-i="${i}"><input class="opp-select" type="checkbox" ${selected.has(i)?'checked':''}><div class="opp-top"><div><span class="eyebrow">OPPORTUNITY ${i+1}</span><h3>${o.name}</h3><p>${o.program}</p></div><span class="match">${o.match}</span></div><div class="award"><span><b>Award</b><br>${o.award}</span><span><b>Status</b><br>${o.verify}</span></div></article>`).join('');
 document.getElementById('selectedCount').textContent=`${selected.size} selected`;
 const btn=document.getElementById('continueBtn');btn.disabled=selected.size===0;
 document.getElementById('selectionMessage').textContent=selected.size?`${selected.size} opportunity${selected.size>1?'ies':''} will be sent to Module 05.`:'Select at least one opportunity to continue.';
}
grid.addEventListener('click',e=>{const card=e.target.closest('.opp-card');if(!card)return;const i=Number(card.dataset.i);selected.has(i)?selected.delete(i):selected.add(i);renderOpps()});
renderOpps();
document.getElementById('continueBtn').addEventListener('click',()=>alert('Prototype: selected opportunity IDs would now be saved and passed into the Module 05 Dify workflow.'));
const modal=document.getElementById('projectModal');
document.getElementById('newProjectBtn').onclick=()=>modal.classList.add('open');
document.getElementById('closeModal').onclick=()=>modal.classList.remove('open');
document.getElementById('cancelModal').onclick=()=>modal.classList.remove('open');
