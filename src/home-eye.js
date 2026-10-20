export function createBlink(now,random=Math.random){
 return {start:now+1400+random()*4800,close:70+random()*40,hold:20+random()*30,reopen:130+random()*70};
}

export function advanceBlink(blink,now,random=Math.random){
 return now>=blink.start+blink.close+blink.hold+blink.reopen?createBlink(now,random):blink;
}

export function blinkOpenness(time,blink){
 const elapsed=time-blink.start;
 if(elapsed<=0||elapsed>=blink.close+blink.hold+blink.reopen)return 1;
 const smooth=value=>value*value*(3-2*value);
 if(elapsed<blink.close)return 1-.98*smooth(elapsed/blink.close);
 if(elapsed<=blink.close+blink.hold)return .02;
 return .02+.98*smooth((elapsed-blink.close-blink.hold)/blink.reopen);
}

export function gazeOffset(dx,dy,rx,ry){
 const length=Math.hypot(dx,dy);
 const strength=Math.min(length/120,1);
 return length?{x:dx/length*rx*strength,y:dy/length*ry*strength}:{x:0,y:0};
}

export function tracePath(from,to,spacing){
 const count=Math.max(1,Math.ceil(Math.hypot(to.x-from.x,to.y-from.y)/spacing));
 return Array.from({length:count+1},(_,i)=>({x:from.x+(to.x-from.x)*i/count,y:from.y+(to.y-from.y)*i/count}));
}

export function advanceFragment(p,dt){
 const decay=.88**(dt*60);
 const distance=(1-decay)/(1-.88)/60;
 const age=p.age||0;
 const fading=Math.max(0,age+dt-.18)-Math.max(0,age-.18);
 return {...p,x:p.x+p.vx*distance,y:p.y+p.vy*distance,vx:p.vx*decay,vy:p.vy*decay,age:age+dt,life:p.life*.956**(fading*60)};
}

export function deformationVelocity(dx,dy,distance,blockSize){
 const length=Math.hypot(dx,dy);
 if(!length||distance>=blockSize*4)return {x:0,y:0};
 const response=Math.exp(-((distance/blockSize)**2)/14);
 const speed=Math.min(1875,Math.min(length/blockSize,4)*blockSize*60)*response;
 return {x:dx/length*speed,y:dy/length*speed};
}

export function traceCells(from,to){
 const ax=Math.floor(from.x),ay=Math.floor(from.y),bx=Math.floor(to.x),by=Math.floor(to.y);
 const dx=bx-ax,dy=by-ay,steps=Math.max(Math.abs(dx),Math.abs(dy));
 if(!steps)return [{x:ax,y:ay}];
 return Array.from({length:steps+1},(_,i)=>({x:Math.floor(ax+dx*i/steps+.5),y:Math.floor(ay+dy*i/steps+.5)}));
}

export function trailDensity(distance,milliseconds,blockSize){
 const speed=distance/blockSize*(1000/60)/Math.max(1,milliseconds);
 return .4+.6*Math.min(1,speed/.96);
}

export function blockRestored(age,order){
 const t=Math.max(0,Math.min(1,(age-.18)/1.42));
 return t*t*(3-2*t)>=order;
}

export function chunkOffset(x,y,size=25){
 return {x:Math.round(x/size)*size,y:Math.round(y/size)*size};
}

export function contactImpulse(dx,dy,distance,milliseconds,size=25){
 const length=Math.hypot(dx,dy);
 if(!length||distance>=size*4)return {x:0,y:0};
 const local=Math.exp(-((distance/size)**2)/10);
 const speed=Math.min(1875,length/Math.max(8,milliseconds)*1000*1.8)*local;
 return {x:dx/length*speed,y:dy/length*speed};
}

