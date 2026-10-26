const cleanText=node=>node.textContent.replace(/[\u200b\ufeff]/g,'').replace(/\s+/g,' ').trim();
const create=(tag,className,text)=>{
 const node=document.createElement(tag);
 node.className=className;
 if(text)node.textContent=text;
 return node;
};

export function refineResearch(){
 const research=document.getElementById('research');
 if(!research||research.classList.contains('research-refined'))return;
 research.classList.add('research-refined');
 for(const [index,row]of [...research.querySelectorAll('.research-row')].entries()){
  const entry=row.querySelector('.research-entry');
  const source=row.querySelector('a.research-source');
  if(!entry||!source)continue;
  const content=[...entry.querySelectorAll('p')].map(cleanText).filter(Boolean);
  const title=create('h2','research-note-title',content.shift());
  title.id=`research-note-${index+1}`;
  row.setAttribute('aria-labelledby',title.id);
  entry.replaceChildren(title,...content.map(text=>create('p','research-note-summary',text)));
  const lines=[...source.querySelectorAll('p')].map(cleanText).filter(Boolean);
  const sourceLabel=lines.pop()||'Read original';
  const theme=lines.pop()||'';
  const authorCount=lines[1]?.includes(' · ')?2:1;
  const authors=lines.splice(0,authorCount);
  const volumeIndex=lines.findIndex(text=>/^\d+\s*\(/.test(text));
  const publication=volumeIndex<0?lines.splice(0):lines.splice(0,volumeIndex);
  const citation=create('footer','research-source research-citation');
  const bibliography=create('div','research-citation-bibliography');
  const authorGroup=create('p','research-citation-authors');
  for(const author of authors)authorGroup.append(create('span','research-citation-author',author));
  const publicationGroup=create('p','research-citation-publication');
  publicationGroup.append(create('cite','research-citation-journal',publication.join(' ')));
  for(const line of lines)publicationGroup.append(create('span','research-citation-detail',line));
  bibliography.append(authorGroup,publicationGroup);
  const context=create('div','research-citation-context');
  context.append(create('p','research-citation-theme',theme.toLowerCase().replace(/^\p{L}/u,letter=>letter.toUpperCase())));
  const sourceLink=create('a','research-source-link',sourceLabel);
  sourceLink.href=source.getAttribute('href');
  sourceLink.target=source.getAttribute('target')||'_blank';
  sourceLink.rel='noopener noreferrer';
  sourceLink.setAttribute('aria-label',`${sourceLabel.replace(/\s*↗$/,'')}: ${title.textContent}`);
  context.append(sourceLink);
  citation.append(bibliography,context);
  source.replaceWith(citation);
 }
}
