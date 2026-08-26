// Bayoke QSC
console.log('QSC Loading');
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('inspection-date');
  if (dateInput) dateInput.value = today;
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      switchTab(this.getAttribute('data-tab'));
    });
  });
  const form = document.getElementById('qsc-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      saveInspection();
    });
  }
  updateDashboard();
  console.log('✓ Ready');
});

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
  const tab = document.getElementById(tabName);
  if (tab) tab.classList.add('active');
  const btn = document.querySelector(`[data-tab="${tabName}"]`);
  if (btn) btn.classList.add('active');
  if (tabName === 'dashboard') updateDashboard();
}

function saveInspection() {
  const date = document.getElementById('inspection-date').value;
  const inspector = document.getElementById('inspector-name').value;
  const branch = document.getElementById('branch').value;
  const shift = document.getElementById('shift').value;
  const q = document.getElementById('quality-score').value;
  const s = document.getElementById('service-score').value;
  const c = document.getElementById('cleanliness-score').value;
  if (!date || !inspector || !branch || !shift || !q || !s || !c) {
    alert('❌ กรุณากรอกขอมูล!');
    return;
  }
  const avg = Math.round((parseInt(q) + parseInt(s) + parseInt(c)) / 3);
  const inspection = {
    id: Date.now(),
    date, inspector, branch, shift,
    quality: {score: parseInt(q)},
    service: {score: parseInt(s)},
    cleanliness: {score: parseInt(c)},
    avgScore: avg
  };
  let inspections = JSON.parse(localStorage.getItem('inspections')) || [];
  inspections.push(inspection);
  localStorage.setItem('inspections', JSON.stringify(inspections));
  alert(`✓ บันทึก ${avg}/100`);
  document.getElementById('qsc-form').reset();
  document.getElementById('inspection-date').value = today;
}

function updateDashboard() {
  const inspections = JSON.parse(localStorage.getItem('inspections')) || [];
  const total = document.getElementById('total-records');
  if (total) total.innerText = inspections.length;
  if (inspections.length === 0) {
    if (document.getElementById('avg-score')) document.getElementById('avg-score').innerText = '-';
    if (document.getElementById('max-score')) document.getElementById('max-score').innerText = '-';
    if (document.getElementById('min-score')) document.getElementById('min-score').innerText = '-';
    return;
  }
  const scores = inspections.map(r => r.avgScore);
  const avg = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
  if (document.getElementById('avg-score')) document.getElementById('avg-score').innerText = avg;
  if (document.getElementById('max-score')) document.getElementById('max-score').innerText = Math.max(...scores);
  if (document.getElementById('min-score')) document.getElementById('min-score').innerText = Math.min(...scores);
}

function deleteRecord(id) {
  if (confirm('ลบ?')) {
    let inspections = JSON.parse(localStorage.getItem('inspections')) || [];
    inspections = inspections.filter(r => r.id !== id);
    localStorage.setItem('inspections', JSON.stringify(inspections));
    updateDashboard();
  }
}
