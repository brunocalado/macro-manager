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

  const setting6 = "macro-manager.06macros";
  const input6 = html.querySelector(`[name='${setting6}']`);
  const textarea6 = document.createElement("textarea");
  textarea6.name = setting6;
  input6?.replaceWith(textarea6);  
  textarea6.textContent = game.settings.get("macro-manager", "06macros"); // load the saved data into the field  

  const setting7 = "macro-manager.07macros";
  const input7 = html.querySelector(`[name='${setting7}']`);
  const textarea7 = document.createElement("textarea");
  textarea7.name = setting7;
  input7?.replaceWith(textarea7);  
  textarea7.textContent = game.settings.get("macro-manager", "07macros"); // load the saved data into the field  

  const setting8 = "macro-manager.08macros";
  const input8 = html.querySelector(`[name='${setting8}']`);
  const textarea8 = document.createElement("textarea");
  textarea8.name = setting8;
  input8?.replaceWith(textarea8);  
  textarea8.textContent = game.settings.get("macro-manager", "08macros"); // load the saved data into the field  

  const setting9 = "macro-manager.09macros";
  const input9 = html.querySelector(`[name='${setting9}']`);
  const textarea9 = document.createElement("textarea");
  textarea9.name = setting9;
  input9?.replaceWith(textarea9);  
  textarea9.textContent = game.settings.get("macro-manager", "09macros"); // load the saved data into the field    
});

