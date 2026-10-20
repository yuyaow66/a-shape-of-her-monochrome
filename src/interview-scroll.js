const photoSelector='[data-name="Family photographs — original proportions"]';
const textSelector='[data-name="Interview — editable questions and answers"]';
const range=element=>Math.max(0,element.scrollHeight-element.clientHeight);
const clamp=value=>Math.max(0,Math.min(1,value));

export function initInterviewScroll(keys){
 const columns=matchMedia('(min-width:701px)');
 const desktop=matchMedia('(min-width:1101px)');
 const controllers=new Map();
 for(const key of keys){
  const screen=document.getElementById(key);
  const photos=screen?.querySelector(photoSelector);
  const text=screen?.querySelector(textSelector);
  const outerPhotos=key==='aunt2'?screen.querySelector('[data-name="Aunt 2 — scrollable photographs"]'):null;
  if(!photos||!text)continue;
  screen.classList.add('interview-linked-scroll');
  let progress=0,frame=0,source=null,expected=new WeakMap();
  const photoScroller=()=>outerPhotos&&desktop.matches?outerPhotos:photos;
  const active=()=>columns.matches&&!screen.hidden;
  const apply=()=>{
   frame=0;if(!active()){source=null;return;}
   const pair=[photoScroller(),text];
   if(source&&pair.includes(source)&&range(source)>0)progress=clamp(source.scrollTop/range(source));
   source=null;
   for(const panel of pair){
    const top=progress*range(panel);
    if(Math.abs(panel.scrollTop-top)>.5){panel.scrollTop=top;expected.set(panel,panel.scrollTop);}
   }
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(apply);};
  const onScroll=event=>{
   if(!active())return;
   const panel=event.currentTarget;
   if(panel!==photoScroller()&&panel!==text)return;
   const target=expected.get(panel);expected.delete(panel);
   if(target!==undefined&&Math.abs(panel.scrollTop-target)<1)return;
   if(range(panel)<=0)return;
   source=panel;schedule();
  };
  for(const panel of new Set([photos,text,outerPhotos].filter(Boolean)))panel.addEventListener('scroll',onScroll,{passive:true});
  (outerPhotos||photos).addEventListener('wheel',event=>{
   if(!active()||event.ctrlKey||event.shiftKey||event.defaultPrevented||Math.abs(event.deltaX)>Math.abs(event.deltaY)||range(photoScroller())>0||range(text)<=0)return;
   event.preventDefault();
   const unit=event.deltaMode===1?16:event.deltaMode===2?text.clientHeight:1;
   text.scrollTop+=event.deltaY*unit;
  },{passive:false});
  const observer=new ResizeObserver(schedule);
  for(const panel of new Set([photos,text,outerPhotos].filter(Boolean))){
   observer.observe(panel);
   for(const child of panel.children)observer.observe(child);
  }
  for(const image of photos.querySelectorAll('img'))image.addEventListener('load',schedule,{passive:true});
  controllers.set(key,{refresh:schedule,reset:()=>{progress=0;source=null;expected=new WeakMap();schedule();}});
  schedule();
 }
 const refresh=()=>{for(const controller of controllers.values())controller.refresh();};
 let current=location.hash.slice(1).split('/')[0];
 addEventListener('hashchange',()=>{
  const key=location.hash.slice(1).split('/')[0];
  if(key!==current)controllers.get(key)?.reset();
  current=key;refresh();
 });
 document.addEventListener('click',event=>{
  const link=event.target.closest('.site-header a[href^="#"]');
  if(link)controllers.get(link.getAttribute('href').slice(1).split('/')[0])?.reset();
 });
 addEventListener('resize',refresh);
 columns.addEventListener('change',refresh);desktop.addEventListener('change',refresh);
 document.fonts.ready.then(refresh);
}
