// Read from the existing Figma paragraphs; no rewritten or generated content.
import {interviewPeople as people} from './interview-followups.js?v=feng-qin-humanized-1';
const clean=text=>text.replace(/\u200b/g,'').replace(/\s+/g,' ').trim();
const readText=node=>node.nodeName==='BR'?' ':node.nodeType===3?node.textContent:[...node.childNodes].map(readText).join('')+(['P','DIV'].includes(node.nodeName)?' ':'');
const button=(text,label,action)=>{
 const element=document.createElement('button');element.type='button';element.textContent=text;
 element.setAttribute('aria-label',label);element.addEventListener('click',action);return element;
};
export async function initPassageReader(){
 const response=await fetch('content/my-pov.json?v=fang-humanized-1');if(!response.ok)throw new Error('My POV could not be loaded');
 const insights=await response.json();
 const entries=[];
 for(const key of Object.keys(people)){
  const screen=document.getElementById(key);
  for(const block of screen.querySelectorAll('[data-name^="Question"]')){
   const heading=clean(readText(block.firstElementChild));
   const paragraphs=[...block.children].slice(1).flatMap(child=>child.tagName==='P'?[child]:[...child.querySelectorAll('p')]).map(p=>clean(p.textContent)).filter(Boolean);
   const photo=screen.querySelector('[style*="background-image"]');
   const image=screen.querySelector('img[src$=".png"],img[src$=".jpg"],img[src$=".webp"]');
   const entry={key,heading,paragraphs,photo:key==='film'?'':photo?.style.backgroundImage||(image?`url("${image.src}")`:''),label:people[key]||heading};
   entries.push(entry);
   const open=button('↗','Read '+heading,()=>openReader(entry));
   open.className='passage-open';block.classList.add('passage-source');block.append(open);
  }
 }
 const reader=document.createElement('dialog');reader.className='passage-reader';reader.setAttribute('aria-label','Read passage');
 const photo=document.createElement('div');photo.className='passage-photo';photo.setAttribute('aria-hidden','true');
 const toolbar=document.createElement('div');toolbar.className='passage-toolbar';
 const peopleNav=document.createElement('nav');peopleNav.setAttribute('aria-label','Interviews');
 const back=button('Close ×','Close reader',()=>reader.close());back.className='passage-back';toolbar.append(peopleNav,back);
 const text=document.createElement('div');text.className='passage-text';text.tabIndex=0;text.setAttribute('role','region');text.setAttribute('aria-label','Passage text');reader.append(photo,toolbar,text);document.body.append(reader);
 let current,origin,showPov=false,fitKey='',fitFrame=0;
 function openReader(entry){
  origin=document.activeElement;current=entry;showPov=false;renderReader();reader.showModal();fitReader();back.focus();
 }
 function renderReader(focusKey=null){
  const focusedTab=focusKey||(peopleNav.contains(document.activeElement)?document.activeElement.dataset.passagePerson:null);
  const questionIndex=entries.filter(entry=>entry.key==='mom').findIndex(entry=>entry.heading===current.heading);
  const insight=insights[questionIndex]||{paragraphs:['to be updated']};
  photo.style.backgroundImage=showPov?'':current.photo;peopleNav.replaceChildren();
  if(current.key!=='film'){
   for(const [key,name] of Object.entries(people)){
    const match=entries.find(entry=>entry.key===key&&entry.heading===current.heading);if(!match)continue;
    const tab=button(name,name,()=>{current=match;showPov=false;renderReader(key);reader.scrollTop=0;});
    tab.dataset.passagePerson=key;
    tab.setAttribute('aria-pressed',String(!showPov&&key===current.key));peopleNav.append(tab);
   }
  }
  const povTab=button('My POV','My POV',()=>{showPov=true;renderReader('pov');reader.scrollTop=0;});
  povTab.dataset.passagePerson='pov';
  povTab.setAttribute('aria-pressed',String(showPov));peopleNav.append(povTab);
  populateText(text,showPov?insight.paragraphs:current.paragraphs);text.scrollTop=0;
  if(reader.open)fitReader();
  if(focusedTab)[...peopleNav.children].find(tab=>tab.dataset.passagePerson===focusedTab)?.focus({preventScroll:true});
 }
 function populateText(target,paragraphs){
  target.replaceChildren();
  const heading=document.createElement('h2');heading.textContent=current.heading;target.append(heading);
  for(const passage of paragraphs){
   const row=document.createElement('div');row.className='passage-row';
   const paragraph=document.createElement('p');paragraph.textContent=passage;row.append(paragraph);target.append(row);
  }
 }
 function fitReader(force=false){
  if(!reader.open)return;
  const width=reader.getBoundingClientRect().width;
  const key=current.key+'|'+showPov+'|'+current.heading+'|'+width+'|'+toolbar.getBoundingClientRect().height;
  if(!force&&key===fitKey)return;
  const probe=reader.cloneNode(true);probe.setAttribute('open','');probe.setAttribute('aria-hidden','true');probe.inert=true;
  for(const [property,value]of Object.entries({'display':'block','position':'fixed','inset':'auto','left':'-10000px','top':'0','width':width+'px','max-width':'none','height':'auto','max-height':'none','min-height':'0','margin':'0','visibility':'hidden','pointer-events':'none','overflow':'hidden'}))probe.style.setProperty(property,value,'important');
  document.body.append(probe);
  const contentHeight=probe.getBoundingClientRect().height;
  probe.remove();
  reader.style.setProperty('--passage-fit-height',Math.min(640,Math.ceil(contentHeight))+'px');fitKey=key;
 }
 const scheduleFit=()=>{if(!fitFrame)fitFrame=requestAnimationFrame(()=>{fitFrame=0;fitReader(true);});};
 addEventListener('resize',scheduleFit);document.fonts.ready.then(scheduleFit);
 reader.addEventListener('close',()=>origin?.focus({preventScroll:true}));
 reader.addEventListener('keydown',event=>{
  if(event.target.tagName==='BUTTON'||showPov)return;
  if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
  const matches=entries.filter(entry=>entry.key!=='film'&&entry.heading===current.heading);
  const index=matches.indexOf(current),step=event.key==='ArrowRight'?1:-1;
  current=matches[(index+step+matches.length)%matches.length];renderReader();event.preventDefault();
 });

 addEventListener('hashchange',()=>{if(reader.open)reader.close();});
}
