if (localStorage.getItem('giAccessGranted') !== 'true') {
  location.replace('unlock.html');
}
const latest = localStorage.getItem('giLatestScore');
document.getElementById('startScore').textContent = latest !== null ? `${latest} / 100` : 'Not assessed';

document.getElementById('intakeForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const project = {
    id: 'GI-' + Date.now(),
    createdAt: new Date().toISOString(),
    readinessScore: latest !== null ? Number(latest) : null,
    stage: document.getElementById('stage').value,
    projectName: document.getElementById('projectName').value.trim(),
    projectDescription: document.getElementById('projectDescription').value.trim(),
    organizationName: document.getElementById('organizationName').value.trim(),
    mission: document.getElementById('mission').value.trim(),
    primaryGoal: document.getElementById('goal').value,
    accessMethod: localStorage.getItem('giAccessMethod') || 'unknown'
  };
  localStorage.setItem('giCurrentProject', JSON.stringify(project));
  localStorage.setItem('giModule00Complete','true');
  location.href='workspace.html?mode=intake';
});

document.getElementById('exitBtn').addEventListener('click',()=>{
  if(confirm('Exit the test access session? Your assessment history will remain on this device.')){
    localStorage.removeItem('giAccessGranted');
    localStorage.removeItem('giAccessMethod');
    localStorage.removeItem('giModule00Complete');
    location.href='index.html';
  }
});