export const VERSION = '0.1.0';
export const STAGES = ['EGG','BABY','JUVENILE','ADULT','FINAL'];
export const DURATION = {EGG:12, BABY:36, JUVENILE:90, ADULT:120};
export const COLORS = {Light:'#f3dca8', Fire:'#e36a54', Ice:'#a9e4e4', Water:'#5d9bd9', Wood:'#81ae64', Earth:'#b8a16e', Thunder:'#e5c34d', Air:'#c6dbaf', Poison:'#b58fca', Darkness:'#787b99'};
export const FORMS = {
 Light:{name:'Lumen',role:'Radiant healer',skill:'Sunbeam',passive:'Healing +30%',stat:'heal',hp:115,atk:22,def:14,spd:17},
 Fire:{name:'Emberhorn',role:'Flame striker',skill:'Flare',passive:'Attack +25%',stat:'atk',hp:110,atk:29,def:12,spd:17},
 Ice:{name:'Frostfin',role:'Glacial guardian',skill:'Ice fang',passive:'Defense +30%',stat:'def',hp:135,atk:21,def:21,spd:11},
 Water:{name:'Rippletail',role:'Tidal guardian',skill:'Tidal wave',passive:'Health +30%',stat:'hp',hp:145,atk:22,def:17,spd:12},
 Wood:{name:'Mossback',role:'Forest keeper',skill:'Bloom',passive:'Regenerate 5 HP/turn',stat:'regen',hp:130,atk:21,def:18,spd:13},
 Earth:{name:'Pebblepaw',role:'Stone defender',skill:'Quake',passive:'Defense +30%',stat:'def',hp:150,atk:23,def:22,spd:8},
 Thunder:{name:'Sparklit',role:'Storm sprinter',skill:'Volt rush',passive:'Speed +30%',stat:'spd',hp:105,atk:26,def:12,spd:25},
 Air:{name:'Cloudwing',role:'Wind dancer',skill:'Gust',passive:'Speed +30%',stat:'spd',hp:110,atk:22,def:14,spd:24},
 Poison:{name:'Sporekin',role:'Venom caster',skill:'Toxic mist',passive:'Strikes inflict 4 poison',stat:'poison',hp:120,atk:24,def:15,spd:18},
 Darkness:{name:'Duskwisp',role:'Shadow spirit',skill:'Nightfall',passive:'Attack +25%',stat:'atk',hp:115,atk:30,def:13,spd:20}
};
export const ELEMENTS = Object.keys(FORMS);
export const ADULT_NAMES = {A1:'Kindle',A2:'Dewdrop',B1:'Budrock',C1:'Spark',C2:'Murk'};
export const JUV_NAMES = {A:'Pelu',B:'Mellow',C:'Pip'};
export const TRAITS = ['Curious','Hearty','Dreamy','Lively'];
export const ACTIONS = ['FEED','PLAY','SLEEP','BATH','CURE','TRAIN'];
export const GAMES = {
 FEAST:{name:'Snack catch',hint:'LEFT / RIGHT: catch fruit, avoid stones',reward:'food'},
 FLAPPY:{name:'Pelu flight',hint:'Z: flap through the gaps',reward:'fun'},
 BUBBLE:{name:'Bubble bath',hint:'ARROWS: move sponge   Z: scrub',reward:'clean'},
 BALL:{name:'Toy bounce',hint:'LEFT / RIGHT: keep the ball in the air',reward:'fun'},
 SPRINT:{name:'Garden dash',hint:'Z: jump over the stones',reward:'train'},
};
export const TRINKETS = {
 ember:{name:'Ember charm',desc:'+4 attack',stat:'atk',value:4},
 shell:{name:'River shell',desc:'+25 health',stat:'hp',value:25},
 leaf:{name:'Lucky leaf',desc:'+4 defense',stat:'def',value:4},
 feather:{name:'Sky feather',desc:'+5 speed',stat:'spd',value:5}
};
// The supplied diagram is authoritative. Thresholds are prototype tuning.
export const EVOLUTION_GUIDE = [
 ['Baby > Pelu','Average food 30-85.','A balanced start.'],
 ['Baby > Mellow','Average food above 85.','Feed often, even when full.'],
 ['Baby > Pip','Average food below 30.','Let food run low.'],
 ['Pelu > Kindle','Play/train at least 3 times.','Otherwise: Dewdrop.'],
 ['Mellow > Budrock','The well-fed branch.','Always Budrock.'],
 ['Pip > Murk','Become sick while juvenile.','Otherwise: Spark.'],
 ['Kindle > Light','Sleep under 8% of adulthood.','Otherwise: Fire.'],
 ['Dewdrop > Ice','Sleep over 45% of adulthood.','Otherwise: Water.'],
 ['Budrock > Earth','Average cleanliness under 35.','Otherwise: Wood.'],
 ['Spark > Air','Under 2 adult play/train games.','Otherwise: Thunder.'],
 ['Murk > Darkness','Health reaches zero as Murk.','Otherwise: Poison.'],
];
