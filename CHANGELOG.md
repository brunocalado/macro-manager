# 1.1.2

- [Fixed] "Build Macro Manager" button no longer stacks up duplicates when the Macro Directory sidebar re-renders (macro CRUD, tab switch).
- [Changed] All stylesheet rules are now scoped under a `.macro-manager` class (native CSS nesting) so they can't leak into core UI or other modules.
- [Changed] Builder buttons (Select All / None, Preview) and viewer macro buttons now use the ApplicationV2 `actions` map instead of manual listeners; the form submit handler moved to `DEFAULT_OPTIONS`.
- [Changed] Added the GPLv3 license header to every `.js` and `.css` file; translated remaining non-English code comments.
- [Changed] Internal cleanup: viewer render part renamed `form` → `content`, `createManagerMacroV2` → `createManagerMacro`, Font Awesome class usage standardized.
- Verified in a live Foundry v14.367 world: builder selection/folders/preview/mode-switch/build and the generated manager's macro-run and folder-collapse all working.

# 1.1.1

- [Added] "Build Macro Manager" button in the Macro Directory sidebar (GM only) that opens the builder directly.

# 1.1.0

- [Fixed] Macro names containing quotes no longer break the generated macro script.
- [Fixed] Folder input in the builder no longer suppresses focus via incorrect inline event handler.
- [Fixed] Removed redundant double `if (uuid)` check in macro click handler.
- [Fixed] Checkbox values for Persistent and Sort settings now use correct boolean coercion.
- [Changed] `MODULE_ID` and template paths centralized in `scripts/constants.js`.
- [Changed] Failed macro preview and resolution now emit a console warning instead of silently failing.

# 1.0.5
- You can adds from the world and from the compendium to a macro.
- You can pick the macro title name
- You can open how many macros you want
- You can add folders to macro manager.

# 1.0.4
You create macro managers with a macro builder. Very easy. Only accept UUID now.

# 1.0.2
the module was remade to be very simple.

0.3.0
- v13

0.2.9
- v12

0.2.8
- small fix 

0.2.7
- v11
- small fix

0.2.6
- small improvement, update to fvtt reload

0.2.5
- setting to change header background color

0.2.4
- setting to change header color

0.2.3
- v10 fix again fuck

0.2.1
- v10 fix
## WARNING - v9
This module is updated to v10. If you need the v9 version download in this [link](https://github.com/brunocalado/macro-manager/raw/main/docs/macro-manager.7z) and install manually.

0.2.0
- tools macro fix
- macros in the world will run even if the player don't have permission to execute that macro
- keybind for players fixed 1-9

0.1.9
- small refactor

0.1.8
- transparent dialog background, but working

0.1.7
- quick fix 

0.1.6
- transparent dialog background fix

0.1.5
- transparent dialog background

0.1.4
- minor fixes
- improved dialog, add template for easier manipulation
- stringListToArray removes empty, prevent not working with extra ;;;
- error handling for compendium
- themes

0.1.3
- header
- tools: documentation link

0.1.2
- Tool: Get all macro names from compendium
- summary replaced by tools. It's inside tools
- sort names option
- fix bug: macros in compendium run now

0.1.1
- compendium with demo macros
- you can use macros inside compendium
- BREAKING: openCustomMacroManager use an object as arg. Read docs

0.1.0
- create custom macro, no need for settings

0.0.9
- option for enable keyboard shortcut for players
- localization

0.0.8
- fix text controls

0.0.7
- docs
- up to 9 managers
- summary: shift + 0
- gm only keybinds