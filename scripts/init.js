const moduleName = 'macro-manager';
import { mm } from './api.js'

Hooks.on("renderSettingsConfig", (app, [html]) => {
  const setting = "macro-manager.01macros";
  const input = html.querySelector(`[name='${setting}']`);
  const textarea = document.createElement("textarea");
  textarea.name = setting;
  input?.replaceWith(textarea);
  textarea.textContent = game.settings.get("macro-manager", "01macros"); // load the saved data into the field
  
  const setting2 = "macro-manager.02macros";
  const input2 = html.querySelector(`[name='${setting2}']`);
  const textarea2 = document.createElement("textarea");
  textarea2.name = setting2;
  input2?.replaceWith(textarea2);
  textarea2.textContent = game.settings.get("macro-manager", "02macros"); // load the saved data into the field

  const setting3 = "macro-manager.03macros";
  const input3 = html.querySelector(`[name='${setting3}']`);
  const textarea3 = document.createElement("textarea");
  textarea3.name = setting3;
  input3?.replaceWith(textarea3);  
  textarea3.textContent = game.settings.get("macro-manager", "03macros"); // load the saved data into the field

  const setting4 = "macro-manager.04macros";
  const input4 = html.querySelector(`[name='${setting4}']`);
  const textarea4 = document.createElement("textarea");
  textarea4.name = setting4;
  input4?.replaceWith(textarea4);  
  textarea4.textContent = game.settings.get("macro-manager", "04macros"); // load the saved data into the field

  const setting5 = "macro-manager.05macros";
  const input5 = html.querySelector(`[name='${setting5}']`);
  const textarea5 = document.createElement("textarea");
  textarea5.name = setting5;
  input5?.replaceWith(textarea5);  
  textarea5.textContent = game.settings.get("macro-manager", "05macros"); // load the saved data into the field  
});

Hooks.once('init', function() {
  // --------------------------------------------------
  // Load API
  game.modules.get(moduleName).api = { mm }; // Request with: const mm = game.modules.get('macro-manager')?.api.mm;

  // --------------------------------------------------
  // Module Options
  // 1 --------------------------------------------------------------
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
  
  // 2 --------------------------------------------------------------
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
  
  // 3 --------------------------------------------------------------
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
  
  // 4 --------------------------------------------------------------
  // call this with: game.settings.get("macro-manager", "04title")
  game.settings.register(moduleName, '04title', {
    name: 'Title for Macro Manager 04',
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager 04',
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "04macros")
  game.settings.register(moduleName, '04macros', {
    name: 'Macros for Macro Manager 04',
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "04persistent")
  game.settings.register(moduleName, '04persistent', {
    name: 'Persistent Macro Manager 04',
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // 5 --------------------------------------------------------------
  // call this with: game.settings.get("macro-manager", "05title")
  game.settings.register(moduleName, '05title', {
    name: 'Title for Macro Manager 05',
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager 05',
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "05macros")
  game.settings.register(moduleName, '05macros', {
    name: 'Macros for Macro Manager 05',
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "05persistent")
  game.settings.register(moduleName, '05persistent', {
    name: 'Persistent Macro Manager 05',
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });
  
  // COMMON OPTIONS ------------------------------------
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
    editable: [{ key: "Digit1", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
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
    editable: [{ key: "Digit2", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
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
    editable: [{ key: "Digit3", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 3 );      
    },
    onUp: () => {},
    restricted: false,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

  game.keybindings.register(moduleName, "mm04", {
    name: 'Macro Manager 04',
    hint: 'This will trigger the Macro Manager 04.',
    editable: [{ key: "Digit4", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 4 );      
    },
    onUp: () => {},
    restricted: false,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

  game.keybindings.register(moduleName, "mm05", {
    name: 'Macro Manager 05',
    hint: 'This will trigger the Macro Manager 05.',
    editable: [{ key: "Digit5", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 5 );      
    },
    onUp: () => {},
    restricted: false,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
}); // END HOOKS

