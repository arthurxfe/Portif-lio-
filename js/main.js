(function(){
  var root=document.documentElement;
  // tema
  try{var s=localStorage.getItem('theme');if(s)root.setAttribute('data-theme',s);}catch(e){}
  document.getElementById('theme').addEventListener('click',function(){
    var dark=root.getAttribute('data-theme')==='dark';
    var next=dark?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('theme',next);}catch(e){}
  });
  // menu mobile
  var links=document.getElementById('links');
  var mb=document.getElementById('menu');
  mb.addEventListener('click',function(){mb.setAttribute('aria-expanded',links.classList.toggle('open'));});
  links.addEventListener('click',function(e){if(e.target.closest('a')){links.classList.remove('open');mb.setAttribute('aria-expanded','false');}});
  // ano
  document.getElementById('year').textContent=new Date().getFullYear();
  // reveal
  var rv=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
    rv.forEach(function(n){io.observe(n);});
  }else{rv.forEach(function(n){n.classList.add('in');});}
  // link ativo
  var secs=document.querySelectorAll('main section[id]'),as=document.querySelectorAll('.links a');
  window.addEventListener('scroll',function(){
    var y=window.scrollY+120,cur='';
    secs.forEach(function(s){if(s.offsetTop<=y)cur=s.id;});
    as.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+cur);});
  },{passive:true});
  // ver todos os projetos
  var tg=document.getElementById('allp');
  if(tg)tg.addEventListener('click',function(){var o=document.getElementById('projects').classList.toggle('all');tg.textContent=o?'Ver menos ←':'Ver todos os projetos →';tg.setAttribute('aria-expanded',o);});
})();
