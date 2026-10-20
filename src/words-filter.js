export const filterGroups={
 lifeStages:['Childhood','Adolescence','Adulthood','Later Life'],
 pressure:['Pressure from Family','External Gaze','Social Norms','Peer Pressure','School Expectations','Workplace Expectations','Media Influence','Self-Expectations'],
 themes:['Obedience','Appearance','Body Image','Education','Ambition','Work','Money','Independence','Relationships','Marriage','Childbearing','Motherhood','Caregiving','Housework','Aging','Personal Choice']
};
export function emptyFilters(){return Object.fromEntries(Object.keys(filterGroups).map(key=>[key,new Set()]));}
export function matchesWord(card,filters){return Object.keys(filterGroups).every(key=>filters[key].size===0||card[key].some(tag=>filters[key].has(tag)));}
export function toggleFilter(filters,key,value){if(!filterGroups[key]?.includes(value))throw new Error('Unknown filter');if(filters[key].has(value))filters[key].delete(value);else filters[key].add(value);}
