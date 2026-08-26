console.log('QSC Ready');

document.addEventListener('DOMContentLoaded', function() {
  var today = new Date().toISOString().split('T')[0];
  var dateInput = document.getElementById('inspection-date');
  if (dateInput) {
    dateInput.value = today;
  }
  
  var buttons = document.querySelectorAll('.tab-button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      var tabName = this.getAttribute('data-tab');
      switchTab(tabName);
    });
  }
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
  if (tab) {
    tab.classList.add('active');
  }
  
  var btn = document.querySelector('[data-tab="' + tabName + '"]');
  if (btn) {
    btn.classList.add('active');
  }
}

