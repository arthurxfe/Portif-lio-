(function(){
  var cv=document.getElementById('game'),cx=cv.getContext('2d'),N=20,S=cv.width/N;
  var sn,dir,nd,food,score=0,best=0,run=false,over=false,t=null,mo=0,msg='Pressione Iniciar';
  var sc=document.getElementById('score'),bs=document.getElementById('best'),sb=document.getElementById('start');
  try{best=+localStorage.getItem('best')||0;}catch(e){}
  function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}
  function upd(){sc.textContent=score;bs.textContent=best;}
  function place(){do{food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)};}while(sn.some(function(c){return c.x===food.x&&c.y===food.y;}));}
  function reset(){sn=[{x:9,y:10},{x:8,y:10},{x:7,y:10}];dir=nd={x:1,y:0};score=0;over=false;place();upd();}
  function turn(x,y){if(x===-dir.x&&y===-dir.y)return;nd={x:x,y:y};}
  function speed(){clearInterval(t);t=setInterval(step,Math.max(110,190-score*2));}
  function stop(){clearInterval(t);run=false;}
  function end(){stop();over=true;msg='Fim de jogo · '+score+' pts';sb.textContent='Jogar de novo';draw();}
  function step(){
    dir=nd;var h={x:sn[0].x+dir.x,y:sn[0].y+dir.y};
    if(h.x<0||h.y<0||h.x>=N||h.y>=N||sn.some(function(c){return c.x===h.x&&c.y===h.y;})){end();return;}
    sn.unshift(h);mo=1-mo;
    if(h.x===food.x&&h.y===food.y){
      score++;if(score>best){best=score;try{localStorage.setItem('best',best);}catch(e){}}
      place();upd();speed();
    }else sn.pop();
    draw();
  }
  function draw(){
    var ac=css('--accent');
    cx.fillStyle=css('--surface');cx.fillRect(0,0,400,400);
    cx.fillStyle=ac;cx.globalAlpha=.07;
    for(var i=0;i<N;i++)for(var j=0;j<N;j++)if((i+j)%2)cx.fillRect(i*S,j*S,S,S);
    cx.globalAlpha=1;
    var fx=food.x*S+S/2,fy=food.y*S+S/2;
    cx.fillStyle='rgba(0,0,0,.14)';cx.beginPath();cx.ellipse(fx,fy+S*.36,S*.26,S*.07,0,0,7);cx.fill();
    cx.fillStyle='#e5484d';cx.beginPath();cx.arc(fx-3,fy+1,S*.27,0,7);cx.arc(fx+3,fy+1,S*.27,0,7);cx.fill();
    cx.fillStyle='rgba(255,255,255,.6)';cx.beginPath();cx.arc(fx-5,fy-2,2.4,0,7);cx.fill();
    cx.strokeStyle='#4d7c0f';cx.lineWidth=2.4;cx.lineCap='round';cx.beginPath();cx.moveTo(fx,fy-S*.2);cx.quadraticCurveTo(fx+1,fy-S*.36,fx+6,fy-S*.4);cx.stroke();
    cx.lineJoin='round';cx.lineCap='round';
    cx.strokeStyle=ac;cx.lineWidth=S*.74;
    cx.beginPath();sn.forEach(function(c,k){var X=c.x*S+S/2,Y=c.y*S+S/2;if(k)cx.lineTo(X,Y);else cx.moveTo(X,Y);});cx.stroke();
    cx.strokeStyle='rgba(255,255,255,.3)';cx.lineWidth=S*.24;
    cx.beginPath();sn.forEach(function(c,k){var X=c.x*S+S/2-2,Y=c.y*S+S/2-3;if(k)cx.lineTo(X,Y);else cx.moveTo(X,Y);});cx.stroke();
    var h=sn[0],hx=h.x*S+S/2,hy=h.y*S+S/2,qx=-dir.y,qy=dir.x;
    cx.fillStyle=ac;cx.beginPath();cx.arc(hx,hy,S*.45,0,7);cx.fill();
    if(mo){cx.strokeStyle='#e5484d';cx.lineWidth=2;cx.beginPath();cx.moveTo(hx+dir.x*S*.45,hy+dir.y*S*.45);cx.lineTo(hx+dir.x*S*.75,hy+dir.y*S*.75);cx.stroke();}
    [-1,1].forEach(function(q){
      var ex=hx+dir.x*S*.12+qx*q*S*.2,ey=hy+dir.y*S*.12+qy*q*S*.2;
      cx.fillStyle='#fff';cx.beginPath();cx.arc(ex,ey,S*.15,0,7);cx.fill();
      cx.fillStyle='#16131c';cx.beginPath();cx.arc(ex+dir.x*2,ey+dir.y*2,S*.075,0,7);cx.fill();
    });
    if(!run){
      cx.fillStyle='rgba(20,16,26,.58)';cx.fillRect(0,0,400,400);
      cx.fillStyle='#fff';cx.textAlign='center';cx.font='700 24px Inter,system-ui,sans-serif';cx.fillText(msg,200,196);
      cx.fillStyle='rgba(255,255,255,.82)';cx.font='400 14px Inter,system-ui,sans-serif';cx.fillText('Setas, W A S D ou deslize o dedo',200,226);
    }
  }
  function toggle(){
    if(run){stop();msg='Pausado';sb.textContent='Continuar';draw();return;}
    if(over||!sn)reset();
    run=true;sb.textContent='Pausar';speed();draw();
  }
  sb.addEventListener('click',toggle);
  document.addEventListener('keydown',function(e){
    var m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]}[e.key];
    if(!m||!run)return;e.preventDefault();turn(m[0],m[1]);
  });
  var ds={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};
  document.querySelectorAll('.dpad button').forEach(function(b){b.addEventListener('click',function(){var v=ds[b.dataset.d];if(run)turn(v[0],v[1]);});});
  var tx=0,ty=0;
  cv.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});
  cv.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;
    if(Math.max(Math.abs(dx),Math.abs(dy))<24||!run)return;
    if(Math.abs(dx)>Math.abs(dy))turn(dx>0?1:-1,0);else turn(0,dy>0?1:-1);
  },{passive:true});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){
    if(!es[0].isIntersecting&&run){stop();msg='Pausado';sb.textContent='Continuar';draw();}
  },{threshold:.1}).observe(cv);
  document.getElementById('theme').addEventListener('click',function(){setTimeout(draw,0);});
  reset();draw();
})();
