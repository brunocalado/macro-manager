const moduleName = 'macro-manager';
import { mm } from './api.js'

Hooks.on("renderSettingsConfig", (app, [html]) => {
  const setting = "macro-manager.01macros";
  const input = html.querySelector(`[name='${setting}']`);
  const textarea = document.createElement("textarea");
  textarea.name = setting;
  input?.replaceWith(textarea);
  
  const setting2 = "macro-manager.02macros";
  const input2 = html.querySelector(`[name='${setting}']`);
  const textarea2 = document.createElement("textarea");
  textarea2.name = setting2;
  input2?.replaceWith(textarea2);

  const setting3 = "macro-manager.03macros";
  const input3 = html.querySelector(`[name='${setting}']`);
  const textarea3 = document.createElement("textarea");
  textarea3.name = setting3;
  input3?.replaceWith(textarea3);  
});

Hooks.once('init', function() {
  // --------------------------------------------------
  // Load API
  game.modules.get(moduleName).api = { mm }; // Request with: const mm = game.modules.get('macro-manager')?.api.mm;

  // --------------------------------------------------
  // Module Options
  // call this with: game.settings.get("macro-manager", "01title")
  game.settings.register(moduleName, '01title', {
    name: 'Title for Macro Manager 01',
    hint: 'This is the title of the macro dialog 01.',
    scope: 'world',
    config: true,
    default: 'Macro Manager 01',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "01macros")
  game.settings.register(moduleName, '01macros', {
    name: 'Macro List for Macro Manager 01',
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: 'Macro Manager 01',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "01persistent")
  game.settings.register(moduleName, '01persistent', {
    name: 'Persistent Macro Manager 01',
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // call this with: game.settings.get("macro-manager", "02title")
  game.settings.register(moduleName, '02title', {
    name: 'Title for Macro Manager 02',
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager 02',
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "02macros")
  game.settings.register(moduleName, '02macros', {
    name: 'Macros for Macro Manager 02',
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "02persistent")
  game.settings.register(moduleName, '02persistent', {
    name: 'Persistent Macro Manager 02',
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // call this with: game.settings.get("macro-manager", "03title")
  game.settings.register(moduleName, '03title', {
    name: 'Title for Macro Manager 03',
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager 03',
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "03macros")
  game.settings.register(moduleName, '03macros', {
    name: 'Macros for Macro Manager 03',
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "03persistent")
  game.settings.register(moduleName, '03persistent', {
    name: 'Persistent Macro Manager 03',
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // call this with: game.settings.get("macro-manager", "fontsize")
  game.settings.register(moduleName, 'fontsize', {
    name: 'Font Size',
    hint: 'This will change the font size for the macro label.',
    scope: 'world',
    config: true,
    default: 14,
    range: {
      min: 10,
      max: 30,
      step: 1
    },    
    type: Number
  }); 


  // --------------------------------------------------
  // Keybinding
  game.keybindings.register(moduleName, "mm01", {
    name: 'Macro Manager 01',
    hint: 'This will trigger the Macro Manager 01.',
    editable: [{ key: "Digit1", modifiers: [KeyboardManager.MODIFIER_KEYS.ALT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 1 );      
    },
    onUp: () => {},
    restricted: false,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(moduleName, "mm02", {
    name: 'Macro Manager 02',
    hint: 'This will trigger the Macro Manager 02.',
    editable: [{ key: "Digit2", modifiers: [KeyboardManager.MODIFIER_KEYS.ALT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 2 );      
    },
    onUp: () => {},
    restricted: false,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

  game.keybindings.register(moduleName, "mm03", {
    name: 'Macro Manager 03',
    hint: 'This will trigger the Macro Manager 03.',
    editable: [{ key: "Digit3", modifiers: [KeyboardManager.MODIFIER_KEYS.ALT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 3 );      
    },
    onUp: () => {},
    restricted: false,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
}); // END HOOKS

