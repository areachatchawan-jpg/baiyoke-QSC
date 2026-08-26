// Bayoke QSC System
console.log('QSC System Loading...');

document.addEventListener('DOMContentLoaded', function() {
  // Set today's date
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('inspection-date');
  if (dateInput) dateInput.value = today;

  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      switchTab(this.getAttribute('data-tab'));
    });
  });

  // Form submission
  const form = document.getElementById('qsc-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      saveInspection();
    });
  }

  updateDashboard();
  console.log('✓ QSC System Ready');
});

function switchTab(tabName) {
  // Hide all
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));

  // Show selected
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
  const comments = document.getElementById('comments').value;

  if (!date || !inspector || !branch || !shift || !q || !s || !c) {
    alert('❌ กรุณากรอกข้อมูลให้ครบ!');
    return;
  }

  const avg = Math.round((parseInt(q) + parseInt(s) + parseInt(c)) / 3);
  const inspection = {
    id: Date.now(),
    date, inspector, branch, shift,
    quality: {score: parseInt(q), items: getChecked('quality')},
    service: {score: parseInt(s), items: getChecked('service')},
    cleanliness: {score: parseInt(c), items: getChecked('cleanliness')},
    comments, timestamp: new Date().toLocaleString('th-TH'),
    avgScore: avg
  };

  let inspections = JSON.parse(localStorage.getItem('inspections')) || [];
  inspections.push(inspection);
  localStorage.setItem('inspections', JSON.stringify(inspections));

  alert(`✓ บันทึกสำเร็จ!\nคะแนน: ${avg}/100`);
  document.getElementById('qsc-form').reset();
  document.getElementById('inspection-date').value = new Date().toISOString().split('T')[0];
}

function getChecked(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(c => c.value);
}

function updateDashboard() {
  const inspections = JSON.parse(localStorage.getItem('inspections')) || [];
  
  const total = document.getElementById('total-records');
  if (total) total.innerText = inspections.length;

  if (inspections.length === 0) {
    document.getElementById('avg-score').innerText = '-';
    document.getElementById('max-score').innerText = '-';
    document.getElementById('min-score').innerText = '-';
    document.getElementById('records-table').style.display = 'none';
    document.getElementById('no-records').style.display = 'block';
    return;
  }

  const scores = inspections.map(r => r.avgScore);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  document.getElementById('avg-score').innerText = avg;
  document.getElementById('max-score').innerText = Math.max(...scores);
  document.getElementById('min-score').innerText = Math.min(...scores);

  const tbody = document.getElementById('records-tbody');
  tbody.innerHTML = '';
  inspections.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.date}</td><td>${r.inspector}</td><td>${r.branch}</td><td><strong>${r.avgScore}/100</strong></td><td><button onclick="deleteRecord(${r.id})" style="padding:6px 12px;background:#ff4444;color:white;border:none;border-radius:4px;cursor:pointer;">ลบ</button></td>`;
    tbody.appendChild(tr);
  });

  document.getElementById('records-table').style.display = 'table';
  document.getElementById('no-records').style.display = 'none';
}

function deleteRecord(id) {
  if (confirm('ต้องการลบหรือไม่?')) {
    let inspections = JSON.parse(localStorage.getItem('inspections')) || [];
    inspections = inspections.filter(r => r.id !== id);
    localStorage.setItem('inspections', JSON.stringify(inspections));
    updateDashboard();
    alert('✓ ลบสำเร็จ');
  }
}

function exportToJSON() {
  const inspections = JSON.parse(localStorage.getItem('inspections')) || [];
  if (!inspections.length) {alert('❌ ไม่มีข้อมูล'); return;}
  const blob = new Blob([JSON.stringify(inspections, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bayoke-qsc-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  alert('✓ Export สำเร็จ');
}

function exportToCSV() {
  const inspections = JSON.parse(localStorage.getItem('inspections')) || [];
  if (!inspections.length) {alert('❌ ไม่มีข้อมูล'); return;}
  let csv = 'วันที่,ผู้ตรวจสอบ,สาขา,กะ,Quality,Service,Cleanliness,คะแนน\n';
  inspections.forEach(r => {
    csv += `${r.date},${r.inspector},${r.branch},${r.shift},${r.quality.score},${r.service.score},${r.cleanliness.score},${r.avgScore}\n`;
  });
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bayoke-qsc-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  alert('✓ Export สำเร็จ');
}
