import {DURATION,STAGES,FORMS,TRAITS,ELEMENTS,TRINKETS} from './data.js';
export const SAVE_KEY='evopet.save.v1';
export const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
export function random(s){s.rng=(Math.imul(1664525,s.rng)+1013904223)>>>0;return s.rng/4294967296;}
export function newPet(s,heritage=null){
 const gen=++s.generation;
 return {id:`pet-${gen}-${Math.floor(random(s)*1e9)}`,generation:gen,stage:'EGG',stageAge:0,age:0,heritage,juvenile:null,adult:null,element:null,trait:TRAITS[Math.floor(random(s)*TRAITS.length)],sleeping:false,sick:false,needs:{food:70,fun:85,energy:90,clean:90,health:100},history:{fed:0,play:0,train:0,baths:0,cures:0,illnesses:0},record:emptyRecord(),equipped:null};
}
export function emptyRecord(){return {seconds:0,food:0,clean:0,sleep:0,activity:0,sick:false};}
export function newState(seed=Date.now()){
 const s={version:1,rng:seed>>>0,generation:0,active:null,archive:[],unlocked:[],discovered:[],coins:0,trinkets:[],bestFloor:0,clears:0,highScores:{},speed:1,sound:true,contrast:false,dungeon:null};
 s.active=newPet(s);return s;
}
export function petName(p){if(!p)return 'No active pet';if(p.stage==='FINAL')return FORMS[p.element].name;return p.stage==='EGG'?'A little possibility':p.stage==='BABY'?'Little Pelu':p.stage==='JUVENILE'?({A:'Pelu',B:'Mellow',C:'Pip'}[p.juvenile]):({A1:'Kindle',A2:'Dewdrop',B1:'Budrock',C1:'Spark',C2:'Murk'}[p.adult]);}
export function trueForm(p){return !p.heritage?'Natural':p.heritage===p.element?'Pure true form':'Mixed true form';}
export function chooseJuvenile(p){const avg=p.record.seconds?p.record.food/p.record.seconds:p.needs.food;return avg>85?'B':avg<30?'C':'A';}
export function chooseAdult(p){return p.juvenile==='B'?'B1':p.juvenile==='C'?(p.record.sick?'C2':'C1'):p.record.activity>=3?'A1':'A2';}
export function chooseFinal(p){
 const r=p.record, sleep=r.sleep/Math.max(1,r.seconds), clean=r.clean/Math.max(1,r.seconds);
 return p.adult==='A1'?(sleep<.08?'Light':'Fire'):p.adult==='A2'?(sleep>.45?'Ice':'Water'):p.adult==='B1'?(clean<35?'Earth':'Wood'):p.adult==='C1'?(r.activity<2?'Air':'Thunder'):(p.needs.health<=0?'Darkness':'Poison');
}
export function evolve(s){
 const p=s.active;if(!p||p.stage==='FINAL')return null;
 const old=p.stage;
 if(old==='EGG'){p.stage='BABY';p.needs.food=45;}
 else if(old==='BABY'){p.juvenile=chooseJuvenile(p);p.stage='JUVENILE';}
 else if(old==='JUVENILE'){p.adult=chooseAdult(p);p.stage='ADULT';}
 else {p.element=chooseFinal(p);p.stage='FINAL';p.sleeping=false;archivePet(s,p);}
 p.stageAge=0;p.record=emptyRecord();return {from:old,to:p.stage,name:petName(p)};
}
export function archivePet(s,p){
 if(p.stage!=='FINAL'||s.archive.some(a=>a.id===p.id))return;
 s.archive.push(structuredClone(p));
 if(!s.unlocked.includes(p.element))s.unlocked.push(p.element);
 const variant=`${p.element}:${p.heritage||'none'}`;
 if(!s.discovered.includes(variant))s.discovered.push(variant);
 s.coins+=30;
}
export function startEgg(s,heritage){if(s.active&&s.active.stage!=='FINAL')return false;if(heritage&&!s.unlocked.includes(heritage))return false;s.active=newPet(s,heritage);return true;}
// Called with SIMULATION seconds only. Menus/minigames never call this.
export function tick(s,seconds){
 const p=s.active;if(!p||p.stage==='FINAL')return null;
 let left=clamp(seconds,0,10),event=null;
 while(left>0&&!event){
  const dt=Math.min(.1,left);left-=dt;p.age+=dt;p.stageAge+=dt;
  if(p.stage==='EGG'){if(p.stageAge+1e-7>=DURATION.EGG)event=evolve(s);continue;}
  const n=p.needs;const baby=p.stage==='BABY';
  n.food=clamp(n.food-dt*(baby?1.2:.38)*(p.trait==='Hearty'?1.1:1));
  n.fun=clamp(n.fun-dt*.21);n.clean=clamp(n.clean-dt*(baby?.12:.36));
  n.energy=clamp(n.energy+dt*(p.sleeping?2.3*(p.trait==='Dreamy'?1.1:1):-.3));
  if(n.food<12||n.clean<12){if(!p.sick){p.sick=true;p.history.illnesses++;}}
  if(p.sick)n.health=clamp(n.health-dt*.7);
  else if(n.food>30&&n.clean>30)n.health=clamp(n.health+dt*.12);
  const r=p.record;r.seconds+=dt;r.food+=n.food*dt;r.clean+=n.clean*dt;r.sleep+=p.sleeping?dt:0;r.sick ||= p.sick;
  if(p.stage==='ADULT'&&p.adult==='C2'&&n.health<=0)event=evolve(s);
  else if(p.stageAge+1e-7>=DURATION[p.stage])event=evolve(s);
 }
 return event;
}
export function care(s,action,quality=1){
 const p=s.active;if(!p||p.stage==='EGG'||p.stage==='FINAL')return false;
 if(p.stage==='BABY'&&!['feed','sleep'].includes(action))return false;
 if(p.sleeping&&action!=='sleep')return false;
 const n=p.needs,q=clamp(quality,0,1);
 if(action==='feed'){n.food=clamp(n.food+20+q*20);n.energy=clamp(n.energy+4);p.history.fed++;}
 else if(action==='sleep')p.sleeping=!p.sleeping;
 else if(action==='bath'){n.clean=clamp(n.clean+25+q*65);p.history.baths++;}
 else if(action==='cure'){p.sick=false;n.health=clamp(n.health+65);p.history.cures++;}
 else if(action==='play'||action==='train'){
  p.record.activity++;p.history[action]++;n.fun=clamp(n.fun+20+q*40);n.energy=clamp(n.energy-5);n.food=clamp(n.food-3);
 }
 return true;
}
export function finishGame(s,type,score){
 const action={FEAST:'feed',BUBBLE:'bath',BALL:'play',FLAPPY:'play',SPRINT:'train'}[type];
 care(s,action,Math.min(1,score/8));s.highScores[type]=Math.max(s.highScores[type]||0,score);const coins=Math.min(20,Math.max(1,score));s.coins+=coins;return coins;
}
export function combatStats(p){
 const f=FORMS[p.element];const v={hp:f.hp,atk:f.atk,def:f.def,spd:f.spd,heal:1,regen:0,poison:0};
 function bonus(element,scale){const type=FORMS[element].stat;if(['hp','atk','def','spd'].includes(type))v[type]*=1+scale*(type==='atk'?.25:.3);else if(type==='heal')v.heal+=.3*scale;else if(type==='regen')v.regen+=5*scale;else if(type==='poison')v.poison+=4*scale;}
 bonus(p.element,1);if(p.heritage)bonus(p.heritage,.35);if(p.heritage===p.element)for(const k of ['hp','atk','def','spd'])v[k]*=1.05;
 if(p.equipped){const t=TRINKETS[p.equipped];v[t.stat]+=t.value;}
 for(const k of ['hp','atk','def','spd'])v[k]=Math.round(v[k]);return v;
}
export function equip(s,id,trinket){const p=s.archive.find(p=>p.id===id);if(!p||trinket&&!s.trinkets.includes(trinket))return false;if(trinket)s.archive.forEach(a=>{if(a.equipped===trinket)a.equipped=null;});p.equipped=trinket;return true;}
export function beginDungeon(s,ids){
 if(s.dungeon||ids.length<1||ids.length>3||new Set(ids).size!==ids.length)return false;
 const pets=ids.map(id=>s.archive.find(p=>p.id===id));if(pets.some(p=>!p))return false;
 s.dungeon={floor:1,party:pets.map(p=>{const stats=combatStats(p);return {id:p.id,element:p.element,heritage:p.heritage,name:petName(p),stats,hp:stats.hp,energy:100};}),kind:'combat',enemy:null,log:['The old gate opens.'],cleared:false,ended:false,won:false,potions:3,loot:0};enterFloor(s);return true;
}
export function enterFloor(s){
 const d=s.dungeon;d.cleared=false;d.enemy=null;s.bestFloor=Math.max(s.bestFloor,d.floor);
 d.kind=d.floor===10?'boss':d.floor%4===0?'rest':d.floor%3===0?'treasure':'combat';
 if(d.kind==='combat'||d.kind==='boss'){
  const boss=d.kind==='boss',hound=d.floor>4;
  const hp=boss?220:36+d.floor*11;
  d.enemy={name:boss?'Basalt Titan':hound?'Shadow Hound':'Cavern Bat',type:boss?'titan':hound?'hound':'bat',hp,maxHp:hp,atk:boss?26:8+d.floor*2,def:boss?13:3+d.floor,poison:0};
  d.log=[`${d.enemy.name} blocks the path.`];
 }else d.log=[d.kind==='rest'?'A quiet spring. Restore the party.':'An old chest waits in the moss.'];
}
export function nextFloor(s){const d=s.dungeon;if(!d||!d.cleared||d.ended)return false;d.floor++;enterFloor(s);return true;}
export function dungeonAction(s,action,index=0){
 const d=s.dungeon;if(!d||d.ended||d.cleared)return false;
 const alive=d.party.filter(m=>m.hp>0);if(!alive.length){d.ended=true;return false;}
 const m=d.party[index];
 if(d.kind==='treasure'){
  const keys=Object.keys(TRINKETS),remaining=keys.filter(k=>!s.trinkets.includes(k));
  const loot=remaining.length?remaining[Math.floor(random(s)*remaining.length)]:null;
  if(loot)s.trinkets.push(loot);s.coins+=15;d.loot+=15;d.cleared=true;d.log=[loot?`Found ${TRINKETS[loot].name}!`:'Found 15 coins!'];return true;
 }
 if(d.kind==='rest'){d.party.forEach(m=>{if(m.hp>0){m.hp=clamp(m.hp+50,0,m.stats.hp);m.energy=100;}});d.cleared=true;d.log=['Warm water. +50 HP and full energy.'];return true;}
 if(!m||m.hp<=0)return false;
 const e=d.enemy;
 if(action==='skill'&&m.energy<30){d.log=['Not enough energy. Guard to recover.'];return false;}
 if(action==='heal'&&d.potions<=0){d.log=['No remedies left.'];return false;}
 let damage=0;
 if(action==='attack'||action==='skill'){
  if(action==='skill')m.energy-=30;else m.energy=clamp(m.energy+8);
  damage=Math.max(4,Math.round(m.stats.atk*(action==='skill'?1.8:1)-e.def*.45));
  if(m.stats.spd>20&&random(s)<.2)damage=Math.round(damage*1.4);
  e.hp=clamp(e.hp-damage,0,e.maxHp);e.poison=Math.max(e.poison,m.stats.poison);
  d.log=[`${m.name}: ${action==='skill'?FORMS[m.element].skill:'strike'}! ${damage} damage.`];
  if(action==='skill'&&['Light','Wood','Water'].includes(m.element))d.party.forEach(a=>{if(a.hp>0)a.hp=clamp(a.hp+Math.round(12*m.stats.heal),0,a.stats.hp);});
 }else if(action==='heal'){d.potions--;m.hp=clamp(m.hp+Math.round(45*m.stats.heal),0,m.stats.hp);d.log=[`${m.name} recovers health.`];}
 else if(action==='guard'){m.energy=clamp(m.energy+30);d.log=[`${m.name} guards. +30 energy.`];}
 else return false;
 if(e.hp>0&&e.poison>0){e.hp=clamp(e.hp-Math.ceil(e.poison),0,e.maxHp);}
 if(e.hp<=0){
  d.cleared=true;const reward=5+d.floor*2;s.coins+=reward;d.loot+=reward;
  d.log.push(`Path clear! +${reward} coins.`);
  if(d.floor===10){d.ended=true;d.won=true;s.clears++;s.coins+=100;d.log=['The Titan falls. The grove is safe!','Victory! +100 coins.'];}return true;
 }
 const target=alive[Math.floor(random(s)*alive.length)];const guarded=action==='guard'&&target.id===m.id;
 const taken=Math.max(2,Math.round((e.atk-target.stats.def*.35)*(guarded?.4:1)));
 target.hp=clamp(target.hp-taken,0,target.stats.hp);d.log.push(`${e.name} hits ${target.name}: ${taken}.`);
 for(const a of d.party)if(a.hp>0&&a.stats.regen)a.hp=clamp(a.hp+Math.ceil(a.stats.regen),0,a.stats.hp);
 if(d.party.every(a=>a.hp<=0)){d.ended=true;d.log=['The party retreats safely.','Your collection is safe. Try again!'];}
 return true;
}
export function encode(s){return JSON.stringify(s);}
export function decode(raw){
 const s=JSON.parse(raw);const fail=()=>{throw new Error('Invalid or unsupported EVOPET save');};
 const number=(v,min=0,max=1e12)=>Number.isFinite(v)&&v>=min&&v<=max;
 if(!s||s.version!==1||!number(s.rng,0,4294967295)||!number(s.generation)||!Array.isArray(s.archive)||!Array.isArray(s.unlocked)||!Array.isArray(s.discovered)||!Array.isArray(s.trinkets)||!s.highScores||typeof s.highScores!=='object'||Array.isArray(s.highScores)||!Object.values(s.highScores).every(v=>number(v,0,1e6)))fail();
 const checkPet=p=>{
  if(!p||typeof p.id!=='string'||!STAGES.includes(p.stage)||p.heritage!==null&&!ELEMENTS.includes(p.heritage)||!number(p.stageAge)||!number(p.age)||!number(p.generation)||!TRAITS.includes(p.trait)||typeof p.sleeping!=='boolean'||typeof p.sick!=='boolean')fail();
  if(!p.needs||!['food','fun','energy','clean','health'].every(k=>number(p.needs[k],0,100)))fail();
  if(!p.record||typeof p.record.sick!=='boolean'||!['seconds','food','clean','sleep','activity'].every(k=>number(p.record[k])))fail();
  if(!p.history||!['fed','play','train','baths','cures','illnesses'].every(k=>number(p.history[k])))fail();
  if(p.stage==='JUVENILE'&&!['A','B','C'].includes(p.juvenile)||p.stage==='ADULT'&&!['A1','A2','B1','C1','C2'].includes(p.adult)||p.stage==='FINAL'&&!ELEMENTS.includes(p.element))fail();
  if(p.equipped!==null&&!TRINKETS[p.equipped])fail();
 };
 if(!s.active)fail();checkPet(s.active);s.archive.forEach(p=>{checkPet(p);if(p.stage!=='FINAL')fail();});
 if(new Set(s.archive.map(p=>p.id)).size!==s.archive.length||!s.unlocked.every(e=>ELEMENTS.includes(e))||!s.trinkets.every(t=>TRINKETS[t]))fail();
 if(![0,1,4,16].includes(s.speed)||typeof s.sound!=='boolean'||typeof s.contrast!=='boolean'||!['coins','bestFloor','clears'].every(k=>number(s[k])))fail();
 if(s.dungeon){const d=s.dungeon;if(!number(d.floor,1,10)||!Array.isArray(d.party)||!d.party.length||d.party.length>3||!['combat','boss','rest','treasure'].includes(d.kind)||!Array.isArray(d.log)||!d.log.every(x=>typeof x==='string')||!number(d.potions,0,3)||!number(d.loot)||!['cleared','ended','won'].every(k=>typeof d[k]==='boolean'))fail();
  for(const m of d.party)if(!s.archive.some(p=>p.id===m.id)||!ELEMENTS.includes(m.element)||typeof m.name!=='string'||!m.stats||!['hp','atk','def','spd','heal','regen','poison'].every(k=>number(m.stats[k]))||!number(m.hp,0,m.stats.hp)||!number(m.energy,0,100))fail();
  if(['combat','boss'].includes(d.kind)&&(!d.enemy||typeof d.enemy.name!=='string'||!['bat','hound','titan'].includes(d.enemy.type)||!number(d.enemy.maxHp,1)||!number(d.enemy.hp,0,d.enemy.maxHp)||!number(d.enemy.atk)||!number(d.enemy.def)||!number(d.enemy.poison)))fail();
 }
 return s;
}
