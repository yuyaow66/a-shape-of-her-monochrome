export function refineInterviews(){
 const screens=[];
 for(const layout of document.querySelectorAll('.slate-interview')){
  const screen=layout.closest('.figma-screen');
  const panel=layout.querySelector('[data-name="Interview — editable questions and answers"]');
  const photos=layout.querySelector('[data-name="Family photographs — original proportions"]');
  if(!screen||!panel||!photos||layout.classList.contains('interview-composition'))continue;
  const images=[...photos.querySelectorAll('img')].filter(image=>image.getAttribute('src')?.trim());
  const title=panel.querySelector('.interview-title');
  const name=title?.textContent.replace(/^A Conversation With\s*/i,'').trim();
  screen.classList.add('interview-refined');
  layout.classList.add('interview-composition',images.length?'interview-with-photos':'interview-text-only');
  panel.classList.add('interview-conversation');
  photos.classList.add('interview-photographs');
  photos.hidden=images.length===0;
  if(images.length){
   photos.tabIndex=0;
   photos.setAttribute('role','region');
   photos.setAttribute('aria-label',name?`Family photographs of ${name}`:'Family photographs');
   for(const frame of photos.children)if(frame.querySelector('img'))frame.classList.add('interview-photo-frame');
  }else{
   photos.removeAttribute('tabindex');
  }
  if(title){
   if(!title.id)title.id=`interview-title-${screen.id}`;
   screen.setAttribute('aria-labelledby',title.id);
  }
  layout.prepend(photos);
  screens.push(screen);
 }
 synchronizeColumns(screens);
 return screens;
}

function synchronizeColumns(screens){
 const records=screens.map(screen=>({screen,layout:screen.querySelector('.interview-composition'),photos:screen.querySelector('.interview-photographs'),conversation:screen.querySelector('.interview-conversation'),shorter:null}));
 const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');
 let frame=0,needsMeasure=true,active=null;
 const clear=record=>{
  record.shorter?.classList.remove('interview-scroll-column');
  record.shorter?.style.removeProperty('--interview-scroll-offset');
  record.shorter=null;
 };
 function measure(){
  active=null;
  for(const record of records){
   clear(record);
   if(record.screen.hidden||reducedMotion.matches||!record.layout.classList.contains('interview-with-photos'))continue;
   const photos=record.photos.getBoundingClientRect(),conversation=record.conversation.getBoundingClientRect();
   if(conversation.left<photos.right)continue;
   const height=Math.max(photos.height,conversation.height),shortHeight=Math.min(photos.height,conversation.height);
   const viewport=innerHeight-48;
   if(height<=viewport||height-shortHeight<1)continue;
   const top=record.layout.getBoundingClientRect().top+scrollY;
   const start=Math.max(0,top-24);
   const end=Math.min(top+height-innerHeight+24,document.documentElement.scrollHeight-innerHeight);
   if(end-start<80)continue;
   Object.assign(record,{start,end,distance:height-shortHeight,shorter:photos.height<conversation.height?record.photos:record.conversation});
   record.shorter.classList.add('interview-scroll-column');
   active=record;
  }
  needsMeasure=false;
 }
 function render(){
  frame=0;
  if(needsMeasure)measure();
  if(!active)return;
  const progress=Math.max(0,Math.min(1,(scrollY-active.start)/(active.end-active.start)));
  active.shorter.style.setProperty('--interview-scroll-offset',`${(progress*active.distance).toFixed(3)}px`);
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render);}
 function refresh(){needsMeasure=true;schedule();}
 const observer=new ResizeObserver(refresh);
 for(const record of records){
  observer.observe(record.layout);observer.observe(record.photos);observer.observe(record.conversation);
  for(const image of record.photos.querySelectorAll('img'))image.addEventListener('load',refresh,{once:true});
 }
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',refresh);
 addEventListener('hashchange',refresh);
 addEventListener('load',refresh,{once:true});
 reducedMotion.addEventListener('change',refresh);
 document.fonts.ready.then(refresh);
 refresh();
}
