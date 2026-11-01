import {COLORS,FORMS,DURATION,ACTIONS,JUV_NAMES,ADULT_NAMES} from './data.js';
import {petName,trueForm,clamp} from './core.js';
export const P={ink:'#263e35',dark:'#41614b',green:'#7c9b63',sage:'#adc38b',light:'#d6e3b2',paper:'#edf0d1',gold:'#d8b861',red:'#bd6953',blue:'#80aaa6'};
export const ctx=document.getElementById('game').getContext('2d');
ctx.imageSmoothingEnabled=false;
export const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
export function text(str,x,y,size=10,color=P.ink,align='left'){
 ctx.font=`${size}px Pixelify, monospace`;ctx.textBaseline='top';ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(String(str),Math.round(x),Math.round(y));ctx.textAlign='left';
}
export function box(x,y,w,h,fill=P.paper,border=P.ink){rect(x,y,w,h,border);rect(x+2,y+2,w-4,h-4,fill);rect(x+3,y+3,w-6,1,'#ffffff44');}
export function wrap(str,x,y,width,size=10,color=P.ink,line=13){
 let row='',dy=0;ctx.font=`${size}px Pixelify`;
 for(const word of str.split(' ')){if(ctx.measureText(row+word).width>width&&row){text(row,x,y+dy,size,color);dy+=line;row='';}row+=word+' ';}if(row)text(row,x,y+dy,size,color);return dy+line;
}
export function meter(x,y,w,value,color=P.green,h=5){rect(x,y,w,h,P.ink);rect(x+1,y+1,w-2,h-2,P.light);rect(x+1,y+1,Math.round((w-2)*clamp(value)/100),h-2,color);}
export function footer(left='ARROWS choose   Z confirm',right='C menu'){rect(0,271,320,17,P.ink);text(left,8,275,9,P.paper);text(right,312,275,9,P.sage,'right');}
export function header(title,right=''){rect(0,0,320,29,P.ink);text('✦',9,7,13,P.gold);text(title,26,7,13,P.paper);text(right,310,10,9,P.sage,'right');rect(0,29,320,2,P.green);}
export function list(items,selection,{x=16,y=58,w=288,row=24,visible=7}={}){
 const start=Math.max(0,Math.min(selection-Math.floor(visible/2),items.length-visible));
 items.slice(start,start+visible).forEach((item,i)=>{
  const n=start+i,selected=n===selection,disabled=typeof item==='object'&&item.disabled;
  if(selected){rect(x,y+i*row,w,row-2,P.ink);text('>',x+6,y+i*row+4,11,P.gold);}
  text(typeof item==='string'?item:item.label,x+19,y+i*row+4,11,disabled?P.green:selected?P.paper:P.ink);
  if(typeof item==='object'&&item.right)text(item.right,x+w-8,y+i*row+5,9,selected?P.sage:P.dark,'right');
 });
 if(start>0)text('^',x+w-4,y-11,9,P.dark);
 if(start+visible<items.length)text('v',x+w-4,y+visible*row-3,9,P.dark);
}
const images={};
export async function loadAssets(){await Promise.all(['egg','baby','pelu-0','pelu-1','flappy-0','flappy-1','juvenile-a','juvenile-b','juvenile-c','adult-c1'].map(name=>new Promise(resolve=>{const img=new Image();img.onload=()=>{images[name]=img;resolve();};img.onerror=resolve;img.src=`assets/${name}.png`;})));}
// Code-native pixel shapes extend the supplied 16px sprites into 24/32px forms.
function pixels(pattern,x,y,scale,palette){pattern.forEach((row,yy)=>[...row].forEach((c,xx)=>{if(palette[c])rect(x+xx*scale,y+yy*scale,scale,scale,palette[c]);}));}
const bodies={
 A1:['....##....##....','...#aa#..#aa#...','...#aah##haa#...','..#aaaaaaaaaa#..','.#aaaahhaaaaaa#.','.#aa#aaaa#aaaa#.','.#aa#aaaa#aaaa#.','.#aaaaaahhaaaa#.','..#aaa##aaaaa#..','..#aaaaaaaaaa#..','...#aa##aaaa#...','...#a#..#aaa#...','..####..#####...'],
 A2:['......####......','....##hhhh##....','...#haaaaaah#...','..#haaaaaaaah#..','.#aaaa#aaa#aaa#.','.#aaaa#aaa#aaa#.','.#aaaaaahhaaaa#.','..#aaa##aaaaa#..','...#aaaaaaa##...','....##aaaa#.....','...#aa#aaa#.....','..#aa#..#aa#....','...##....##.....'],
 B1:['.....##..##.....','....#hh##hh#....','...#haaaaaah#...','..#haaaaaaaah#..','.#aa##aaaa##aa#.','.#aaaaaaaaaaaa#.','.#aaaahhhhaaaa#.','.#aaaahhhhaaaa#.','..#aaaaaaaaaa#..','...#aaaaaaaa#...','..#aa######aa#..','..###......###..'],
 C2:['.......##.......','......#hh#......','.....#aaaa#.....','...##aaaaaa##...','..#haaaaaaaah#..','.#aaa#aaaa#aaa#.','.#aaa#aaaa#aaa#.','..#aaaa##aaaa#..','...##aaaaaa##...','....#aahhaa#....','...#aa#..#aa#...','....##....##....']
};
export function sprite(p,x,y,scale=2,time=0,flip=false){
 if(!p)return;const stage=p.stage||'FINAL';const frame=Math.floor(time*2)%2;
 ctx.save();ctx.translate(Math.round(x),Math.round(y));if(flip){ctx.translate(16*scale,0);ctx.scale(-1,1);}
 const heritage=p.heritage?COLORS[p.heritage]:null;
 if(stage==='EGG'||stage==='BABY'||stage==='JUVENILE'||stage==='ADULT'&&p.adult==='C1'){
  let key=stage==='EGG'?'egg':stage==='BABY'?'baby':stage==='JUVENILE'?`juvenile-${(p.juvenile||'A').toLowerCase()}`:'adult-c1';
  const im=images[key];if(im){const dy=p.sleeping?2:frame;const width=stage==='ADULT'?24:16;ctx.drawImage(im,(16-width)*scale/2,(16-width)*scale+dy,width*scale,width*scale);}
  if(heritage){rect(4*scale,13*scale,3*scale,scale,heritage);rect(10*scale,13*scale,2*scale,scale,heritage);}
 }else{
  const element=p.element||({A1:'Fire',A2:'Water',B1:'Wood',C2:'Poison'}[p.adult]);
  const col=COLORS[element]||P.sage;const pattern=bodies[p.adult]||bodies[({Light:'A1',Fire:'A1',Ice:'A2',Water:'A2',Wood:'B1',Earth:'B1',Thunder:'C2',Air:'A2',Poison:'C2',Darkness:'C2'}[element])]||bodies.A1;
  const final=stage==='FINAL',s=scale*(final?2:1.5),sx=8*scale-8*s,sy=16*scale-pattern.length*s;
  const pal={'#':P.ink,a:col,h:P.paper};
  pixels(pattern,sx,sy+(p.sleeping?2:frame),s,pal);
  if(final){
   if(['Fire','Light'].includes(element)){pixels(['..h..','.hah.','haahh','.aaah','..aa.'],sx+12*s,sy-3*s,s,{'h':P.gold,'a':col});}
   if(['Wood','Earth'].includes(element)){pixels(['..##..','.ahha.','aaaaaa','.aaaa.','..aa..'],sx+5*s,sy-3*s,s,{'#':P.ink,a:element==='Earth'?P.dark:P.green,h:P.sage});}
   if(['Ice','Water'].includes(element)){pixels(['...#','..ah','.aah','aaah'],sx+12*s,sy+8*s,s,{'#':P.ink,a:col,h:P.paper});}
   if(['Air','Thunder'].includes(element)){pixels(['h....h','ah..ha','aahhaa','.aaaa.','..aa..'],sx+4*s,sy-3*s,s,{a:col,h:P.paper});}
   if(element==='Poison'){rect(sx+4*s,sy-2*s,8*s,2*s,P.ink);rect(sx+5*s,sy-3*s,6*s,2*s,col);rect(sx+6*s,sy-3*s,s,s,P.paper);}
   if(element==='Darkness'){rect(sx+4*s,sy+4*s,2*s,s,P.gold);rect(sx+10*s,sy+4*s,2*s,s,P.gold);}
  }
  if(heritage){rect(sx+4*s,sy+9*s,8*s,s,heritage);rect(sx+5*s,sy+10*s,6*s,s,heritage);}
 }
 ctx.restore();
}
export function icon(type,x,y,color=P.ink,s=1){
 const patterns={FEED:['..##....','.#aa#...','#aaaa#..','#aaaaa#.','.####...','...#....'],PLAY:['..###...','.#aaah..','#aaaah#.','#aahah#.','.#hhh#..','..###...'],SLEEP:['.#......','##......','##...#..','###.##..','.####...','..##....'],BATH:['.#...#..','........','##...##.','#aaaaa#.','#aaaaa#.','.#####..'],CURE:['..##....','..##....','######..','######..','..##....','..##....'],TRAIN:['#....#..','##..##..','######..','##..##..','#....#..'],star:['...#....','..###...','#######.','.#####..','..###...','.#...#..'],coin:['..###...','.#aaa#..','#aa#aa#.','#aa#aa#.','.#aaa#..','..###...']};
 pixels(patterns[type]||patterns.star,x,y,s,{'#':color,a:P.sage,h:P.paper});
}
export function landscape(time=0,night=false,dungeon=false){
 const sky=night?'#344c55':dungeon?'#465749':'#c4d9b0',far=night?'#4f6860':dungeon?'#5e7156':'#9fbf92';
 rect(0,31,320,127,sky);
 if(dungeon){
  for(let y=34;y<140;y+=14)for(let x=-15;x<320;x+=26){rect(x+(y%28?13:0),y,24,12,far);rect(x+(y%28?13:0)+2,y+2,20,1,'#a7b18b22');}
  rect(120,48,80,93,P.ink);rect(125,53,70,88,'#31463b');rect(8,126,304,32,'#788466');
  for(let x=0;x<320;x+=32){rect(x,143,30,1,P.dark);rect(x+16,156,30,1,P.dark);}
  return;
 }
 if(night){for(let i=0;i<14;i++){const x=(i*73+20)%320,y=39+(i*23)%45;rect(x,y,2,2,P.light);}rect(260,44,13,13,P.gold);rect(264,42,12,11,sky);}
 else{rect(254,43,15,15,'#e5dc94');rect(258,39,7,23,'#e5dc94');
  cloud(28+Math.sin(time*.03)*5,48);cloud(178+Math.sin(time*.02)*4,64);}
 // Distant rounded tree crowns and a warm clearing echo the Construct nursery.
 for(let i=-1;i<8;i++){const x=i*53;rect(x,94+(i%2)*9,58,40,far);rect(x+8,85+(i%2)*9,39,45,far);rect(x+19,79+(i%2)*9,18,50,far);}
 rect(0,119,320,39,night?'#60765d':'#91af77');rect(48,126,224,32,night?'#879475':'#c7d4a0');rect(70,121,180,8,night?'#879475':'#c7d4a0');
 for(let i=0;i<26;i++){const x=(i*47+7)%320,y=126+(i*7)%28;rect(x,y,2,3,P.green);rect(x+3,y-1,2,4,P.green);if(i%5===0){rect(x+1,y-3,2,2,night?P.sage:P.gold);}}
 tree(7,90,night);tree(283,86,night);
 rect(15,150,290,1,'#dce4b622');
}
function cloud(x,y){rect(x,y,29,6,'#e6ebcb');rect(x+5,y-4,17,8,'#e6ebcb');rect(x+12,y-7,8,8,'#e6ebcb');}
function tree(x,y,night){rect(x+10,y+22,6,23,P.dark);rect(x+7,y+36,13,3,P.dark);const col=night?'#3a5e49':'#5e8b62';rect(x,y+8,27,21,P.dark);rect(x+4,y,19,34,P.dark);rect(x+3,y+9,21,17,col);rect(x+7,y+3,13,27,col);rect(x+9,y+5,5,4,P.green);}
export function title(s,t,sel,hasSave){
 rect(0,0,320,288,P.paper);landscape(t);rect(0,0,320,32,P.paper);text('THE POCKET LIFE COLLECTION',160,12,9,P.dark,'center');
 text('EVOPET',161,45,46,P.ink,'center');text('A tiny life. A lasting legacy.',160,91,11,P.dark,'center');
 sprite({stage:'JUVENILE',juvenile:'A'},144,121,2,t);rect(0,159,320,112,P.paper);
 text('GROW A LITTLE. LEAVE A LEGACY.',160,169,10,P.dark,'center');
 const items=hasSave?['Continue journey','How to play']:['Hatch my first egg','How to play'];list(items,sel,{x:62,y:192,w:196,row:26,visible:2});
 text(`10 ELEMENTS   /   ${s.archive.length} COMPANIONS`,160,253,9,P.green,'center');footer('ARROWS choose   Z start','v0.1');
}
export function habitat(s,t,sel,toast){
 const p=s.active;header('NURSERY',`GEN ${String(p.generation).padStart(2,'0')}   ${s.speed===0?'PAUSED':s.speed+'x'}`);landscape(t,p.sleeping);
 const x=p.stage==='EGG'?144:144+Math.sin(t*.23)*36;
 rect(x+1,147,30,3,'#5b765b44');sprite(p,x,114+(p.stage==='EGG'?Math.sin(t*3)*1.5:0),2,t,Math.cos(t*.23)<0);
 if(p.sleeping)text('z Z',x+29,104,12,P.paper);else if(p.sick)text('!',x+31,111,15,P.red);
 box(8,37,92,16,P.paper);text(p.stage,13,40,9,P.dark);
 if(p.heritage){rect(216,37,96,16,COLORS[p.heritage]);text(`${p.heritage} legacy`,264,41,8,P.ink,'center');}
 text(petName(p),10,162,15);text(p.stage==='FINAL'?trueForm(p):p.trait+' spirit',310,165,9,P.dark,'right');
 if(p.stage!=='FINAL'){meter(10,181,300,p.stageAge/DURATION[p.stage]*100,P.green,4);text(p.stage==='EGG'?'A whole world is waiting inside.':`Next evolution in ${Math.ceil(DURATION[p.stage]-p.stageAge)}s of pet time`,10,188,9,P.dark);}
 else{text(`${p.element} / ${FORMS[p.element].role}`,10,182,10,P.dark);text('Safely archived. A new generation awaits.',10,194,9,P.green);}
 const stats=[['FOOD','food'],['FUN','fun'],['REST','energy'],['CLEAN','clean'],['HP','health']];
 stats.forEach(([label,k],i)=>{const x=10+i*62;text(label,x,207,8,P.dark);meter(x,219,53,p.needs[k],p.needs[k]<25?P.red:P.green,5);});
 for(let i=0;i<6;i++){const x=8+i*51,selected=i===sel;const locked=p.stage==='EGG'||p.stage==='FINAL'||p.stage==='BABY'&&i!==0&&i!==2;
  if(selected)box(x,232,49,33,P.ink);icon(ACTIONS[i],x+20,236,locked?P.green:selected?P.gold:P.dark);text(i===2&&p.sleeping?'WAKE':ACTIONS[i],x+24,251,8,locked?P.green:selected?P.paper:P.ink,'center');}
 if(toast){box(16,84,288,28,P.paper);text(toast,160,92,10,P.ink,'center');}
 footer('ARROWS action   Z choose','C menu');
}
export function page(titleText,sub=''){rect(0,0,320,288,P.paper);header(titleText,sub);}
export function modal(titleText,lines,button='Z continue',p=null,time=0){
 rect(0,31,320,240,'#203b32bd');box(18,57,284,188,P.paper);text(titleText,160,72,18,P.ink,'center');
 if(p)sprite(p,144,99,2,time);let yy=p?145:108;
 lines.forEach(l=>{yy+=wrap(l,35,yy,250,11,P.dark,14)+5;});text(button,160,224,10,P.ink,'center');
}
export function miniScene(m,p,t){
 header(m.name,`${Math.ceil(m.time)}s    ${m.score} pts`);landscape(t,false,m.type==='BUBBLE');
 rect(0,158,320,113,P.paper);
 // Expand playfield over the nursery base, retaining the same limited palette.
 rect(6,38,308,187,m.type==='FLAPPY'?'#c4d9b0':m.type==='BUBBLE'?'#9ab9ab':'#d6e3b2');
 if(m.type==='FLAPPY'){
  for(let x=0;x<320;x+=64){rect((x-t*8)%330,80+(x%3)*13,27,5,'#e8edc7');}
  m.items.forEach(o=>{const gap=55;box(o.x,38,23,o.y-38-gap/2,P.green);box(o.x,o.y+gap/2,23,225-o.y-gap/2,P.green);});
  const key=Math.floor(t*4)%2?'flappy-1':'flappy-0';if(images[key])ctx.drawImage(images[key],54,m.y-8,16,16);
 }else if(m.type==='FEAST'){
  m.items.forEach(o=>o.bad?rock(o.x,o.y):apple(o.x,o.y));sprite(p,m.x-12,190,1.5,t);rect(m.x-13,216,28,5,P.dark);
 }else if(m.type==='BUBBLE'){
  sprite(p,144,122,2,t);m.items.forEach(o=>{box(o.x-7,o.y-7,14,14,'#c6e1d2',P.blue);rect(o.x-3,o.y-4,3,2,P.paper);});
  box(m.x-9,m.y-7,19,15,P.gold);rect(m.x-5,m.y-4,3,2,P.paper);text('Z',m.x, m.y-4,9,P.ink,'center');
 }else if(m.type==='BALL'){
  for(let y=45;y<80;y+=13)for(let x=18;x<300;x+=32){rect(x,y,26,8,[P.green,P.gold,P.blue][Math.floor(x/32)%3]);}
  rect(m.x-22,211,44,6,P.ink);rect(m.x-20,211,40,2,P.green);box(m.ball.x-4,m.ball.y-4,8,8,P.gold);
 }else if(m.type==='SPRINT'){
  rect(6,216,308,9,P.dark);for(let i=0;i<20;i++)rect(8+(i*22-t*75%22),220,7,2,P.green);
  sprite(p,55,m.y-24,1.5,t);m.items.forEach(o=>rock(o.x,o.y));
 }
 text(m.type==='BUBBLE'?'ARROWS move   Z scrub':m.type==='FLAPPY'?'Z flap / keep a steady rhythm':m.type==='SPRINT'?'Z jump / clear the stones':'LEFT / RIGHT move',160,234,11,P.ink,'center');
 text('Pet time pauses while you play.',160,251,9,P.dark,'center');footer('X exit without reward','C pause');
}
function apple(x,y){rect(x-4,y-3,9,8,P.red);rect(x-2,y-5,5,2,P.red);rect(x,y-8,2,4,P.dark);rect(x+2,y-8,3,2,P.green);rect(x-3,y-2,2,2,P.paper);}
function rock(x,y){rect(x-5,y-3,10,9,P.ink);rect(x-3,y-6,6,12,P.ink);rect(x-3,y-3,6,6,P.dark);rect(x-2,y-4,3,2,P.sage);}
export function enemySprite(type,x,y,t){
 const patterns={bat:['##..........##','aaa#......#aaa','aaaa#....#aaaa','.aaaa####aaaa.','..#aaahhaaa#..','...#h#hh#h#...','....aaaaaa....','.....####.....'],hound:['..........##..','.........#aa#.','..###...#aaaa#','.#aaa###ahhhaa','aaaaaaaah#h#aa','aaaaaaaahaaah.','.aaa##aaaaaa..','..aa..a..aa...','..##..#..##...'],titan:['....######....','...#aaaaaa#...','..#aahaaaha#..','.#aaahaaahaa#.','#aaaaaaaaaaaa#','#a#aaa##aaa#a#','#a#aaaaaaaa#a#','###aaaaaaaa###','..#aaaaaaaa#..','..#aa####aa#..','..####..####..']};
 pixels(patterns[type],x,y+Math.floor(Math.sin(t*3)*2),type==='titan'?4:3,{'#':P.ink,a:type==='bat'?P.blue:type==='titan'?P.green:P.dark,h:P.gold});
}
