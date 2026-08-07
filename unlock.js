const TEST_CODES = ['GI-TEST-2026'];
const latest = localStorage.getItem('giLatestScore');
document.getElementById('carryScore').textContent = latest !== null ? `${latest} / 100` : 'Not available';

document.getElementById('codeBtn').addEventListener('click', () => {
  const code = document.getElementById('accessCode').value.trim().toUpperCase();
  const notice = document.getElementById('codeNotice');
  if (TEST_CODES.includes(code)) {
    localStorage.setItem('giAccessGranted','true');
    localStorage.setItem('giAccessMethod','test_code');
    localStorage.setItem('giAccessCodeUsed',code);
    localStorage.setItem('giAccessGrantedAt',new Date().toISOString());
    notice.className='notice ok';
    notice.textContent='Access granted. Opening Module 00…';
    setTimeout(()=>location.href='module00.html',500);
  } else {
    notice.className='notice bad';
    notice.textContent='That access code is not valid. Check the code and try again.';
  }
});

document.getElementById('purchaseBtn').addEventListener('click', () => {
  alert('The live $29 checkout will be connected next. For now, use the complimentary test code.');
});