export function refineReality(){
 const section=document.querySelector('#film .film-reality');
 if(!section||section.classList.contains('reality-refined'))return section;
 const header=section.querySelector('.reality-header');
 const title=header?.querySelector('.reality-title');
 const reading=section.querySelector('.reality-reading');
 const directory=reading?.querySelector('.reality-directory');
 const reflections=reading?.querySelector('.reality-reflections');
 if(!header||!title||!reading||!directory||!reflections)return section;
 title.textContent='Connecting to reality';
 const layout=document.createElement('div');
 layout.className='reality-reading-layout';
 for(const link of directory.querySelectorAll(':scope>a')){
  const label=[...link.children].find(child=>!child.classList.contains('reality-note-number'));
  label?.classList.add('reality-directory-title');
 }
 layout.append(directory,reflections);
 reading.replaceWith(layout);
 section.classList.add('reality-refined');
 return section;
}
