import './original-layout.js?v=slate-base-1';
import {aboutCopy} from './slate-copy.js';
import {refineResearch} from './research-refinement.js';
import {refineReality} from './reality-refinement.js';
import {refineInterviews} from './interview-refinement.js';
import {interviewPeople} from './interview-followups.js?v=feng-qin-humanized-1';
import {bookTitles} from './book-studies.js?v=movie-sources-2';

document.body.classList.add('slate-site');
for(const sheet of document.querySelectorAll('link[rel=stylesheet]'))if(!['/slate.css','/research-refinement.css','/reality-refinement.css','/reader-refinement.css','/interview-refinement.css'].some(path=>sheet.href.includes(path)))sheet.media='not all';
for(const style of document.querySelectorAll('style'))style.remove();
const stage=document.querySelector('.figma-stage');
for(const node of stage.querySelectorAll('[style]'))node.removeAttribute('style');
const create=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node;};
const link=(en,href)=>{const node=create('a','',en);node.href=href;return node;};
const heading=en=>create('h1','slate-page-heading',en);
const sections=[['words','Collected Words'],['mom','Interviews'],['film','Film & Book Studies'],['research','Research']];
const oldHeader=document.querySelector('.site-header');
const interviewMenu=oldHeader?.querySelector('[data-section=interviews].section-dropdown-menu');
const studyMenu=oldHeader?.querySelector('[data-section=film].section-dropdown-menu');
const context=(kind,menu)=>{
 const nav=create('nav','slate-context');nav.setAttribute('aria-label',kind);
 if(menu)for(const item of [...menu.children]){
  const original=item.textContent.replace(/\s+/g,' ').trim();
  const target=item.getAttribute('href')||`#film/${[...menu.children].indexOf(item)}`;
  if(target==='#summary')continue;
  nav.append(link(original,target));
 }
 return nav;
};
const filmNames=['The Bold, the Corrupt, and the Beautiful','Raise the Red Lantern','In the Mood for Love',...bookTitles,'Connecting to Reality'];
const filmPictures=[...document.querySelectorAll('#film [data-name="Family photographs — original proportions"]>div')].map(node=>({src:node.querySelector('img')?.getAttribute('src'),credit:node.querySelector('.book-cover-credit')?.cloneNode(true)}));
for(const [id,name]of Object.entries(interviewPeople)){
 const screen=document.getElementById(id),root=screen.firstElementChild;
 const panel=root.querySelector('[data-name="Interview — editable questions and answers"]');
 const photos=root.querySelector('[data-name="Family photographs — original proportions"]');
 const layout=create('div','slate-interview');layout.append(panel,photos);
 for(const image of photos.querySelectorAll('img')){if(!image.alt)image.alt=`${name} — family photograph`;image.loading='lazy';}
 root.replaceChildren(context('Interviews',interviewMenu),layout);
}
document.getElementById('summary')?.remove();
const studies=document.getElementById('film');
const studyList=studies.querySelector('[data-name="Interview — editable questions and answers"]');
studyList.classList.add('slate-study-list');studyList.dataset.name='Films — scrollable studies';
const studyBlocks=[...studyList.querySelectorAll(':scope>[data-name^="Question"]')];
for(const [index,block]of studyBlocks.entries()){
 block.id=`study-${index}`;const first=block.firstElementChild;
 const {src,credit}=filmPictures[index]||{};
 if(src){const picture=create('figure','slate-study-picture');const image=create('img');image.src=src;image.alt=filmNames[index]||'Film or book';image.loading='lazy';picture.append(image);if(credit)picture.append(credit);block.append(picture);}
}
studies.firstElementChild.classList.add('slate-studies');
studies.firstElementChild.replaceChildren(context('Film & Book Studies',studyMenu),heading('Film & Book Studies'),studyList);
const research=document.getElementById('research');
const researchContent=research.querySelector('[data-name="Research — scrollable index"]');researchContent.classList.add('slate-research');
research.firstElementChild.replaceChildren(heading('Research'),researchContent);
const words=document.getElementById('words'),wordRoot=words.firstElementChild;
const gallery=wordRoot.querySelector('.words-gallery'),filters=wordRoot.querySelector('#words-filter-panel');
const filterToggle=wordRoot.querySelector('.words-filter-open');
wordRoot.replaceChildren(heading('Collected Words'),...(filterToggle?[filterToggle]:[]),filters,gallery);
new MutationObserver(()=>{
 const toggle=wordRoot.querySelector('.words-filter-open');
 if(toggle&&toggle.nextElementSibling!==filters)wordRoot.insertBefore(toggle,filters);
}).observe(wordRoot,{childList:true});
const information=create('section','figma-screen');information.id='about';information.hidden=true;
const article=create('article','slate-article');article.append(heading('A Shape of Her'));
for(const language of ['en']){
 const block=create('section','slate-language');block.lang='en';
 for(const pair of aboutCopy)block.append(create('p','',pair[language]));article.append(block);
}
information.append(article);stage.append(information);
for(const paragraph of stage.querySelectorAll('p'))if(!paragraph.textContent.replace(/[\s\u200b\ufeff]/g,'')&&!paragraph.querySelector('img,svg,button'))paragraph.remove();
refineInterviews();refineResearch();refineReality();
const rail=create('nav','slate-rail');rail.setAttribute('aria-label','Global navigation');
const brand=link('A Shape of Her','index.html');brand.className='slate-brand';rail.append(brand);
const sectionRail=create('nav','slate-section-rail');sectionRail.setAttribute('aria-label','Archive sections');
for(const [route,en]of sections){const anchor=link(en,`#${route}`);anchor.dataset.route=route;sectionRail.append(anchor);}
oldHeader?.remove();document.body.prepend(rail,sectionRail);
const updateArchiveSpacing=()=>document.documentElement.style.setProperty('--slate-mobile-nav-height',`${innerWidth<=560?Math.ceil(sectionRail.getBoundingClientRect().height):0}px`);
new ResizeObserver(updateArchiveSpacing).observe(sectionRail);addEventListener('resize',updateArchiveSpacing);updateArchiveSpacing();document.fonts.ready.then(updateArchiveSpacing);
const skip=create('a','slate-skip','Skip to content');skip.href='#archive-content';stage.id='archive-content';stage.tabIndex=-1;document.body.prepend(skip);
skip.addEventListener('click',event=>{event.preventDefault();stage.focus();stage.scrollIntoView();});
new MutationObserver(()=>{if(gallery.inert)gallery.inert=false;}).observe(gallery,{attributes:true,attributeFilter:['inert']});
gallery.inert=false;
const screens=[...stage.querySelectorAll('.figma-screen')];
function route(){
 if(location.hash==='#index'){location.replace('index.html');return;}
 let key=location.hash.slice(1).split('/')[0]||'words';if(key==='reflection')key='film';if(key==='summary'){location.replace('#mom');return;}if(!screens.some(screen=>screen.id===key))key='words';
 for(const screen of screens)screen.hidden=screen.id!==key;
 for(const anchor of rail.querySelectorAll('a')){if(anchor.hash===`#${key}`)anchor.setAttribute('aria-current','page');else anchor.removeAttribute('aria-current');}
 for(const anchor of sectionRail.querySelectorAll('a')){
  const current=anchor.dataset.route===key||(anchor.dataset.route==='mom'&&key in interviewPeople);
  if(current)anchor.setAttribute('aria-current','page');else anchor.removeAttribute('aria-current');
 }
 for(const anchor of stage.querySelectorAll('.slate-context a')){if(anchor.hash===location.hash)anchor.setAttribute('aria-current','page');else anchor.removeAttribute('aria-current');}
 document.title=`${key==='about'?'Information':interviewPeople[key]||sections.find(section=>section[0]===key)?.[1]||'Archive'} — A Shape of Her`;
 window.scrollTo({top:0,behavior:'instant'});
 if(key==='film'&&location.hash.includes('/'))requestAnimationFrame(()=>document.getElementById(`study-${Number(location.hash.split('/')[1])||0}`)?.scrollIntoView({behavior:'instant',block:'start'}));
 scheduleRealityDirectory();
}
const realityDirectoryLinks=[...document.querySelectorAll('.reality-directory a')];
const realityNoteHeadings=realityDirectoryLinks.map((anchor,index)=>document.getElementById(`reality-note-${index+1}`));
let realityDirectoryFrame=0;
function setRealityDirectory(index){
 for(const [itemIndex,anchor]of realityDirectoryLinks.entries()){
  if(itemIndex===index){if(anchor.getAttribute('aria-current')!=='location')anchor.setAttribute('aria-current','location');}
  else if(anchor.hasAttribute('aria-current'))anchor.removeAttribute('aria-current');
 }
}
function scheduleRealityDirectory(){
 if(studies.hidden||realityDirectoryFrame||!realityDirectoryLinks.length)return;
 realityDirectoryFrame=requestAnimationFrame(()=>{
  realityDirectoryFrame=0;
  if(studies.hidden)return;
  const threshold=Math.max(innerHeight*.25,innerWidth<=560?sectionRail.getBoundingClientRect().bottom+24:24);
  let current=0;
  realityNoteHeadings.forEach((heading,index)=>{if(heading&&heading.getBoundingClientRect().top<=threshold)current=index;});
  if(scrollY+innerHeight>=document.documentElement.scrollHeight-2)current=realityDirectoryLinks.length-1;
  setRealityDirectory(current);
 });
}
for(const [index,anchor]of realityDirectoryLinks.entries())anchor.addEventListener('click',event=>{
 event.preventDefault();event.stopImmediatePropagation();
 document.getElementById(`reality-note-${index+1}`)?.scrollIntoView({behavior:'smooth',block:'start'});
 setRealityDirectory(index);
},true);
addEventListener('scroll',scheduleRealityDirectory,{passive:true});addEventListener('resize',scheduleRealityDirectory);
addEventListener('hashchange',route);addEventListener('load',()=>requestAnimationFrame(route),{once:true});route();
