# EVOPET prototype design

## Source priorities

The supplied evolution diagram defines the branches. The Construct export supplies the small pixel-art direction, pet sprites, font and Flappy reference. The Playground implementation supplies the active-care/minigame/lineage/dungeon structure. The earlier project summary supplies one active pet, selectable unlocked heritage, immutable archived pets, no offline waiting, and pure/mixed true forms.

The implementation is a clean buildless JavaScript game. It does not depend on Playground's SDK, React host or missing generated asset URLs. The original Construct runtime is not redistributed.

## Evolution rules

Stage durations at 1x: Egg 12 seconds, Baby 36, Juvenile 90, Adult 120. Evolution announcements pause progression until confirmed. Branch records reset at every evolution. These are prototype values, exposed in `data.js`.

| Transition | Requirement | Default alternative |
| --- | --- | --- |
| Baby → Mellow (B) | Average food >85 | Pelu (A), food 30–85 |
| Baby → Pip (C) | Average food <30 | Pelu (A) |
| Pelu → Kindle (A1) | At least 3 completed play/training rounds | Dewdrop (A2) |
| Mellow → Budrock (B1) | Always | — |
| Pip → Murk (C2) | Illness recorded during Juvenile | Spark (C1) |
| Kindle → Light | Less than 8% Adult time asleep | Fire |
| Dewdrop → Ice | More than 45% Adult time asleep | Water |
| Budrock → Earth | Average Adult cleanliness <35 | Wood |
| Spark → Air | Fewer than 2 Adult play/training rounds | Thunder |
| Murk → Darkness | Health reaches zero during Adult | Poison |

Darkness is interpreted as a safe metamorphosis at the diagram's death condition. It never deletes the companion. Other branches remain recoverable at zero health in this forgiving prototype. This interpretation should be revisited if real pet death is desired.

The summary described a generic Juvenile; the newer supplied diagram has three diet variants, which take precedence here. Personality has small appetite/rest effects; there are no random evolution gates in this first prototype, so every diagram branch can be deliberately tested.

## Heritage and collection

No starting heritage or seeded ancestors. Every completed final is archived once, grants 30 coins and unlocks its element. The next egg may inherit one unlocked element or none. Natural passives apply at full power; inherited passives at 35% strength. Matching natural/heritage elements grant an additional 5% to the four combat stats. Mixed forms combine distinct bonuses. Neither heritage nor personality forces a final species.

Archive records retain their birth generation, behavior, element and heritage. Equipping a trinket changes only equipment; it cannot change the natural form or inherited element. Each owned trinket can be equipped by one archived companion at a time. Duplicate species from different generations remain separate party candidates.

## Care and games

Baby supports direct feeding and toggled sleep. Juvenile and Adult unlock food catching, Flappy, paddle bounce, bubble scrubbing, and obstacle jumping. Feeding also has a quick-snack action; cure and sleep are direct actions. Finishing a round applies care once and records activity; cancelling applies no reward. Minigame time is always real time and pauses pet simulation.

## Dungeon

One to three archived companions. Turns resolve immediately; no delayed timers survive screen changes. Strike restores 8 energy; skill costs 30; guard restores 30 and reduces incoming damage to the guarding target. Three shared remedies heal. Active member selection is explicit. Enemy targets are selected from living members. Natural and inherited passives affect actual combat stats, poison, regeneration or healing.

Floors 3, 6 and 9 contain treasure; 4 and 8 contain springs; 10 contains the Titan. Other floors contain bats/hounds. Rewards are granted once per cleared room. Victory grants 100 additional coins. Retreat/defeat preserve archives and earned rewards. The current run is serialized after each turn and can be resumed. The active growing pet is never substituted into the party.

## Saves and safety

LocalStorage saves active pet, archive, discoveries, settings, RNG, minigame records, dungeon state and equipment. Parsing validates schema/version, stage, numeric bounds, known elements and dungeon members. Invalid imports are rejected before replacing the current state. Export/restore uses JSON; there is no server or account dependency. Browser storage errors show a warning and leave export available.

## Intentionally unfinished / simplified

- The dungeon is a linear sequence with predictable rest/treasure rooms rather than a procedural map. No merchants, shrine choices or room exploration yet.
- Sleep and cure are direct actions. Playground's design document mentioned constellation/remedy puzzles, but its actual source did not implement them.
- The small personality effects/names are not a genetics simulation; only the listed implemented traits exist.
- Coins are earned and displayed in the collection UI; no shop/economy sink yet.
- Final-form sprites are provisional code-native pixel shapes and need an artist's content pass. Several share a body template and have elemental details.
- Basic synthesized sound effects; no music. Playground's media files were placeholders.
- No achievements, rare mutations, advanced dungeon status effects or controller/gamepad support yet.
- Save imports use a native file picker. The game itself requires only arrows/Z/X/C.
- Canvas HUD content is not fully exposed to screen readers. An aria-live region announces screen changes and important events; full nonvisual accessibility remains future work.
