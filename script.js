console.log('QSC Ready');

var DEFAULT_BRANCHES = ['Bayoke Downtown', 'Bayoke Siam Square'];

document.addEventListener('DOMContentLoaded', function() {
  var today = new Date().toISOString().split('T')[0];
  var dateInput = document.getElementById('inspection-date');
  if (dateInput) dateInput.value = today;
  
  var buttons = document.querySelectorAll('.tab-button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      switchTab(this.getAttribute('data-tab'));
    });
  }
  
  loadSettings();
  updateBranchSelect();
});

function switchTab(tabName) {
  var tabs = document.querySelectorAll('.tab-content');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }
  var btns = document.querySelectorAll('.tab-button');
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.remove('active');
  }
  
  var tab = document.getElementById(tabName);
  if (tab) tab.classList.add('active');
  
  var btn = document.querySelector('[data-tab="' + tabName + '"]');
  if (btn) btn.classList.add('active');
  
  if (tabName === 'settings') {
    loadSettingsUI();
  }
}

function loadSettings() {
  if (!localStorage.getItem('branches')) {
    localStorage.setItem('branches', JSON.stringify(DEFAULT_BRANCHES));
  }
}

function updateBranchSelect() {
  var branches = JSON.parse(localStorage.getItem('branches')) || DEFAULT_BRANCHES;
  var select = document.getElementById('branch');
  if (!select) return;
  
  select.innerHTML = '<option value="">-- เลือกสาขา --</option>';
  branches.forEach(function(branch) {
    var opt = document.createElement('option');
    opt.value = branch.toLowerCase();
    opt.text = branch;
    select.appendChild(opt);
  });
}

function loadSettingsUI() {
  var div = document.getElementById('branches-list');
  if (!div) return;
  
  var branches = JSON.parse(localStorage.getItem('branches')) || DEFAULT_BRANCHES;
  div.innerHTML = '';
  
  branches.forEach(function(branch, index) {
    var item = document.createElement('div');
    item.style.marginBottom = '10px';
    item.innerHTML = '<span>' + branch + '</span> <button onclick="deleteBranch(' + index + ')" style="margin-left:10px;padding:5px 10px;background:#ff4444;color:white;border:none;border-radius:4px;cursor:pointer;">ลบ</button>';
    div.appendChild(item);
  });
}

function addBranch() {
  var input = document.getElementById('new-branch');
  if (!input || !input.value) {
    alert('กรุณาใส่ชื่อสาขา');
    return;
  }
  
  var branches = JSON.parse(localStorage.getItem('branches')) || DEFAULT_BRANCHES;
  branches.push(input.value);
  localStorage.setItem('branches', JSON.stringify(branches));
  
  input.value = '';
  updateBranchSelect();
  loadSettingsUI();
  alert('เพิ่มสาขาสำเร็จ');
}

function deleteBranch(index) {
  if (!confirm('ลบสาขานี้?')) return;
  var branches = JSON.parse(localStorage.getItem('branches')) || DEFAULT_BRANCHES;
  branches.splice(index, 1);
  localStorage.setItem('branches', JSON.stringify(branches));
  updateBranchSelect();
  loadSettingsUI();
  alert('ลบสำเร็จ');
}
