import { test } from 'node:test';
import assert from 'node:assert/strict';

// Exercise the actual browser entry point with a lightweight DOM/canvas adapter.
// This checks input routing and real minigame simulation without a browser dependency.
const listeners = {}, storage = new Map();
let animation, now = performance.now();
const noop = () => {};
const ctx = {fillRect:noop,fillText:noop,save:noop,restore:noop,translate:noop,scale:noop,drawImage:noop,measureText:s=>({width:String(s).length*5})};
const canvas = {getContext:()=>ctx,focus:noop};
const status = {textContent:''};
globalThis.window = {addEventListener:(name,fn)=>listeners[name]=fn};
globalThis.document = {getElementById:id=>id==='game'?canvas:status,querySelectorAll:()=>[],addEventListener:noop,hasFocus:()=>true,hidden:false,fonts:{load:async()=>[]}};
globalThis.localStorage = {getItem:key=>storage.get(key)||null,setItem:(key,val)=>storage.set(key,val)};
globalThis.HTMLInputElement = class {};
globalThis.Image = class {set src(value){queueMicrotask(()=>this.onload?.());}};
globalThis.requestAnimationFrame = fn=>animation=fn;
await import('../public/src/game.js');
const screen=()=>window.evopet.screen();
const snapshot=()=>window.evopet.snapshot();
function down(code){listeners.keydown({code,repeat:false,target:canvas,preventDefault:noop});}
function up(code){listeners.keyup({code});}
function key(code){down(code);up(code);}
function frames(n){for(let i=0;i<n;i++){now+=50;animation(now);}}
function press(code,n){for(let i=0;i<n;i++)key(code);}
function speed(index){key('KeyC');press('ArrowDown',2);key('KeyZ');press('ArrowDown',index);key('KeyZ');}
function launch(index,submenu=0){press('ArrowRight',index);key('KeyZ');if(index===0||index===1){press('ArrowDown',submenu);key('KeyZ');}assert.equal(screen(),'mini-intro');key('KeyZ');assert.equal(screen(),'minigame');}

test('Whole game is navigable with arrows/Z/X/C, including all five minigames',()=>{
 assert.equal(screen(),'title');
 key('KeyC');assert.equal(screen(),'habitat','Start should start the title screen');
 speed(3);frames(20);assert.equal(screen(),'evolution');assert.equal(snapshot().active.stage,'BABY');
 key('KeyZ');key('KeyZ');frames(50);assert.equal(screen(),'evolution');
 key('KeyZ');assert.equal(snapshot().active.stage,'JUVENILE');speed(0);
 const age=snapshot().active.age;
 // Feast
 launch(0);frames(310);assert.equal(screen(),'result');assert.ok('FEAST' in snapshot().highScores);key('KeyZ');
 // Flappy: flap input, then natural end on collision/fall.
 launch(1);key('KeyZ');frames(90);assert.equal(screen(),'result');assert.ok('FLAPPY' in snapshot().highScores);key('KeyZ');
 // Paddle bounce
 launch(1,1);down('ArrowLeft');frames(10);up('ArrowLeft');frames(310);assert.equal(screen(),'result');assert.ok('BALL' in snapshot().highScores);key('KeyZ');
 // Bubble scrub: navigate to a real target and pop it.
 launch(3);down('ArrowLeft');frames(6);up('ArrowLeft');down('ArrowDown');frames(3);up('ArrowDown');key('KeyZ');frames(310);assert.equal(screen(),'result');assert.ok(snapshot().highScores.BUBBLE>=1);key('KeyZ');
 // Runner: pause/resume and jump.
 launch(5);key('KeyC');frames(400);assert.equal(screen(),'list');key('KeyZ');assert.equal(screen(),'minigame');key('KeyZ');frames(310);assert.equal(screen(),'result');assert.ok('SPRINT' in snapshot().highScores);key('KeyZ');
 assert.equal(snapshot().active.age,age,'No care minigame may advance pet time');
 // Cancelling must not grant another reward.
 const coins=snapshot().coins;launch(1);key('KeyX');key('ArrowDown');key('KeyZ');assert.equal(screen(),'habitat');assert.equal(snapshot().coins,coins);
 // Archive the first final using only the clock and normal input.
 speed(3);frames(130);assert.equal(screen(),'evolution');assert.equal(snapshot().active.stage,'ADULT');key('KeyZ');frames(170);assert.equal(screen(),'evolution');assert.equal(snapshot().archive.length,1);key('KeyZ');
 // Draft a real archived companion and enter combat.
 key('KeyC');press('ArrowDown',5);key('KeyZ');assert.equal(screen(),'party');key('KeyZ');key('ArrowDown');key('KeyZ');assert.equal(screen(),'dungeon');
 const hp=snapshot().dungeon.enemy.hp;key('KeyZ');assert.ok(snapshot().dungeon.enemy.hp<hp);assert.ok(storage.get('evopet.save.v1'));
 // Return to the nursery without losing the saved expedition.
 key('KeyC');key('ArrowDown');key('KeyZ');assert.equal(screen(),'habitat');assert.ok(snapshot().dungeon);
 // Archive browsing and unlocked heritage selection.
 key('KeyC');press('ArrowDown',4);key('KeyZ');assert.equal(screen(),'archive');key('ArrowRight');key('KeyZ');assert.equal(screen(),'list');key('ArrowDown');key('KeyZ');assert.equal(screen(),'habitat');assert.equal(snapshot().active.stage,'EGG');assert.equal(snapshot().active.heritage,snapshot().unlocked[0]);assert.equal(snapshot().generation,2);
});
