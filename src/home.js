import {bookTitles} from './book-studies.js?v=analysis-humanized-1';
import {interviewPeople} from './interview-followups.js?v=feng-qin-humanized-1';
import {mountHomeEyes,mountHomeTrail} from './home-eye.js?v=moriyama-1';
const home=document.querySelector('.figma-home');
const landing=home.querySelector('[data-name="index"]');
const menus=[];
landing.classList.add('home-landing');
landing.firstElementChild.classList.add('home-background');

document.querySelector('[data-node-id="1:411"]')?.remove();

function node(id){return document.querySelector(`[data-node-id="${id}"]`);}
function group(className,elements){
 const container=document.createElement('div');
 container.className=className;
 for(const element of elements)container.append(element);
 landing.append(container);
 return container;
}

const routes={'1:406':'words','1:405':'mom','1:408':'film','1:409':'research'};
const navigation=document.createElement('nav');
navigation.className='home-navigation';
navigation.setAttribute('aria-label','Main navigation');
for(const [id,key] of Object.entries(routes)){
 const element=node(id);
 let link=element;
 if(element.tagName!=='A'){
  link=document.createElement('a');
  link.style.cssText=element.style.cssText;
  element.removeAttribute('style');
  element.replaceWith(link);
  link.append(element);
 }
 link.href='original-layout.html#'+key;
 link.classList.add('home-nav-link');
 const entry=document.createElement('div');
 entry.className='home-nav-entry';
 entry.append(link);
 navigation.append(entry);
}
landing.append(navigation);

const about=document.querySelector('#about');
const trigger=node('146:61');
const close=document.querySelector('[data-name="Close About"]');
const aboutSheet=about.firstElementChild;
const aboutCopy=node('8:435');
trigger.classList.add('home-about-trigger');
trigger.setAttribute('aria-label','About this personal research archive');
trigger.setAttribute('aria-expanded','false');
trigger.setAttribute('aria-controls','about');
trigger.querySelector('[role=button]')?.removeAttribute('role');
trigger.querySelector('[tabindex]')?.removeAttribute('tabindex');
trigger.querySelector('p').classList.add('home-about-label');
const shortAboutLabel=document.createElement('span');
shortAboutLabel.className='home-about-short-label';
shortAboutLabel.textContent='(ABOUT)';
shortAboutLabel.setAttribute('aria-hidden','true');
trigger.append(shortAboutLabel);

const smallBrand=node('1:390');
smallBrand.classList.add('home-small-brand','site-brand');
const smallOrnament=node('1:391');
smallOrnament.classList.add('home-small-ornament');
const brandmark=group('home-brandmark',[smallBrand,smallOrnament]);
const headerRule=node('1:399');
headerRule.classList.add('home-header-rule');
const header=group('home-header',[brandmark,trigger,headerRule]);
landing.insertBefore(header,navigation);

const title=node('1:417');
title.classList.add('home-title');
title.setAttribute('role','heading');
title.setAttribute('aria-level','1');
title.setAttribute('aria-label','WHO SHAPES HER LIFE?');
title.replaceChildren();
for(const text of ['WHO SHAPES ','HER LIFE?']){
 const line=document.createElement('span');
 line.className='home-title-line';
 line.setAttribute('aria-hidden','true');
 for(const character of text){
  if(character===' '){line.append(document.createTextNode(character));continue;}
  const letter=document.createElement('span');
  letter.className='home-title-char';
  letter.textContent=character;
  line.append(letter);
 }
 title.append(line);
}
const ornament=node('1:418');
ornament.classList.add('home-title-ornament');
const masthead=group('home-masthead',[title,ornament]);
const titleLetters=[...title.querySelectorAll('.home-title-char')];
const titleMotion=matchMedia('(prefers-reduced-motion:reduce)');
let titleTimer=0,titleCount=0,titleDeleting=false,titleInView=!('IntersectionObserver' in window),titleFontsReady=false,titleDelay=250;
masthead.classList.add('home-title-ready');
function titleCanAnimate(){return titleFontsReady&&titleInView&&!titleMotion.matches&&!document.hidden&&about.hidden;}
function advanceTitle(){
 titleTimer=0;
 if(!titleCanAnimate())return;
 if(titleDeleting)titleLetters[--titleCount].classList.remove('is-visible');
 else titleLetters[titleCount++].classList.add('is-visible');
 if(titleCount>0)ornament.classList.add('is-visible');
 if(titleCount===titleLetters.length){titleDeleting=true;titleDelay=1600;}
 else if(titleCount===0){titleDeleting=false;titleDelay=550;}
 else titleDelay=titleDeleting?75:110;
 titleTimer=setTimeout(advanceTitle,titleDelay);
}
function syncTitleMotion(reset=false){
 clearTimeout(titleTimer);titleTimer=0;
 if(titleMotion.matches){
  titleLetters.forEach(letter=>letter.classList.add('is-visible'));ornament.classList.add('is-visible');return;
 }
 if(reset){titleLetters.forEach(letter=>letter.classList.remove('is-visible'));titleCount=0;titleDeleting=false;titleDelay=250;}
 if(titleCanAnimate())titleTimer=setTimeout(advanceTitle,titleDelay);
}
if('IntersectionObserver' in window){
 const titleObserver=new IntersectionObserver(entries=>{
  titleInView=entries.some(entry=>entry.isIntersecting);syncTitleMotion();
 },{threshold:.18});
 titleObserver.observe(title);
}
document.fonts.ready.then(()=>{titleFontsReady=true;syncTitleMotion();});
document.addEventListener('visibilitychange',()=>syncTitleMotion());
titleMotion.addEventListener('change',()=>syncTitleMotion(true));
syncTitleMotion();
const description=node('1:422');
description.classList.add('home-description');
group('home-footer',[description]);

