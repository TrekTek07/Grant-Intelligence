const score=localStorage.getItem('gi_readiness_score');
const level=localStorage.getItem('gi_readiness_level');
document.getElementById('demoScore').textContent=score ? `${score}/100` : 'Demo';
document.getElementById('journeyStart').textContent=score || '11';
if(level) document.getElementById('demoLevel').textContent=level;

const samples=[
 {n:'01',name:'Organization Intelligence',status:'Sample ready',title:'Organization Profile Preview',body:`<h3>Starting Point</h3><p><strong>Stage:</strong> Idea / early development</p><p><strong>Purpose:</strong> Improve access to practical health and wellness education.</p><p><strong>What the paid process adds:</strong> A structured organization or idea profile, mission clarification, program concepts, target population and missing-information map.</p><div class="sample-note">Sample only — the real report would use the customer's answers and authorized information.</div>`},
 {n:'02',name:'Grant Readiness',status:'Sample ready',title:'Grant Readiness Preview',body:`<h3>Illustrative Findings</h3><div class="sample-bars"><span>Foundation <b>65%</b></span><i style="width:65%"></i><span>Program <b>58%</b></span><i style="width:58%"></i><span>Financial <b>32%</b></span><i style="width:32%"></i></div><h3>Priority Actions</h3><ol><li>Clarify the project and population.</li><li>Create a preliminary project budget.</li><li>Choose an organizational path.</li><li>Gather supporting evidence.</li></ol>`},
 {n:'03',name:'Funding Intelligence',status:'Sample ready',title:'Funding Direction Preview',body:`<h3>Potential Funding Directions</h3><p>Community wellness • youth development • health education • capacity building</p><h3>Strategy</h3><p>Begin with opportunities compatible with early-stage project development, then expand as legal, financial and evaluation readiness improves.</p>`},
 {n:'04',name:'Opportunity Intelligence',status:'Interactive below',title:'Opportunity Intelligence Preview',body:`<h3>Candidate Opportunity Portfolio</h3><p>The real workflow can assemble candidate funders, published award information, compatibility evidence and verification flags. The interactive sample opportunity cards below demonstrate the selection step.</p>`},
 {n:'05',name:'Funder Alignment',status:'Sample preview',title:'Funder Alignment Preview',body:`<h3>Illustrative Compatibility</h3><p><strong>Mission:</strong> Strong preliminary alignment</p><p><strong>Population:</strong> Strong preliminary alignment</p><p><strong>Geography:</strong> Requires current verification</p><p><strong>Eligibility:</strong> Requires organizational development</p>`},
 {n:'06',name:'Proposal Development',status:'Sample preview',title:'Proposal Development Preview',body:`<h3>Planning Package</h3><p>Proposal requirements • outline • narrative strategy • budget & evaluation planning • submission compliance</p><div class="sample-note">Requirements are not treated as confirmed unless they are documented or currently verified.</div>`},
 {n:'07',name:'Proposal Writing',status:'Sample preview',title:'Proposal Writing Preview',body:`<h3>Planning Draft Sections</h3><p>Executive Summary • Needs Assessment • Program Design • Goals & Objectives • Implementation • Evaluation • Sustainability • Budget Narrative</p><p>The evidence-governed process also identifies missing information, planning recommendations and verification requirements.</p>`}
];
const list=document.getElementById('demoModules');
const viewer=document.getElementById('demoViewer');
list.innerHTML=samples.map((m,i)=>`<button class="demo-module ${i===0?'active':''}" data-i="${i}"><span>${m.n}</span><div><strong>${m.name}</strong><small>${m.status}</small></div><b>›</b></button>`).join('');
function show(i){document.querySelectorAll('.demo-module').forEach((b,j)=>b.classList.toggle('active',i===j));const m=samples[i];viewer.innerHTML=`<span class="eyebrow">SAMPLE REPORT • MODULE ${m.n}</span><h2>${m.title}</h2>${m.body}<div class="viewer-actions"><button class="mini-action" onclick="alert('Demo: PDF download becomes available in the real paid workspace.')">PDF</button><button class="mini-action" onclick="alert('Demo: DOCX download becomes available in the real paid workspace.')">DOCX</button></div>`;}
list.addEventListener('click',e=>{const b=e.target.closest('.demo-module');if(b)show(Number(b.dataset.i));});show(0);

const opps=[
 {name:'California Endowment',focus:'Health equity & community wellness',match:92,status:'Current verification required'},
 {name:'California Wellness Foundation',focus:'Health & well-being',match:88,status:'Current verification required'},
 {name:'Kaiser Permanente',focus:'Community health',match:85,status:'Current verification required'},
 {name:'Community Foundation',focus:'Local community initiatives',match:78,status:'Program-dependent'},
 {name:'Corporate Community Grant',focus:'Community support',match:72,status:'Program-dependent'}
];
const og=document.getElementById('demoOpportunities'); let selected=new Set();
function render(){og.innerHTML=opps.map((o,i)=>`<article class="demo-opp ${selected.has(i)?'selected':''}" data-i="${i}"><input type="checkbox" ${selected.has(i)?'checked':''}><div><small>DEMO OPPORTUNITY ${i+1}</small><h3>${o.name}</h3><p>${o.focus}</p><span>${o.status}</span></div><strong>${o.match}%</strong></article>`).join('');document.getElementById('demoSelectedCount').textContent=`${selected.size} selected`;document.getElementById('demoContinue').disabled=!selected.size;}
og.addEventListener('click',e=>{const card=e.target.closest('.demo-opp');if(!card)return;const i=Number(card.dataset.i);selected.has(i)?selected.delete(i):selected.add(i);render();});render();
document.getElementById('demoContinue').addEventListener('click',()=>{show(4);document.querySelector('.demo-dashboard').scrollIntoView({behavior:'smooth'});});
document.getElementById('fakeCheckout').addEventListener('click',()=>{localStorage.setItem('gi_demo_paid','true');alert('Simulation complete: in production, a successful $29 checkout would unlock the real customer workspace and Module 01 intake.');});