export function mountHomeEyes(landing){
 const field=document.createElement('button');
 field.type='button';
 field.className='home-eyes';
 field.setAttribute('aria-label','Interactive eyes. Move the pointer or use arrow keys to look around. Press to blink.');
 const canvas=document.createElement('canvas');
 canvas.setAttribute('aria-hidden','true');
 field.append(canvas);
 landing.append(field);
 const ctx=canvas.getContext('2d');
 if(!ctx)return;
 let width=648,height=324,cell=108;
 const pixel=2,block=25;
 const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 const palette=getComputedStyle(document.documentElement);
 const mint=palette.getPropertyValue('--archive-eye-light').trim()||'#78efb0',lime=palette.getPropertyValue('--archive-eye-iris').trim()||'#e5ef70',plum=palette.getPropertyValue('--archive-eye-dark').trim()||'#35253f';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const eyes=Array.from({length:18},(_,i)=>({x:(i%6+.5)*cell,y:(Math.floor(i/6)+.5)*cell,gaze:{x:0,y:0},target:{x:0,y:0},open:1,blink:createBlink(performance.now())}));
 const fragments=new Map();
 const sourceBlocks=new Map();
 let frame=0,previousTime=0,lastPointer=null,blinkUntil=0,blinkTimer=0;
 let visible=true;
 function resize(){
  const rect=canvas.getBoundingClientRect();
  const nextWidth=rect.width||648,nextHeight=rect.height||324;
  if(width!==nextWidth||height!==nextHeight){
   fragments.clear();sourceBlocks.clear();width=nextWidth;height=nextHeight;cell=width/6;
   for(let i=0;i<eyes.length;i++){
    eyes[i].x=(i%6+.5)*cell;
    eyes[i].y=(Math.floor(i/6)+.5)*cell;
    eyes[i].gaze={x:0,y:0};eyes[i].target={x:0,y:0};
   }
  }
  const ratio=Math.min(devicePixelRatio||1,2);
  if(canvas.width!==Math.round(width*ratio)||canvas.height!==Math.round(height*ratio)){
   canvas.width=Math.round(width*ratio);
   canvas.height=Math.round(height*ratio);
   ctx.setTransform(ratio,0,0,ratio,0,0);
   ctx.imageSmoothingEnabled=false;
  }
  wake();
 }
 function tone(x,y){
  const col=Math.floor(x/cell),row=Math.floor(y/cell);
  if(col<0||col>5||row<0||row>2)return null;
  const eye=eyes[row*6+col],dx=(x-eye.x)*108/cell,dy=(y-eye.y)*108/cell;
  const open=eye.open;
  const lid=25*Math.max(0,1-(dx/49)**2)*open;
  if(Math.abs(dx)>49||Math.abs(dy)>lid)return null;
  const ix=dx-eye.gaze.x*108/cell,iy=dy-eye.gaze.y*108/cell;
  const iris=Math.hypot(ix/1.02,iy);
  if(iris<13){
   if(Math.hypot(ix+4,iy+5)<2.6)return {color:mint,alpha:.8};
   return {color:plum,alpha:1};
  }
  if(iris<21){
   const angle=Math.atan2(iy,ix);
   const texture=.48+.32*(.5+.5*Math.sin(angle*28+iris*.7+row*2));
   return {color:row%2?mint:lime,alpha:texture};
  }
  const edge=Math.abs(dy)/Math.max(lid,1);
  const texture=.84-.36*edge**2+.09*Math.sin(dx*.7+dy*.9+col*3);
  return {color:mint,alpha:Math.max(.25,texture)};
 }
 function rank(x,y){return (bayer[(Math.floor(y/pixel)%4)*4+Math.floor(x/pixel)%4]+.5)/16;}
 function draw(now){
  frame=0;
  if(document.hidden||!visible){previousTime=0;return;}
  const dt=Math.min((now-previousTime)/1000||1/60,.05);
  previousTime=now;
  let active=now<blinkUntil;
  for(const eye of eyes){
   eye.blink=advanceBlink(eye.blink,now);
   eye.open=reduced.matches?1:now<blinkUntil?.09:blinkOpenness(now,eye.blink);
   active||=!reduced.matches&&now>=eye.blink.start;
   const ease=reduced.matches?1:1-Math.exp(-dt*14);
   eye.gaze.x+=(eye.target.x-eye.gaze.x)*ease;
   eye.gaze.y+=(eye.target.y-eye.gaze.y)*ease;
   active||=Math.abs(eye.target.x-eye.gaze.x)+Math.abs(eye.target.y-eye.gaze.y)>.05;
  }
  for(const [key,p] of fragments){
   const next=advanceFragment(p,Math.max(0,(now-p.updatedAt)/1000));
   next.updatedAt=now;
   if(next.life<.015)fragments.delete(key);else fragments.set(key,next);
  }
  ctx.clearRect(0,0,width,height);
  sourceBlocks.clear();
  for(let y=0;y<height;y+=pixel){
   for(let x=0;x<width;x+=pixel){
    const shade=tone(x+pixel/2,y+pixel/2);
    if(!shade||rank(x,y)>shade.alpha)continue;
    const bx=Math.floor(x/block),by=Math.floor(y/block),key=bx+','+by;
    let source=sourceBlocks.get(key);
    if(!source){source={bx:bx*block,by:by*block,dots:[],visible:false};sourceBlocks.set(key,source);}
    source.dots.push({x,y,color:shade.color,rank:rank(x,y)});
    source.visible||=shade.color!==plum;
    const fragment=fragments.get(key);
    if(fragment&&!blockRestored(fragment.age,fragment.order))continue;
    ctx.fillStyle=shade.color;ctx.fillRect(x,y,pixel,pixel);
   }
  }
  for(const fragment of fragments.values()){
   const offset=chunkOffset(fragment.x,fragment.y,block);
   if(!offset.x&&!offset.y)continue;
   for(const dot of fragment.dots){
    if(dot.rank>fragment.life)continue;
    ctx.fillStyle=dot.color;
    ctx.fillRect(dot.x+offset.x,dot.y+offset.y,pixel,pixel);
   }
  }
  if(active||fragments.size)wake();
  else{blinkUntil=0;scheduleBlink(now);}
 }
 function scheduleBlink(now){
  if(reduced.matches||!visible||document.hidden)return;
  const delay=Math.max(16,Math.min(...eyes.map(eye=>eye.blink.start-now)));
  blinkTimer=setTimeout(wake,delay);
 }
 function wake(){
  clearTimeout(blinkTimer);blinkTimer=0;
  if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw);
 }
 function pointer(event){
  const rect=canvas.getBoundingClientRect();
  if(!rect.width)return;
  const current={x:(event.clientX-rect.left)*width/rect.width,y:(event.clientY-rect.top)*height/rect.height,time:event.timeStamp};
  for(const eye of eyes)eye.target=gazeOffset(current.x-eye.x,current.y-eye.y,cell*20/108,cell*10/108);
  if(lastPointer&&!reduced.matches&&event.pointerType!=='touch'){
   const dx=current.x-lastPointer.x,dy=current.y-lastPointer.y;
   const speed=Math.hypot(dx,dy);
   if(speed>.5){
    const contacts=[];
    const from={x:lastPointer.x/block,y:lastPointer.y/block},to={x:current.x/block,y:current.y/block};
    for(const gridPoint of traceCells(from,to)){
     const point={x:(gridPoint.x+.5)*block,y:(gridPoint.y+.5)*block};
     const key=gridPoint.x+','+gridPoint.y;
     const source=sourceBlocks.get(key),fragment=fragments.get(key);
     if(source?.visible&&(!fragment||blockRestored(fragment.age,fragment.order)))contacts.push(point);
     else for(const moving of fragments.values()){
      const offset=chunkOffset(moving.x,moving.y,block);
      if(moving.life>.08&&Math.floor((moving.bx+offset.x)/block)===gridPoint.x&&Math.floor((moving.by+offset.y)/block)===gridPoint.y){contacts.push(point);break;}
     }
    }
    if(contacts.length){
     const elapsed=current.time-lastPointer.time;
     for(const [key,source]of sourceBlocks){
      if(!source.visible)continue;
      let fragment=fragments.get(key);
      const offset=fragment?chunkOffset(fragment.x,fragment.y,block):{x:0,y:0};
      const distance=Math.min(...contacts.map(contact=>Math.hypot(source.bx+block/2+offset.x-contact.x,source.by+block/2+offset.y-contact.y)));
      const velocity=contactImpulse(dx,dy,distance,elapsed,block);
      if(!velocity.x&&!velocity.y)continue;
      if(!fragment){
       const gx=source.bx/block,gy=source.by/block;
       const hash=Math.sin(gx*12.9898+gy*78.233)*43758.5453;
       const random=hash-Math.floor(hash);
       fragment={x:0,y:0,vx:0,vy:0,life:1,age:0,bx:source.bx,by:source.by,updatedAt:performance.now(),order:.035+.93*(.72*random+.28*(.5+.5*Math.sin(gx*.39+gy*.61))),dots:source.dots.slice()};
       fragments.set(key,fragment);
      }
      const variation=.78+.22*Math.sin(source.bx*.48+Math.sin(source.by*.37));
      fragment.vx+=(velocity.x*variation-fragment.vx)*.56;
      fragment.vy+=(velocity.y*variation-fragment.vy)*.56;
      fragment.age=0;fragment.life=1;fragment.updatedAt=performance.now();
     }
    }
   }
  }
  lastPointer=current;
  wake();
 }
 landing.addEventListener('pointermove',pointer,{passive:true});
 landing.addEventListener('pointerleave',()=>{
  lastPointer=null;
  for(const eye of eyes)eye.target={x:0,y:0};
  wake();
 });
 field.addEventListener('click',()=>{if(!reduced.matches){blinkUntil=performance.now()+180;wake();}});
 field.addEventListener('keydown',event=>{
  const directions={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-10],ArrowDown:[0,10]};
  if(!directions[event.key])return;
  event.preventDefault();
    const [dx,dy]=directions[event.key];
    const x=dx*cell/108,y=dy*cell/108;
  for(const eye of eyes)eye.target={x,y};
  wake();
 });
 field.addEventListener('blur',()=>{for(const eye of eyes)eye.target={x:0,y:0};wake();});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){cancelAnimationFrame(frame);clearTimeout(blinkTimer);blinkTimer=0;frame=0;previousTime=0;lastPointer=null;}else wake();
 });
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(frame);clearTimeout(blinkTimer);blinkTimer=0;frame=0;previousTime=0;lastPointer=null;}}).observe(field);
 reduced.addEventListener('change',()=>{fragments.clear();blinkUntil=0;wake();});
 addEventListener('resize',resize);
 new ResizeObserver(resize).observe(field);
 resize();
}
export function addTrailSegment(trails,from,to,width,height){
 const block=25;
 const life=trailDensity(Math.hypot(to.x-from.x,to.y-from.y),to.time-from.time,block);
 for(const point of traceCells({x:from.x/block,y:from.y/block},{x:to.x/block,y:to.y/block})){
  const x=point.x*block,y=point.y*block;
  if(x<0||y<0||x>=width||y>=height)continue;
  const key=point.x+','+point.y;
  trails.set(key,{x,y,life:Math.max(life,trails.get(key)?.life||0)});
 }
}