Hooks.once('init', function() {
  // --------------------------------------------------
  // Load API
  game.modules.get(moduleName).api = { mm }; // Request with: const mm = game.modules.get('macro-manager')?.api.mm;

  // --------------------------------------------------
  // Module Options
  let currentNumber;
    
  // 1 --------------------------------------------------------------
  // call this with: game.settings.get("macro-manager", "01title")
  currentNumber = '01';
  game.settings.register(moduleName, currentNumber + 'title', {
    name: 'Title for Macro Manager ' + currentNumber,
    hint: 'This is the title of the macro dialog',
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String
  });

  // call this with: game.settings.get("macro-manager", "01macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: 'Macro List for Macro Manager ' + currentNumber,
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "01persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: 'Persistent Macro Manager ' + currentNumber,
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });
  
  // 2 --------------------------------------------------------------
  // call this with: game.settings.get("macro-manager", "02title")
  currentNumber = '02';
  game.settings.register(moduleName, currentNumber + 'title', {
    name: 'Title for Macro Manager ' + currentNumber,
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "02macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: 'Macros for Macro Manager ' + currentNumber,
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "02persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: 'Persistent Macro Manager ' + currentNumber,
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });
  
  // 3 --------------------------------------------------------------
  // call this with: game.settings.get("macro-manager", "03title")
  currentNumber = '03';
  game.settings.register(moduleName, currentNumber + 'title', {
    name: 'Title for Macro Manager ' + currentNumber,
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "03macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: 'Macros for Macro Manager ' + currentNumber,
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "03persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: 'Persistent Macro Manager ' + currentNumber,
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });
  
  // 4 --------------------------------------------------------------
  // call this with: game.settings.get("macro-manager", "04title")
  currentNumber = '04';
  game.settings.register(moduleName, currentNumber + 'title', {
    name: 'Title for Macro Manager ' + currentNumber,
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "04macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: 'Macros for Macro Manager ' + currentNumber,
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "04persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: 'Persistent Macro Manager ' + currentNumber,
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // 5 --------------------------------------------------------------
  // call this with: game.settings.get("macro-manager", "05title")
  currentNumber = '05';
  game.settings.register(moduleName, currentNumber + 'title', {
    name: 'Title for Macro Manager ' + currentNumber,
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "05macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: 'Macros for Macro Manager ' + currentNumber,
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "05persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: 'Persistent Macro Manager ' + currentNumber,
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });
  
  // 6 --------------------------------------------------------------
  // call this with: game.settings.get("macro-manager", "06title")
  currentNumber = '06';
  game.settings.register(moduleName, currentNumber + 'title', {
    name: 'Title for Macro Manager ' + currentNumber,
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "06macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: 'Macros for Macro Manager ' + currentNumber,
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "06persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: 'Persistent Macro Manager ' + currentNumber,
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // 7 --------------------------------------------------------------
  // call this with: game.settings.get("macro-manager", "07title")
  currentNumber = '07'; 
  game.settings.register(moduleName, currentNumber + 'title', {
    name: 'Title for Macro Manager ' + currentNumber,
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "07macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: 'Macros for Macro Manager ' + currentNumber,
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "07persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: 'Persistent Macro Manager ' + currentNumber,
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // 8 --------------------------------------------------------------
  // call this with: game.settings.get("macro-manager", "08title")
  currentNumber = '08'; 
  game.settings.register(moduleName, currentNumber + 'title', {
    name: 'Title for Macro Manager ' + currentNumber,
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "08macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: 'Macros for Macro Manager ' + currentNumber,
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "08persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: 'Persistent Macro Manager ' + currentNumber,
    hint: 'Check this to keep the Macro Dialog in the screen after click in one macro.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // 9 --------------------------------------------------------------
  // call this with: game.settings.get("macro-manager", "09title")
  currentNumber = '09'; 
  game.settings.register(moduleName, currentNumber + 'title', {
    name: 'Title for Macro Manager ' + currentNumber,
    hint: 'This is the title of the macro dialog.',
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String
  });
  
  // call this with: game.settings.get("macro-manager", "09macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: 'Macros for Macro Manager ' + currentNumber,
    hint: 'Add the names of the macros you want to show on this dialog. You must add ; after each macro name. You must put exactly the macro name. The macro must be in the world.',
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "09persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: 'Persistent Macro Manager ' + currentNumber,
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
    restricted: true,  // Restrict this Keybinding to gamemaster only?
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
    restricted: true,  // Restrict this Keybinding to gamemaster only?
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
    restricted: true,  // Restrict this Keybinding to gamemaster only?
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
    restricted: true,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  //currentNumber
  game.keybindings.register(moduleName, "mm05", {
    name: 'Macro Manager 05',
    hint: 'This will trigger the Macro Manager 05.',
    editable: [{ key: "Digit5", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 5 );      
    },
    onUp: () => {},
    restricted: true,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

  currentNumber = 6;
  game.keybindings.register(moduleName, "mm0" + currentNumber, {
    name: 'Macro Manager 0' + currentNumber,
    hint: 'This will trigger the Macro Manager 0' + currentNumber,
    editable: [{ key: "Digit6", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 6 );      
    },
    onUp: () => {},
    restricted: true,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });  

  currentNumber = 7;
  game.keybindings.register(moduleName, "mm0" + currentNumber, {
    name: 'Macro Manager 0' + currentNumber,
    hint: 'This will trigger the Macro Manager 0' + currentNumber,
    editable: [{ key: "Digit7", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 7 );      
    },
    onUp: () => {},
    restricted: true,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });  

  currentNumber = 8;
  game.keybindings.register(moduleName, "mm0" + currentNumber, {
    name: 'Macro Manager 0' + currentNumber,
    hint: 'This will trigger the Macro Manager 0' + currentNumber,
    editable: [{ key: "Digit8", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 8 );      
    },
    onUp: () => {},
    restricted: true,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });    

  currentNumber = 9;
  game.keybindings.register(moduleName, "mm0" + currentNumber, {
    name: 'Macro Manager 0' + currentNumber,
    hint: 'This will trigger the Macro Manager 0' + currentNumber,
    editable: [{ key: "Digit9", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 9 );      
    },
    onUp: () => {},
    restricted: true,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });  

  game.keybindings.register(moduleName, "mm00", {
    name: 'Summary',
    hint: 'This will trigger the Summary',
    editable: [{ key: "Digit0", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.showSummary();      
    },
    onUp: () => {},
    restricted: true,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });  
  
}); // END HOOKS

