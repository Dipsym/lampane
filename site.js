(function(){
  var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('[data-page]').forEach(function(link){
    if(link.getAttribute('data-page')===page){link.setAttribute('aria-current','page');}
  });
  var year=document.querySelectorAll('[data-year]');
  year.forEach(function(el){el.textContent=new Date().getFullYear();});
  var toggle=document.querySelector('.menu-button');
  var nav=document.querySelector('.nav-links');
  if(toggle&&nav){toggle.addEventListener('click',function(){var open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.innerHTML=open?'✕ <span>Close</span>':'☰ <span>Menu</span>';});nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.innerHTML='☰ <span>Menu</span>';});});}
  var cvButton=document.getElementById('cv-download');
  var cvMissing=document.getElementById('cv-missing');
  if(cvButton&&cvMissing){fetch('cv.pdf',{method:'HEAD',cache:'no-store'}).then(function(r){if(r.ok){cvButton.hidden=false;cvMissing.hidden=true;}else{cvButton.hidden=true;cvMissing.hidden=false;}}).catch(function(){cvButton.hidden=true;cvMissing.hidden=false;});}
}());