export function mountHomeTrail(){
 const canvas=document.createElement('canvas');
 canvas.className='home-pixel-trail';
 canvas.setAttribute('aria-hidden','true');
 document.body.append(canvas);
 const ctx=canvas.getContext('2d');
 if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const trailColor=getComputedStyle(document.documentElement).getPropertyValue('--archive-trail').trim()||'#0c0712';
 const trails=new Map();
 const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 let width=innerWidth,height=innerHeight,lastPointer=null,frame=0,lastTime=0;
 function clear(){
  trails.clear();lastPointer=null;lastTime=0;
  cancelAnimationFrame(frame);frame=0;
  ctx.clearRect(0,0,width,height);
 }
 function resize(){
  clear();width=innerWidth;height=innerHeight;
  const ratio=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
  ctx.setTransform(ratio,0,0,ratio,0,0);
 }
 function draw(now){
  frame=0;
  if(document.hidden||reduced.matches){clear();return;}
  const dt=lastTime?Math.max(0,(now-lastTime)/1000):1/60;
  lastTime=now;
  ctx.clearRect(0,0,width,height);
  ctx.fillStyle=trailColor;
  for(const [key,trail] of trails){
   trail.life*=.94**(dt*60);
   if(trail.life<.015){trails.delete(key);continue;}
   for(let y=Math.ceil(trail.y/2)*2;y<trail.y+25;y+=2){
    for(let x=Math.ceil(trail.x/2)*2;x<trail.x+25;x+=2){
     const threshold=(bayer[(Math.floor(y/2)%4)*4+Math.floor(x/2)%4]+.5)/16;
     if(threshold<trail.life)ctx.fillRect(x,y,2,2);
    }
   }
  }
  if(trails.size)frame=requestAnimationFrame(draw);else lastTime=0;
 }
 document.addEventListener('pointermove',event=>{
  if(reduced.matches||event.pointerType==='touch')return;
  const next={x:event.clientX,y:event.clientY,time:event.timeStamp};
  if(lastPointer)addTrailSegment(trails,lastPointer,next,width,height);
  lastPointer=next;
  if(trails.size&&!frame)frame=requestAnimationFrame(draw);
 },{passive:true});
 document.addEventListener('pointerleave',()=>{lastPointer=null;});
 document.addEventListener('visibilitychange',clear);
 addEventListener('blur',clear);
 addEventListener('scroll',clear,{passive:true});
 addEventListener('resize',resize);
 reduced.addEventListener('change',clear);
 resize();
}
