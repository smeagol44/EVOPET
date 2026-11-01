# Prototype 0.1 validation

## Automated checks

`npm run check` and `npm test` pass. The suite contains 23 tests:

- All ten finals are reached by advancing the actual simulation and applying care actions; Earth and Darkness do not rely on artificially setting health or cleanliness.
- Archive idempotence, heritage unlock restrictions, archived-pet stability, pure/mixed bonuses, stage action limits and minigame rewards.
- Save round-trip and invalid-schema rejection.
- Party validation, serialized turns, one-time room rewards, trinket ownership and a complete victorious dungeon expedition.
- The real `game.js` entry point runs against a small DOM/canvas adapter. Supported key inputs drive all five minigames, including a successful bubble hit, pause/resume, cancellation without reward, final archiving, party selection, combat, and a second egg with unlocked heritage. This is an input/state integration test, not a browser rendering test.

## Browser observations

In Chrome, using the managed preview:

- Title and nursery scenes render with the supplied pixel sprites and local font.
- Arrow/Z/X/C navigation opens menus, changes time speed, feeds the Baby, reaches Juvenile, launches Flappy, applies flap input and reaches its reward screen.
- Reload shows Continue Journey and retains the current save.
- The published GitHub Pages address renders the same title screen and assets.

The screenshot in `prototype-preview.jpg` was captured from the deployed public game.

## Limits

This is a first playable prototype. Not every possible party, balance combination, browser or mobile viewport has been manually played. Automated minigame coverage verifies simulation/input transitions with a canvas adapter; it does not judge collision feel or visual quality. Missing final creature art uses provisional code-native drawings. See `DESIGN.md` for design interpretations and deferred features.
