import {mountFollowupInterviews,interviewPeople,followupPeople} from './interview-followups.js?v=feng-qin-humanized-1';
mountFollowupInterviews();
import {bookTitles,mountBookStudies} from './book-studies.js?v=movie-sources-2';
const stage=document.querySelector('.figma-stage');
const screens=[...document.querySelectorAll('.figma-screen')];
const routes={...Object.fromEntries(Object.entries(interviewPeople).map(([key,name])=>[name,'#'+key])),'A SHAPE OF HER':'index.html','(Collected Words)':'#words','(Interviews)':'#mom','(Film & Book Studies)':'#film','(Research)':'#research','Mom':'#mom','Grandma':'#grandma','Aunt 1':'#aunt1','Aunt 2':'#aunt2','Summary':'#summary','Connecting to Reality':'#reflection'};
const filmTitles=['The Bold, the Corrupt, and the Beautiful','Raise the Red Lantern','In the Mood for Love',...bookTitles,'Connecting to Reality'];
const normalize=s=>s.replace(/\s+/g,' ').trim();
const textOf=el=>normalize(el.querySelectorAll('p').length?[...el.querySelectorAll('p')].map(p=>p.textContent).join(' '):el.textContent);
for(const screen of screens){
 for(const tab of screen.querySelectorAll('[data-name="Interview navigation — left tabs"]>div')){
  const target=routes[textOf(tab)];if(!target)continue;
  const link=document.createElement('a');
  for(const attr of tab.attributes)link.setAttribute(attr.name,attr.value);
  link.href=target;link.setAttribute('aria-current','page');
  while(tab.firstChild)link.append(tab.firstChild);tab.replaceWith(link);
 }
 for(const el of screen.querySelectorAll('a,p')){
  const text=textOf(el);let target=routes[text];
  if(el.tagName==='P' && el.closest('a'))continue;
  if(el.tagName==='P' && !text.startsWith('('))continue;
  if(target && !el.closest('[data-name*="content"]')){
   if(el.tagName==='A')el.href=target;
   else {const a=document.createElement('a');a.href=target;a.style.cssText=el.style.cssText;el.removeAttribute('style');el.replaceWith(a);a.append(el);}
  }
 }
 for(const button of screen.querySelectorAll('button')){const i=filmTitles.indexOf(textOf(button));if(i>=0)button.addEventListener('click',()=>{location.hash='film/'+i;});}
 for(const el of screen.querySelectorAll('a')){
  const title=textOf(el);const i=filmTitles.indexOf(title);
  if(i>=0){el.href='#film/'+i;el.addEventListener('click',()=>requestAnimationFrame(()=>{
   const content=document.querySelector('#film [data-name="Films — scrollable studies"]');
   const block=document.querySelectorAll('#film [data-name^="Question"]')[i];
   if(block)content.scrollTop=block.offsetTop;
  }));}
 }
 for(const link of screen.querySelectorAll('[data-name="Interview navigation — left tabs"]>a')){
  if(!/^#(mom|grandma|aunt1|aunt2|xiaomin|xiaosheng|zhengjuan|fanghanqin|fengqin|summary)$/.test(link.getAttribute('href')||''))continue;
  link.addEventListener('click',()=>{
   const destination=document.querySelector(link.getAttribute('href'));
   for(const panel of destination.querySelectorAll('[data-name*="scrollable"]'))panel.scrollTop=0;
  });
 }
 }
for(const item of document.querySelectorAll('#film [data-name="Interview navigation — left tabs"]>:is(a,button)')){
 const text=textOf(item);
 const p=document.createElement('p');
 p.textContent=text;
 (item.querySelector(':scope>div')||item).replaceChildren(p);
}
// Remove the Summary entry from interview navigation.
for(const link of document.querySelectorAll('[data-name="Interview navigation — left tabs"]>a[href="#summary"]'))link.remove();
for(const block of document.querySelectorAll('#mom [data-name^="Question"],#grandma [data-name^="Question"],#aunt1 [data-name^="Question"],#aunt2 [data-name^="Question"],#film [data-name^="Question"]')){
 for(const paragraph of block.querySelectorAll('p'))if(!paragraph.textContent.replace(/[\s\u200b\ufeff]/g,''))paragraph.remove();
}
const researchIndex=document.querySelector('#research [data-name="Research — scrollable index"]');
if(researchIndex){
 const researchLead=researchIndex.querySelector('[data-node-id="221:57"]');
 if(researchLead){
  researchLead.classList.add('research-lead');
  const highlight=document.createElement('span');highlight.className='research-lead-highlight';
  for(const part of researchLead.textContent.split(/(social expectations|identities|choices)/g)){
   if(['identities','choices'].includes(part)){
    const keyword=document.createElement('span');keyword.className='research-lead-keyword';keyword.textContent=part;highlight.append(keyword);
   }else highlight.append(document.createTextNode(part));
  }
  researchLead.replaceChildren(highlight);
 }
 for(const id of ['221:59','221:60','221:61'])researchIndex.querySelector(`[data-node-id="${id}"]`)?.classList.add('research-column-heading');
 for(const id of ['221:62','221:65','221:68','221:71','221:74'])researchIndex.querySelector(`[data-node-id="${id}"]`)?.classList.add('research-number-year');
 for(const id of ['221:63','221:66','221:69','221:72','221:75'])researchIndex.querySelector(`[data-node-id="${id}"]`)?.classList.add('research-entry');
 for(const id of ['221:64','221:67','221:70','221:73','221:76'])researchIndex.querySelector(`[data-node-id="${id}"]`)?.classList.add('research-source');
 for(const id of ['221:77','221:78','221:79','221:80','221:81','221:82'])researchIndex.querySelector(`[data-node-id="${id}"]`)?.classList.add('research-divider');
 for(const ids of [['221:62','221:63','221:64'],['221:65','221:66','221:67'],['221:68','221:69','221:70'],['221:71','221:72','221:73'],['221:74','221:75','221:76']]){
  const row=document.createElement('article');row.className='research-row';
  for(const id of ids)row.append(researchIndex.querySelector(`[data-node-id="${id}"]`));
  researchIndex.append(row);
 }
 const placeholder=document.createElement('div');placeholder.className='research-image-placeholder';placeholder.setAttribute('role','img');placeholder.setAttribute('aria-label','Landscape image placeholder');
 const placeholderLabel=document.createElement('span');placeholderLabel.textContent='IMAGE / PLACEHOLDER';placeholder.append(placeholderLabel);researchIndex.append(placeholder);
}
const movieSources=[
 ['https://iffr.com/en/iffr/2018/films/the-bold-the-corrupt-and-the-beautiful','https://www.youtube.com/watch?v=ovaiB_YKf4s'],
 ['https://filmmovement.com/raise-the-red-lantern','https://www.youtube.com/watch?v=tLYJzEtmavg'],
 ['https://www.janusfilms.com/films/1021','https://www.youtube.com/watch?v=WJj9-t2A-_o']
];
for(const [index,block] of [...document.querySelectorAll('#film [data-name^="Question"]')].entries()){
 const meta=block.querySelector(':scope > :nth-child(2) > p');
 if(meta&&meta.textContent.includes('·')){
  meta.classList.add('film-meta');
  const parts=meta.textContent.split('·').map(part=>part.trim()).filter(Boolean);
  meta.replaceChildren(...parts.map(part=>{const chip=document.createElement('span');chip.className='film-meta-chip';chip.textContent=part;return chip;}));
 }
 if(movieSources[index]){
  for(const [sourceIndex,label] of ['Film information','Watch trailer'].entries()){
   const link=document.createElement('a');link.className='book-source movie-source movie-link-coming-soon';link.href=movieSources[index][sourceIndex];link.target='_blank';link.rel='noopener noreferrer';link.textContent=label+' ↗';block.append(link);
  }
 }
}
const filmPhotos=document.querySelector('#film [data-name="Family photographs — original proportions"]');
const filmAnswers=document.querySelector('#film [data-name="Interview — editable questions and answers"]');
const realityQuestions=[...document.querySelectorAll('#reflection [data-name^="Question"]')];
if(filmPhotos&&filmAnswers&&realityQuestions.length){
 const still=document.createElement('div');still.className='film-placeholder';still.setAttribute('role','img');still.setAttribute('aria-label','Image placeholder');
 const stillLabel=document.createElement('span');stillLabel.textContent='IMAGE / PLACEHOLDER';still.append(stillLabel);filmPhotos.append(still);
 const block=document.createElement('div');block.dataset.name='Question 4';block.className='film-reality';
 const title=document.createElement('div');const titleText=document.createElement('p');titleText.textContent='Connecting films & books with REALITY';title.append(titleText);
 const body=document.createElement('div');
 realityQuestions.forEach((question,index)=>{
  const lines=[...question.querySelectorAll('p')].map(p=>normalize(p.textContent)).filter(Boolean);
  if(!lines.length)return;
  if(index===0){const intro=document.createElement('p');intro.className='film-reality-intro';intro.textContent=lines.at(-1);body.append(intro);return;}
  const heading=document.createElement('p');heading.className='film-reality-heading';heading.textContent=lines[0];body.append(heading);
  for(const line of lines.slice(1)){const paragraph=document.createElement('p');paragraph.textContent=line;body.append(paragraph);}
 });
 block.append(title,body);filmAnswers.append(block);
}
mountBookStudies();
for(const [id,name] of Object.entries(interviewPeople)){
 const panel=document.querySelector(`#${id} [data-name="Interview — editable questions and answers"]`);
 const firstQuestion=panel?.querySelector('[data-name^="Question"]');
 if(!panel||!firstQuestion||panel.querySelector('.interview-intro'))continue;
 const answer=(firstQuestion.querySelector(':scope > :nth-child(2)')?.textContent||'').replace(/\s+/g,' ').trim()||'A line from this conversation will appear here.';
 const quote=followupPeople[id]?.quote|| (id==='mom'?'We have the older ones and the younger ones to look after.':id==='grandma'?'I regret marrying your grandpa.':id==='aunt1'?'I would listen more patiently to my elders.':(answer.match(/^.*?[.!?](?:\s|$)/)?.[0]||answer.slice(0,150)).trim());
 const intro=document.createElement('header');intro.className='interview-intro';
 const date=document.createElement('p');date.className='interview-date';date.textContent=({mom:'09.25.2026',grandma:'09.26.2025',aunt1:'09.27.2026',aunt2:'09.30.2026',xiaomin:'10.12.2026',xiaosheng:'10.12.2026',zhengjuan:'10.12.2026',fanghanqin:'10.13.2026',fengqin:'10.13.2026'})[id]||'MM.DD.YYYY';
 const title=document.createElement('h2');title.className='interview-title';title.textContent=`A Conversation With ${name}`;
 const pullQuote=document.createElement('p');pullQuote.className='interview-pull-quote';const pullMark=document.createElement('span');pullMark.textContent=`“${quote}”`;pullQuote.append(pullMark);
 intro.append(date,title,pullQuote);panel.insertBefore(intro,firstQuestion);
}
const aunt2Root=document.querySelector('#aunt2>div');
const aunt2Content=document.createElement('div');aunt2Content.className='aunt2-responsive-content';
for(const name of ['Aunt 2 — scrollable photographs','Aunt 2 — scrollable interview']){
 const panel=aunt2Root.querySelector(`[data-name="${name}"]`);if(panel)aunt2Content.append(panel);
}
aunt2Root.append(aunt2Content);
function resize(){
 const header=syncTopbars();
 const headerHeight=Math.ceil(header?.getBoundingClientRect().bottom||54);
 if(innerWidth<=1100){
  stage.style.transform='none';stage.style.left='0px';stage.style.top='0px';
  document.documentElement.style.setProperty('--responsive-header-height',`${headerHeight+10}px`);
  document.documentElement.style.setProperty('--responsive-tabs-height','0px');
  document.body.style.setProperty('--interview-header-height',`${headerHeight}px`);
  return;
 }
 const key=location.hash.slice(1).split('/')[0];const full=['mom','grandma','aunt1','aunt2','xiaomin','xiaosheng','zhengjuan','fanghanqin','fengqin','film','words','research','summary'].includes(key);
 const scale=full?innerWidth/1440:Math.min(innerWidth/1440,innerHeight/766);
 const top=headerHeight-54*scale;
 stage.style.transform=`scale(${scale})`;stage.style.left=full?'0px':`${(innerWidth-1440*scale)/2}px`;stage.style.top=`${top}px`;
 const height=Math.max(54,(innerHeight-top)/scale);
 stage.style.setProperty('--interview-viewport-height',`${height}px`);
 stage.style.setProperty('--film-height',`${height}px`);
 document.body.style.setProperty('--interview-header-height',`${headerHeight}px`);
}
function show(){const [key,filmIndex]=location.hash.slice(1).split('/');if(key==='reflection'){location.replace('#film/8');return;}for(const s of screens)s.hidden=s.id!==key;if(!screens.some(s=>s.id===key))screens[0].hidden=false;
 for(const menu of new Set(Object.keys(interviewPeople).map(getSectionNavigation).filter(Boolean))){for(const link of menu.querySelectorAll(':scope>a')){if(link.getAttribute('href')===`#${key}`)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}}
 for(const button of getSectionNavigation('film')?.querySelectorAll(':scope>:is(button,a)')||[]){
  const selected=filmTitles.indexOf(textOf(button))===Number(filmIndex||0);
  if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
 }
 resize();
 if(key==='film'&&filmIndex){requestAnimationFrame(()=>{const content=document.querySelector('#film [data-name="Films — scrollable studies"]');const blocks=[...document.querySelectorAll('#film [data-name^="Question"]')];const block=blocks[Number(filmIndex)];if(block)content.scrollTop=block.offsetTop;});}}
addEventListener('resize',resize);addEventListener('hashchange',show);resize();show();
import {initWords} from './words.js?v=filter-ready-10';
initWords().catch(error=>console.error(error));
import {alignTopbars,syncTopbars,getSectionNavigation} from './topbar.js?v=interface-review-5';
alignTopbars();resize();document.fonts.ready.then(resize);
import {initPassageReader} from './passage-reader.js?v=reading-view-1';
initPassageReader().catch(error=>console.error(error));

import {initInterviewScroll} from './interview-scroll.js?v=progress-1';
initInterviewScroll(Object.keys(interviewPeople));
