const navLabels={'(Collected Words)':'COLLECTED WORDS','(Interviews)':'INTERVIEWS','(Film & Book Studies)':'FILM & BOOK STUDIES','(Research)':'RESEARCH'};
const interviewKeys=['mom','grandma','aunt1','aunt2','fengqin','xiaomin','xiaosheng','zhengjuan','fanghanqin','summary'];
const label=el=>(el.querySelectorAll('p').length?[...el.querySelectorAll('p')].map(p=>p.textContent).join(' '):el.textContent).replace(/\s+/g,' ').trim();
const closeDropdown=dropdown=>{dropdown.classList.remove('is-open');dropdown.querySelector('.section-dropdown-toggle').setAttribute('aria-expanded','false');dropdown.querySelector('.section-dropdown-menu').hidden=true;};
export function getSectionNavigation(key){
 const section=key==='film'?'film':'interviews';
 return document.querySelector(`.section-dropdown-menu[data-section="${section}"]`)||document.getElementById(key)?.querySelector('[data-name="Interview navigation — left tabs"]');
}
export function syncTopbars(){
 const header=document.querySelector('.site-header');if(!header)return null;
 const key=document.querySelector('.figma-screen:not([hidden])')?.id;
 for(const item of header.querySelectorAll('.topnav>[data-section],.section-dropdown>.aligned-topbar-link')){
  const section=item.dataset.section;
  const selected=section==='interviews'?interviewKeys.includes(key):key===section;
  if(selected)item.setAttribute('aria-current','page');else item.removeAttribute('aria-current');
 }
 if(header.dataset.route!==location.hash){for(const dropdown of header.querySelectorAll('.section-dropdown'))closeDropdown(dropdown);header.dataset.route=location.hash;}
 return header;
}
export function alignTopbars(){
 const interviewMenu=getSectionNavigation('mom'),filmMenu=getSectionNavigation('film');
 const oldMenus=[...document.querySelectorAll('[data-name="Interview navigation — left tabs"]')];
 const header=document.createElement('header');header.className='site-header';
 const brand=document.createElement('a');brand.className='site-brand';brand.href='index.html';brand.textContent='A SHAPE OF HER';header.append(brand);
 const nav=document.createElement('nav');nav.className='topnav';nav.setAttribute('aria-label','Sections');header.append(nav);
 const makeLink=(text,section)=>{const link=document.createElement('a');link.className='aligned-topbar-link';link.href='#'+section;link.dataset.section=section;link.textContent=text;nav.append(link);};
 const makeDropdown=(text,section,menu)=>{
  if(!menu)return;
  const dropdown=document.createElement('div');dropdown.className='section-dropdown';
  const link=document.createElement('a');link.className='aligned-topbar-link';link.dataset.section=section;link.href=section==='film'?'#film':'#mom';link.textContent=text;
  const trigger=document.createElement('button');trigger.type='button';trigger.className='section-dropdown-toggle';trigger.setAttribute('aria-controls',`section-menu-${section}`);trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label',section==='film'?'Show films and books':'Show interviews');
  menu.classList.add('section-dropdown-menu');menu.dataset.section=section;menu.id=`section-menu-${section}`;menu.setAttribute('role','navigation');menu.setAttribute('aria-label',text);menu.hidden=true;
  menu.removeAttribute('style');for(const el of menu.querySelectorAll('[style]'))el.removeAttribute('style');
  for(const item of menu.querySelectorAll(':scope>a,:scope>button'))item.setAttribute('aria-label',label(item));
  dropdown.append(link,trigger,menu);nav.append(dropdown);
  function openDropdown(){
   for(const other of nav.querySelectorAll('.section-dropdown'))closeDropdown(other);
   dropdown.classList.add('is-open');trigger.setAttribute('aria-expanded','true');menu.hidden=false;
  }
  trigger.addEventListener('click',()=>{dropdown.classList.contains('is-open')?closeDropdown(dropdown):openDropdown();});
  trigger.addEventListener('keydown',event=>{
   if(event.key!=='ArrowDown')return;
   event.preventDefault();openDropdown();menu.querySelector(':scope>a,:scope>button')?.focus({preventScroll:true});
  });
  link.addEventListener('click',()=>{
   closeDropdown(dropdown);
   requestAnimationFrame(()=>{const screen=document.getElementById(section==='film'?'film':'mom');for(const panel of screen.querySelectorAll('[data-name*="scrollable"],[data-name="Interview — editable questions and answers"],[data-name="Family photographs — original proportions"]'))panel.scrollTop=0;});
  });
  menu.addEventListener('click',event=>{
   const item=event.target.closest('a,button');if(!item)return;
   closeDropdown(dropdown);trigger.focus({preventScroll:true});
   if(section==='film')requestAnimationFrame(()=>{const index=[...menu.children].indexOf(item);const content=document.querySelector('#film [data-name="Films — scrollable studies"]');const block=document.querySelectorAll('#film [data-name^="Question"]')[index];if(block)content.scrollTop=block.offsetTop;});
  });
  dropdown.addEventListener('keydown',event=>{if(event.key==='Escape'&&dropdown.classList.contains('is-open')){event.preventDefault();closeDropdown(dropdown);trigger.focus();}});
  dropdown.addEventListener('focusout',event=>{if(event.relatedTarget&&!dropdown.contains(event.relatedTarget))closeDropdown(dropdown);});
 };
 makeLink('COLLECTED WORDS','words');makeDropdown('INTERVIEWS','interviews',interviewMenu);makeDropdown('FILM & BOOK STUDIES','film',filmMenu);makeLink('RESEARCH','research');
 for(const menu of oldMenus)if(menu!==interviewMenu&&menu!==filmMenu)menu.remove();
 for(const root of document.querySelectorAll('.figma-screen>div')){
  for(const el of [...root.children])if(label(el) in navLabels)el.remove();
  [...root.children].find(el=>label(el)==='A SHAPE OF HER')?.remove();root.querySelector(':scope > [data-name="Group"]')?.remove();
 }
 document.body.prepend(header);
 document.addEventListener('pointerdown',event=>{for(const dropdown of nav.querySelectorAll('.section-dropdown.is-open'))if(!dropdown.contains(event.target))closeDropdown(dropdown);});
 syncTopbars();
}