about.classList.add('home-about');
aboutSheet.classList.add('home-about-sheet');
aboutCopy.classList.add('home-about-copy');
about.setAttribute('role','dialog');
about.setAttribute('aria-modal','true');
about.setAttribute('aria-labelledby','home-about-heading');
about.tabIndex=-1;
const aboutHeading=document.createElement('h2');
aboutHeading.id='home-about-heading';
aboutHeading.className='home-about-heading';
aboutHeading.textContent='A Shape of Her';
aboutSheet.prepend(aboutHeading);
close.classList.add('home-about-close');
close.setAttribute('aria-label','Close About');
about.append(close);
close.hidden=about.hidden;
close.style.cssText='position:fixed;left:1378px;top:14px;width:40px;height:40px;display:block;z-index:10';
close.querySelector('div').style.cssText='position:absolute;inset:0';
const closeText=close.querySelector('p');
closeText.textContent='(×)';
closeText.style.fontSize='20px';
closeText.style.left='4px';
closeText.style.top='6px';
closeText.style.right='auto';
closeText.style.bottom='auto';

function closeMenus(){for(const menu of menus)menu.close();}
function closeAbout(){
 about.hidden=true;
 close.hidden=true;
 landing.inert=false;
 document.body.classList.remove('home-about-open');
 syncTitleMotion();
 trigger.setAttribute('aria-expanded','false');
 trigger.focus();
}
trigger.addEventListener('click',()=>{
 closeMenus();
 about.hidden=false;
 close.hidden=false;
 landing.inert=true;
 document.body.classList.add('home-about-open');
 syncTitleMotion();
 trigger.setAttribute('aria-expanded','true');
 close.focus();
});
close.addEventListener('click',closeAbout);
about.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const focusable=[...about.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(element=>!element.hidden);
 const first=focusable[0]||about;
 const last=focusable.at(-1)||about;
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});

function addMenu({nodeId,label,items}){
 const source=node(nodeId).closest('a');
 const trigger=document.createElement('button');
 for(const attribute of source.attributes)if(attribute.name!=='href')trigger.setAttribute(attribute.name,attribute.value);
 trigger.type='button';
 while(source.firstChild)trigger.append(source.firstChild);
 source.replaceWith(trigger);
 const entry=trigger.parentElement;
 const menu=document.createElement('nav');
 menu.className='home-film-menu';
 menu.setAttribute('aria-label',label);
 menu.id='home-menu-'+nodeId.replace(':','-');
 menu.hidden=true;
 for(const item of items){
  const link=document.createElement('a');
  link.textContent=item.label;
  link.href='original-layout.html#'+item.route;
  menu.append(link);
 }
 entry.append(menu);
 trigger.setAttribute('aria-expanded','false');
 trigger.setAttribute('aria-controls',menu.id);
 function closeMenu(restoreFocus=false){
  const hasFocus=menu.contains(document.activeElement);
  menu.hidden=true;
  trigger.setAttribute('aria-expanded','false');
  if(restoreFocus||hasFocus)trigger.focus();
 }
 function openMenu(){
  for(const other of menus)if(other.menu!==menu)other.close();
  menu.hidden=false;
  trigger.setAttribute('aria-expanded','true');
 }
 menus.push({menu,trigger,entry,close:closeMenu});
 trigger.addEventListener('click',()=>{menu.hidden?openMenu():closeMenu();});
 trigger.addEventListener('keydown',event=>{
  if(event.key==='ArrowDown'){event.preventDefault();openMenu();menu.firstElementChild.focus();}
 });
 menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
}
addMenu({nodeId:'1:408',label:'Film & Book Studies',items:[
 {label:'The Bold, the Corrupt, and the Beautiful',route:'film/0'},
 {label:'Raise the Red Lantern',route:'film/1'},
 {label:'In the Mood for Love',route:'film/2'},
 ...bookTitles.map((label,index)=>({label,route:'film/'+(index+3)})),
 {label:'Connecting to Reality',route:'film/8'}
]});
addMenu({nodeId:'1:405',label:'Interviews',items:Object.entries(interviewPeople).map(([route,label])=>({label,route}))});

navigation.addEventListener('focusout',event=>{if(!navigation.contains(event.relatedTarget))closeMenus();});
document.addEventListener('pointerdown',event=>{
 if(!navigation.contains(event.target))closeMenus();
});
addEventListener('keydown',event=>{
 if(event.key!=='Escape')return;
 if(!about.hidden){event.preventDefault();closeAbout();return;}
 const open=menus.find(entry=>!entry.menu.hidden);
 if(open){event.preventDefault();open.close(true);}
});

mountHomeEyes(landing);

mountHomeTrail();
