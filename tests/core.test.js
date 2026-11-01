import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DURATION,FORMS} from '../public/src/data.js';
import {newState,tick,care,chooseFinal,encode,decode,startEgg,finishGame,combatStats,beginDungeon,dungeonAction,nextFloor,equip,evolve,archivePet} from '../public/src/core.js';
function advance(s,seconds,fn=()=>{}){let e;for(let t=0;t<seconds;t+=.25){fn(t);e=tick(s,.25)||e;}return e;}
function raise(element,heritage=null){
 const s=newState(44);s.active.heritage=heritage;
 advance(s,12);assert.equal(s.active.stage,'BABY');
 if(['Wood','Earth'].includes(element))advance(s,36,t=>{if(t%3===0)care(s,'feed');});
 else if(['Air','Thunder','Poison','Darkness'].includes(element))advance(s,36);
 else {care(s,'feed');advance(s,36);}
 assert.equal(s.active.stage,'JUVENILE');
 const p=s.active;
 if(element==='Poison'){advance(s,1);care(s,'cure');}
 else if(element!=='Darkness')care(s,'cure');
 if(element!=='Darkness')care(s,'feed');
 if(['Fire','Light'].includes(element))for(let i=0;i<3;i++)finishGame(s,'FLAPPY',4);
 advance(s,90,t=>{if(element!=='Darkness'&&t%20===0){care(s,'feed');if(element!=='Earth')care(s,'bath');care(s,'cure');}});
 assert.equal(s.active.stage,'ADULT');
 if(element==='Thunder')for(let i=0;i<2;i++)finishGame(s,'SPRINT',4);
 if(element==='Fire'||element==='Ice')care(s,'sleep');
 advance(s,120,t=>{
  if(!['Darkness'].includes(element)&&t%20===0){if(!p.sleeping){care(s,'feed');if(element!=='Earth')care(s,'bath');care(s,'cure');}}
  if(element==='Fire'&&t===24)care(s,'sleep');
 });
 assert.equal(p.stage,'FINAL');assert.equal(p.element,element);return s;
}
for(const element of Object.keys(FORMS))test(`Full lifecycle reaches ${element} using actual care`,()=>{const s=raise(element);assert.equal(s.archive.length,1);assert.deepEqual(s.unlocked,[element]);assert.equal(decode(encode(s)).archive[0].element,element);});
test('Archive and unlock rewards cannot duplicate',()=>{const s=raise('Water'),coins=s.coins;archivePet(s,s.active);evolve(s);tick(s,10);assert.equal(s.archive.length,1);assert.equal(s.coins,coins);});
test('First generation has no free heritage or fake ancestors',()=>{const s=newState(1);assert.equal(s.active.heritage,null);assert.deepEqual(s.archive,[]);assert.deepEqual(s.unlocked,[]);assert.equal(startEgg(s,'Fire'),false);});
test('New eggs only use unlocked heritages and do not mutate archive',()=>{const s=raise('Water'),before=encode(s.archive);assert.equal(startEgg(s,'Fire'),false);assert.equal(startEgg(s,'Water'),true);care(s,'feed');tick(s,1);assert.equal(encode(s.archive),before);assert.equal(s.generation,2);assert.equal(s.active.heritage,'Water');});
test('Pure and mixed heritages add distinct bonuses without determining evolution',()=>{const natural=raise('Water'),pure=raise('Water','Water'),mixed=raise('Water','Fire');const a=combatStats(natural.active),b=combatStats(pure.active),c=combatStats(mixed.active);assert.ok(b.hp>a.hp);assert.ok(c.atk>a.atk);assert.equal(c.hp,a.hp);assert.equal(mixed.active.element,'Water');});
test('Egg has no care and Baby only permits feeding/sleeping',()=>{const s=newState();assert.equal(care(s,'feed'),false);advance(s,12);assert.equal(care(s,'bath'),false);assert.equal(care(s,'play'),false);assert.equal(care(s,'sleep'),true);assert.equal(care(s,'feed'),false);assert.equal(care(s,'sleep'),true);assert.equal(care(s,'feed'),true);});
test('Minigame reward changes care and records but never ages the pet',()=>{const s=raise('Water');startEgg(s,null);advance(s,12);care(s,'feed');advance(s,36);const age=s.active.age;finishGame(s,'FLAPPY',5);assert.equal(s.active.age,age);assert.equal(s.active.record.activity,1);assert.equal(s.highScores.FLAPPY,5);});
test('Save round-trip preserves current stage, behavior, sleeping and RNG',()=>{const s=newState(99);advance(s,12);care(s,'sleep');advance(s,5);assert.deepEqual(decode(encode(s)),s);});
test('Save validation rejects corrupted, future and structurally invalid files',()=>{assert.throws(()=>decode('{bad'));for(const edit of [s=>s.version=2,s=>s.active=null,s=>s.active.needs.food=-1,s=>s.active.record=null,s=>s.unlocked=['FAKE'],s=>s.active.stage='ALIEN',s=>s.trinkets=['FAKE'],s=>s.dungeon={floor:1}]){const s=newState();edit(s);assert.throws(()=>decode(encode(s)));}});
test('Dungeon rejects unarchived pets, duplicated pets, and overfull parties',()=>{const s=raise('Fire'),id=s.archive[0].id;assert.equal(beginDungeon(s,['bad']),false);assert.equal(beginDungeon(s,[id,id]),false);assert.equal(beginDungeon(s,[id,id,id,id]),false);assert.equal(beginDungeon(s,[id]),true);assert.equal(beginDungeon(s,[id]),false);});
test('Dungeon turn saves and resumes exactly, no extra repeated reward',()=>{const s=raise('Fire');beginDungeon(s,[s.archive[0].id]);const age=s.active.age;dungeonAction(s,'attack');const r=decode(encode(s));assert.deepEqual(r,s);assert.equal(s.active.age,age);while(!s.dungeon.cleared&&!s.dungeon.ended)dungeonAction(s,'skill');const coins=s.coins;dungeonAction(s,'attack');assert.equal(s.coins,coins);});
test('Dungeon room types, treasure, rest, equipment and victory are playable',()=>{const s=raise('Fire');for(const e of ['Water','Wood']){const extra=raise(e).active;extra.id='extra-'+e;s.archive.push(extra);}beginDungeon(s,s.archive.map(p=>p.id));let n=0;while(!s.dungeon.ended&&n++<300){const d=s.dungeon;if(d.cleared){assert.ok(nextFloor(s));continue;}let i=d.party.findIndex(m=>m.hp>0);const m=d.party[i];dungeonAction(s,m.hp<50&&d.potions?'heal':m.energy>=30?'skill':'attack',i);}assert.ok(n<300);assert.ok(s.dungeon.won,'balanced 3-pet party should win');assert.equal(s.bestFloor,10);assert.equal(s.clears,1);assert.ok(s.trinkets.length);assert.ok(decode(encode(s)));const key=s.trinkets[0];assert.equal(equip(s,s.archive[0].id,key),true);assert.equal(equip(s,s.archive[1].id,key),true);assert.equal(s.archive[0].equipped,null);assert.equal(s.archive[1].equipped,key);});
test('Darkness is a safe metamorphosis, not loss of collection',()=>{const s=raise('Darkness');assert.equal(s.archive.length,1);assert.equal(s.archive[0].element,'Darkness');});
