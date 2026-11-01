# EVOPET — Pocket Edition

A keyboard-first virtual pet prototype with a Game Boy Color inspired palette. Raise one companion, discover ten elemental finals, pass their heritage to the next generation, and take your archived collection into a ten-floor dungeon.

**Play:** https://smeagol44.github.io/EVOPET/

## Controls

| Input | Action |
| --- | --- |
| Arrow keys | Navigate; move in minigames |
| Z | Confirm; flap; jump; scrub |
| X | Back; cancel; leave a minigame |
| C | Start / pause menu |

Every game screen supports these keys. On-screen buttons support touch and mouse. Importing a backup uses the browser's native file picker.

## Playable features

- Egg → Baby → Juvenile → Adult → Final; branching follows the supplied evolution diagram.
- Food, happiness, energy, cleanliness, health, illness, sleep, and stage-specific care history.
- Ten finals: Light, Fire, Ice, Water, Wood, Earth, Thunder, Air, Poison, Darkness.
- Five 15-second minigames: Snack Catch, Pelu Flight (Flappy), Bubble Bath, Toy Bounce, Garden Dash.
- Final forms automatically enter the permanent archive and unlock a selectable heritage.
- Natural, pure true, and mixed true forms. Heritage adds a weaker bonus and secondary palette accent; it does not force the natural evolution.
- Select 1–3 archived pets for a ten-floor dungeon with combat, energy, healing, resting springs, treasure, trinkets, and the Basalt Titan.
- Versioned local autosave; JSON backup export/restore; resumable dungeon runs.
- Pause / 1x / 4x / 16x pet time. Menus, minigames, unfocused windows and hidden tabs pause growth. No offline aging.
- Sound-effect and high-contrast options.

The first run starts with an actual egg and an empty archive. There are no artificial ancestors or unlocked heritages.

## Development

Buildless ES modules and Canvas 2D. No npm dependencies or external asset services.

```sh
npm run check
npm test
python3 -m http.server 8000 --directory public
```

Open `http://localhost:8000`. ES modules require HTTP serving rather than opening the file directly.

Changes pushed to `main` run syntax checks and the Node test suite, then deploy `public/` through GitHub Actions. Pull requests run checks without deployment.

## Source layout

- `public/src/data.js`: forms, balance values, evolution hints, minigame definitions.
- `public/src/core.js`: pure simulation, branching, archives, save validation, combat.
- `public/src/game.js`: input, screens, audio, persistence, minigame simulation.
- `public/src/render.js`: limited-palette canvas renderer and pixel shapes.
- `public/assets/`: supplied Construct sprites/font and sprites extracted from the diagram.
- `tests/core.test.js`: actual care-through-lifecycle tests for every final, save integrity, heritage, and dungeon integration.
- `docs/DESIGN.md`: implemented rules, source comparison and prototype limitations.

## Persistence

Save key: `evopet.save.v1`. Back up before switching browser, device or website address. Exports contain the whole game state. Invalid imports leave the existing journey untouched. Restore retains the previous save under `evopet.save.v1.before-restore`. An unreadable existing save is preserved under a recovery key before a new journey is written.

## Asset provenance

Sprites and the Pixelify Sans font came from the owner-supplied Construct HTML5 export; juvenile variants and Spark came from the owner-supplied evolution diagram. Missing adult/final forms, scenery, enemies and UI are code-native pixel drawings. Playground's supplied media were 9-byte placeholders and are not used. Pixelify Sans is distributed under the SIL Open Font License; see `public/assets/OFL.txt`.

This is a source-code prototype inspired by the provided projects, not an editable Construct `.c3p` file. The Construct HTML5 export does not contain the original editor project.
