(function(){
  var M=["###############","#o.....#.....o#","#.###.#.#.###.#","#.............#","#.###.....###.#","#......#......#","###.#.....#.###","...............","###.#.....#.###","#......#......#","#.###.....###.#","#.............#","#.###.#.#.###.#","#o.....#.....o#","###############"];
  var W=15,S=28,C=['#ef4444','#ec4899','#22d3ee'];
  var cv=document.getElementById('pac'),cx=cv.getContext('2d'),sb=document.getElementById('pstart');
  var g,dots,pc,dir,nd,gh,score=0,lives=3,run=false,over=false,t=null,tk=0,fr=0,mo=0,msg='Pressione Iniciar';
  function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}
  function upd(){document.getElementById('pscore').textContent=score;document.getElementById('plives').textContent=lives;}
  function wall(x,y){x=(x+W)%W;return g[y]===undefined||g[y][x]==='#';}
  function place(){pc={x:7,y:11};dir={x:0,y:0};nd={x:0,y:0};fr=0;
    gh=[0,1,2].map(function(i){return{x:6+i,y:7,dx:0,dy:0,w:8+i*10,c:C[i]};});}
  function init(){g=M.map(function(r){return r.split('');});dots=0;
    g.forEach(function(r){r.forEach(function(c){if(c==='.'||c==='o')dots++;});});
    g[11][7]=' ';dots--;score=0;lives=3;over=false;place();upd();}
  function stop(){clearInterval(t);run=false;}
  function finish(m){stop();over=true;msg=m;sb.textContent='Jogar de novo';draw();}
  function dist(o,d){var x=o.x+d[0]-pc.x,y=o.y+d[1]-pc.y;return x*x+y*y;}
  function mg(o){
    if(o.w>0){o.w--;return;}
    if(fr>0){if(tk%2)return;}else if(tk%4===3)return;
    var ops=[[1,0],[-1,0],[0,1],[0,-1]].filter(function(d){return !wall(o.x+d[0],o.y+d[1]);});
    var nr=ops.filter(function(d){return !(d[0]===-o.dx&&d[1]===-o.dy);});
    if(nr.length)ops=nr;
    var d;
    if(Math.random()<.35)d=ops[Math.floor(Math.random()*ops.length)];
    else d=ops.slice().sort(function(a,b){return dist(o,a)-dist(o,b);})[fr>0?ops.length-1:0];
    o.dx=d[0];o.dy=d[1];o.x=(o.x+d[0]+W)%W;o.y+=d[1];
  }
  function hit(){
    for(var i=0;i<gh.length;i++){var o=gh[i];
      if(o.x===pc.x&&o.y===pc.y){
        if(fr>0){score+=200;o.x=7;o.y=7;o.w=12;o.dx=o.dy=0;}
        else{lives--;upd();
          if(lives<=0)finish('Fim de jogo · '+score+' pts');
          else{stop();place();msg='Ops! Vidas: '+lives;sb.textContent='Continuar';draw();}
          return true;}
      }
    }
    return false;
  }
  function step(){
    tk++;
    if(!wall(pc.x+nd.x,pc.y+nd.y))dir=nd;
    if((dir.x||dir.y)&&!wall(pc.x+dir.x,pc.y+dir.y)){
      pc.x=(pc.x+dir.x+W)%W;pc.y+=dir.y;mo=1-mo;
      var c=g[pc.y][pc.x];
      if(c==='.'){g[pc.y][pc.x]=' ';score+=10;dots--;}
      else if(c==='o'){g[pc.y][pc.x]=' ';score+=50;dots--;fr=34;}
    }
    if(hit())return;
    if(fr>0)fr--;
    gh.forEach(mg);
    if(hit())return;
    upd();
    if(dots<=0){finish('Você venceu! '+score+' pts');return;}
    draw();
  }
  function iw(a,b){return a>=0&&b>=0&&a<W&&b<W&&g[b][a]==='#';}
  function op(a,b){return a>=0&&b>=0&&a<W&&b<W&&g[b][a]!=='#';}
  function draw(){
    var wc=css('--accent'),mu=css('--muted');
    cx.fillStyle=css('--surface');cx.fillRect(0,0,420,420);
    cx.strokeStyle=wc;cx.lineWidth=3;cx.lineCap='round';
    for(var y=0;y<W;y++)for(var x=0;x<W;x++){
      var c=g[y][x],X=x*S,Y=y*S;
      if(c==='#'){
        cx.globalAlpha=.1;cx.fillStyle=wc;cx.fillRect(X,Y,S,S);cx.globalAlpha=1;
        var l=X+(iw(x-1,y)?0:3),r=X+S-(iw(x+1,y)?0:3),tp=Y+(iw(x,y-1)?0:3),bt=Y+S-(iw(x,y+1)?0:3);
        cx.beginPath();
        if(op(x,y-1)){cx.moveTo(l,Y+3);cx.lineTo(r,Y+3);}
        if(op(x,y+1)){cx.moveTo(l,Y+S-3);cx.lineTo(r,Y+S-3);}
        if(op(x-1,y)){cx.moveTo(X+3,tp);cx.lineTo(X+3,bt);}
        if(op(x+1,y)){cx.moveTo(X+S-3,tp);cx.lineTo(X+S-3,bt);}
        cx.stroke();
      }
      else if(c==='.'){cx.fillStyle=mu;cx.beginPath();cx.arc(X+S/2,Y+S/2,2.6,0,7);cx.fill();}
      else if(c==='o'){cx.fillStyle='#f7b500';cx.beginPath();cx.arc(X+S/2,Y+S/2,6+(tk%2),0,7);cx.fill();}
    }
    var px=pc.x*S+S/2,py=pc.y*S+S/2,a=Math.atan2(dir.y,dir.x),m=mo?.55:.12;
    cx.fillStyle='#f7b500';cx.strokeStyle='rgba(0,0,0,.3)';cx.lineWidth=1.5;
    cx.beginPath();cx.moveTo(px,py);cx.arc(px,py,S*.46,a+m,a+2*Math.PI-m);cx.closePath();cx.fill();cx.stroke();
    cx.fillStyle='#16131c';cx.beginPath();cx.arc(px+Math.cos(a-1.15)*S*.22,py+Math.sin(a-1.15)*S*.22,2.3,0,7);cx.fill();
    gh.forEach(function(o){
      var X=o.x*S+S/2,Y=o.y*S+S/2,r=S*.43,sc=fr>0;
      cx.fillStyle=sc?((fr<10&&tk%2)?'#fff':'#3b6df0'):o.c;
      cx.beginPath();cx.arc(X,Y-2,r,Math.PI,0);cx.lineTo(X+r,Y+r);cx.lineTo(X+r*.5,Y+r-4);cx.lineTo(X,Y+r);cx.lineTo(X-r*.5,Y+r-4);cx.lineTo(X-r,Y+r);cx.closePath();cx.fill();
      cx.fillStyle='#fff';cx.beginPath();cx.arc(X-4.5,Y-4,3.6,0,7);cx.arc(X+4.5,Y-4,3.6,0,7);cx.fill();
      cx.fillStyle=sc?'#fff':'#16131c';cx.beginPath();cx.arc(X-4.5+o.dx*1.6,Y-4+o.dy*1.6,sc?1.2:1.8,0,7);cx.arc(X+4.5+o.dx*1.6,Y-4+o.dy*1.6,sc?1.2:1.8,0,7);cx.fill();
      if(sc){cx.strokeStyle='#fff';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(X-6,Y+6);cx.lineTo(X-3,Y+3);cx.lineTo(X,Y+6);cx.lineTo(X+3,Y+3);cx.lineTo(X+6,Y+6);cx.stroke();}
    });
    if(!run){
      cx.fillStyle='rgba(20,16,26,.58)';cx.fillRect(0,0,420,420);
      cx.fillStyle='#fff';cx.textAlign='center';cx.font='700 24px Inter,system-ui,sans-serif';cx.fillText(msg,210,206);
      cx.fillStyle='rgba(255,255,255,.82)';cx.font='400 14px Inter,system-ui,sans-serif';cx.fillText('Setas, W A S D ou deslize o dedo',210,236);
    }
  }
  function toggle(){
    if(run){stop();msg='Pausado';sb.textContent='Continuar';draw();return;}
    if(over)init();
    run=true;sb.textContent='Pausar';clearInterval(t);t=setInterval(step,190);draw();
  }
  sb.addEventListener('click',toggle);
  document.addEventListener('keydown',function(e){
    var m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]}[e.key];
    if(!m||!run)return;e.preventDefault();nd={x:m[0],y:m[1]};
  });
  var ds={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};
  document.querySelectorAll('#g-pac .dpad button').forEach(function(b){b.addEventListener('click',function(){var v=ds[b.dataset.d];if(run)nd={x:v[0],y:v[1]};});});
  var tx=0,ty=0;
  cv.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});
  cv.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;
    if(Math.max(Math.abs(dx),Math.abs(dy))<24||!run)return;
    nd=Math.abs(dx)>Math.abs(dy)?{x:dx>0?1:-1,y:0}:{x:0,y:dy>0?1:-1};
  },{passive:true});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){
    if(es[0].isIntersecting){if(!run)draw();}
    else if(run){stop();msg='Pausado';sb.textContent='Continuar';draw();}
  },{threshold:.1}).observe(cv);
  document.getElementById('theme').addEventListener('click',function(){setTimeout(draw,0);});
  // abas
  var tb=document.querySelectorAll('.tabs button');
  tb.forEach(function(b){b.addEventListener('click',function(){
    tb.forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b);});
    document.getElementById('g-snake').hidden=b.dataset.g!=='snake';
    document.getElementById('g-pac').hidden=b.dataset.g!=='pac';
  });});
  init();draw();
})();
