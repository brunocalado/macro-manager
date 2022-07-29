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

Hooks.once('i18nInit', () => {
  // --------------------------------------------------
  // Load API
  game.modules.get(moduleName).api = { mm }; // Request with: const mm = game.modules.get('macro-manager')?.api.mm;

  // --------------------------------------------------
  // SETTINGS
  const debouncedReload = debounce(() => location.reload(), 1000); // RELOAD AFTER CHANGE
  let currentNumber;

  // 1 --------------------------------------------------------------
  currentNumber = '01';

  // call this with: game.settings.get("macro-manager", "01sourcelist")
  game.settings.register(moduleName, `${currentNumber}sourcelist`, {
    name: game.i18n.format(`${moduleName}.settings.sourcelist.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.sourcelist.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: debouncedReload
  });
  
  // call this with: game.settings.get("macro-manager", "01title")
  game.settings.register(moduleName, `${currentNumber}title`, {
    name: game.i18n.format(`${moduleName}.settings.title.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.title.hint`, { number: currentNumber }),
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String,
    onChange: debouncedReload
  });

  // call this with: game.settings.get("macro-manager", "01macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: game.i18n.format(`${moduleName}.settings.macros.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.macros.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "01persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: game.i18n.format(`${moduleName}.settings.persistent.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.persistent.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // call this with: game.settings.get("macro-manager", "01player")
  game.settings.register(moduleName, currentNumber + 'player', {
    name: game.i18n.format(`${moduleName}.settings.player.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.player.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: debouncedReload
  });
  
  // 2 --------------------------------------------------------------
  currentNumber = '02';
  
  // call this with: game.settings.get("macro-manager", "02sourcelist")
  game.settings.register(moduleName, `${currentNumber}sourcelist`, {
    name: game.i18n.format(`${moduleName}.settings.sourcelist.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.sourcelist.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: debouncedReload
  });
  
  // call this with: game.settings.get("macro-manager", "02title")
  game.settings.register(moduleName, currentNumber + 'title', {
    name: game.i18n.format(`${moduleName}.settings.title.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.title.hint`, { number: currentNumber }),
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String,
    onChange: debouncedReload
  });
  
  // call this with: game.settings.get("macro-manager", "02macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: game.i18n.format(`${moduleName}.settings.macros.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.macros.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "02persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: game.i18n.format(`${moduleName}.settings.persistent.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.persistent.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });
  
  // call this with: game.settings.get("macro-manager", "02player")
  game.settings.register(moduleName, currentNumber + 'player', {
    name: game.i18n.format(`${moduleName}.settings.player.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.player.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: debouncedReload
  });
  
  // 3 --------------------------------------------------------------  
  currentNumber = '03';
  
  // call this with: game.settings.get("macro-manager", "03sourcelist")
  game.settings.register(moduleName, `${currentNumber}sourcelist`, {
    name: game.i18n.format(`${moduleName}.settings.sourcelist.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.sourcelist.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: debouncedReload
  });  
  
  // call this with: game.settings.get("macro-manager", "03title")
  game.settings.register(moduleName, currentNumber + 'title', {
    name: game.i18n.format(`${moduleName}.settings.title.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.title.hint`, { number: currentNumber }),
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String,
    onChange: debouncedReload
  });
  
  // call this with: game.settings.get("macro-manager", "03macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: game.i18n.format(`${moduleName}.settings.macros.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.macros.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "03persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: game.i18n.format(`${moduleName}.settings.persistent.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.persistent.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // call this with: game.settings.get("macro-manager", "03player")
  game.settings.register(moduleName, currentNumber + 'player', {
    name: game.i18n.format(`${moduleName}.settings.player.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.player.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: debouncedReload
  });
  
  // 4 --------------------------------------------------------------
  currentNumber = '04';

  // call this with: game.settings.get("macro-manager", "04sourcelist")
  game.settings.register(moduleName, `${currentNumber}sourcelist`, {
    name: game.i18n.format(`${moduleName}.settings.sourcelist.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.sourcelist.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: debouncedReload
  }); 
  
  // call this with: game.settings.get("macro-manager", "04title")
  game.settings.register(moduleName, currentNumber + 'title', {
    name: game.i18n.format(`${moduleName}.settings.title.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.title.hint`, { number: currentNumber }),
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String,
    onChange: debouncedReload
  });
  
  // call this with: game.settings.get("macro-manager", "04macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: game.i18n.format(`${moduleName}.settings.macros.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.macros.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "04persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: game.i18n.format(`${moduleName}.settings.persistent.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.persistent.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // call this with: game.settings.get("macro-manager", "04player")
  game.settings.register(moduleName, currentNumber + 'player', {
    name: game.i18n.format(`${moduleName}.settings.player.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.player.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: debouncedReload
  });

  // 5 --------------------------------------------------------------
  currentNumber = '05';
  
  // call this with: game.settings.get("macro-manager", "05sourcelist")
  game.settings.register(moduleName, `${currentNumber}sourcelist`, {
    name: game.i18n.format(`${moduleName}.settings.sourcelist.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.sourcelist.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: debouncedReload
  }); 
  
  // call this with: game.settings.get("macro-manager", "05title")  
  game.settings.register(moduleName, currentNumber + 'title', {
    name: game.i18n.format(`${moduleName}.settings.title.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.title.hint`, { number: currentNumber }),
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String,
    onChange: debouncedReload
  });
  
  // call this with: game.settings.get("macro-manager", "05macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: game.i18n.format(`${moduleName}.settings.macros.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.macros.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "05persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: game.i18n.format(`${moduleName}.settings.persistent.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.persistent.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // call this with: game.settings.get("macro-manager", "05player")
  game.settings.register(moduleName, currentNumber + 'player', {
    name: game.i18n.format(`${moduleName}.settings.player.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.player.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: debouncedReload
  });
  
  // 6 --------------------------------------------------------------
  currentNumber = '06';
  
  // call this with: game.settings.get("macro-manager", "06sourcelist")
  game.settings.register(moduleName, `${currentNumber}sourcelist`, {
    name: game.i18n.format(`${moduleName}.settings.sourcelist.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.sourcelist.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: debouncedReload
  }); 
  
  // call this with: game.settings.get("macro-manager", "06title")
  game.settings.register(moduleName, currentNumber + 'title', {
    name: game.i18n.format(`${moduleName}.settings.title.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.title.hint`, { number: currentNumber }),
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String,
    onChange: debouncedReload
  });
  
  // call this with: game.settings.get("macro-manager", "06macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: game.i18n.format(`${moduleName}.settings.macros.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.macros.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "06persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: game.i18n.format(`${moduleName}.settings.persistent.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.persistent.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // call this with: game.settings.get("macro-manager", "06player")
  game.settings.register(moduleName, currentNumber + 'player', {
    name: game.i18n.format(`${moduleName}.settings.player.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.player.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: debouncedReload
  });

  // 7 --------------------------------------------------------------
  currentNumber = '07'; 

  // call this with: game.settings.get("macro-manager", "07sourcelist")
  game.settings.register(moduleName, `${currentNumber}sourcelist`, {
    name: game.i18n.format(`${moduleName}.settings.sourcelist.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.sourcelist.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: debouncedReload
  }); 
  
  // call this with: game.settings.get("macro-manager", "07title")
  game.settings.register(moduleName, currentNumber + 'title', {
    name: game.i18n.format(`${moduleName}.settings.title.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.title.hint`, { number: currentNumber }),
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String,
    onChange: debouncedReload
  });
  
  // call this with: game.settings.get("macro-manager", "07macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: game.i18n.format(`${moduleName}.settings.macros.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.macros.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "07persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: game.i18n.format(`${moduleName}.settings.persistent.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.persistent.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // call this with: game.settings.get("macro-manager", "07player")
  game.settings.register(moduleName, currentNumber + 'player', {
    name: game.i18n.format(`${moduleName}.settings.player.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.player.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: debouncedReload
  });

  // 8 --------------------------------------------------------------
  currentNumber = '08';

  // call this with: game.settings.get("macro-manager", "08sourcelist")
  game.settings.register(moduleName, `${currentNumber}sourcelist`, {
    name: game.i18n.format(`${moduleName}.settings.sourcelist.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.sourcelist.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: debouncedReload
  });   
  
  // call this with: game.settings.get("macro-manager", "08title")
  game.settings.register(moduleName, currentNumber + 'title', {
    name: game.i18n.format(`${moduleName}.settings.title.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.title.hint`, { number: currentNumber }),
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String,
    onChange: debouncedReload
  });
  
  // call this with: game.settings.get("macro-manager", "08macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: game.i18n.format(`${moduleName}.settings.macros.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.macros.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "08persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: game.i18n.format(`${moduleName}.settings.persistent.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.persistent.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // call this with: game.settings.get("macro-manager", "08player")
  game.settings.register(moduleName, currentNumber + 'player', {
    name: 'Player Keybind ' + currentNumber,
    hint: 'This will let your players trigger this shortcut.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: debouncedReload
  });

  // 9 --------------------------------------------------------------
  currentNumber = '09'; 
  
  // call this with: game.settings.get("macro-manager", "08sourcelist")
  game.settings.register(moduleName, `${currentNumber}sourcelist`, {
    name: game.i18n.format(`${moduleName}.settings.sourcelist.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.sourcelist.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String,
    onChange: debouncedReload
  });   
  
  // call this with: game.settings.get("macro-manager", "09title")  
  game.settings.register(moduleName, currentNumber + 'title', {
    name: game.i18n.format(`${moduleName}.settings.title.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.title.hint`, { number: currentNumber }),
    scope: 'world',
    config: true,
    default: 'Macro Manager ' + currentNumber,
    type: String,
    onChange: debouncedReload
  });
  
  // call this with: game.settings.get("macro-manager", "09macros")
  game.settings.register(moduleName, currentNumber + 'macros', {
    name: game.i18n.format(`${moduleName}.settings.macros.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.macros.hint`, {}),
    scope: 'world',
    config: true,
    default: '',
    type: String
  });

  // call this with: game.settings.get("macro-manager", "09persistent")
  game.settings.register(moduleName, currentNumber + 'persistent', {
    name: game.i18n.format(`${moduleName}.settings.persistent.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.persistent.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  // call this with: game.settings.get("macro-manager", "09player")
  game.settings.register(moduleName, currentNumber + 'player', {
    name: game.i18n.format(`${moduleName}.settings.player.name`, { number: currentNumber }),
    hint: game.i18n.format(`${moduleName}.settings.player.hint`, {}),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: debouncedReload
  });
  
  // COMMON OPTIONS ------------------------------------
  // call this with: game.settings.get("macro-manager", "fontsize")
  game.settings.register(moduleName, 'fontsize', {
    name: game.i18n.format(`${moduleName}.settings.fontsize.name`, {}),
    hint: game.i18n.format(`${moduleName}.settings.fontsize.hint`, {}),
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

  // call this with: game.settings.get("macro-manager", "sortmacros")
  game.settings.register(moduleName, 'sortmacros', {
    name: game.i18n.format(`${moduleName}.settings.sortmacros.name`, {}),
    hint: game.i18n.format(`${moduleName}.settings.sortmacros.hint`, {}),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean
  }); 
  
  // --------------------------------------------------
  // Keybinding
  game.keybindings.register(moduleName, "mm01", {
    name: game.i18n.format(`${moduleName}.keybindings.name`, {message: game.settings.get("macro-manager", "01title")}),
    hint: game.i18n.format(`${moduleName}.keybindings.hint`, {message: game.settings.get("macro-manager", "01title")}),
    editable: [{ key: "Digit1", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.openMacroManager( 1 );      
    },
    onUp: () => {},
    restricted: !game.settings.get("macro-manager", "01player"),  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(moduleName, "mm02", {
    name: game.i18n.format(`${moduleName}.keybindings.name`, {message: game.settings.get("macro-manager", "02title")}),
    hint: game.i18n.format(`${moduleName}.keybindings.hint`, {message: game.settings.get("macro-manager", "02title")}),
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
    name: game.i18n.format(`${moduleName}.keybindings.name`, {message: game.settings.get("macro-manager", "03title")}),
    hint: game.i18n.format(`${moduleName}.keybindings.hint`, {message: game.settings.get("macro-manager", "03title")}),
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
    name: game.i18n.format(`${moduleName}.keybindings.name`, {message: game.settings.get("macro-manager", "04title")}),
    hint: game.i18n.format(`${moduleName}.keybindings.hint`, {message: game.settings.get("macro-manager", "04title")}),
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

  game.keybindings.register(moduleName, "mm05", {
    name: game.i18n.format(`${moduleName}.keybindings.name`, {message: game.settings.get("macro-manager", "05title")}),
    hint: game.i18n.format(`${moduleName}.keybindings.hint`, {message: game.settings.get("macro-manager", "05title")}),
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

  game.keybindings.register(moduleName, "mm06", {
    name: game.i18n.format(`${moduleName}.keybindings.name`, {message: game.settings.get("macro-manager", "06title")}),
    hint: game.i18n.format(`${moduleName}.keybindings.hint`, {message: game.settings.get("macro-manager", "06title")}),
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

  game.keybindings.register(moduleName, "mm07", {
    name: game.i18n.format(`${moduleName}.keybindings.name`, {message: game.settings.get("macro-manager", "07title")}),
    hint: game.i18n.format(`${moduleName}.keybindings.hint`, {message: game.settings.get("macro-manager", "07title")}),
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

  game.keybindings.register(moduleName, "mm08", {
    name: game.i18n.format(`${moduleName}.keybindings.name`, {message: game.settings.get("macro-manager", "08title")}),
    hint: game.i18n.format(`${moduleName}.keybindings.hint`, {message: game.settings.get("macro-manager", "08title")}),
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

  game.keybindings.register(moduleName, "mm09", {
    name: game.i18n.format(`${moduleName}.keybindings.name`, {message: game.settings.get("macro-manager", "09title")}),
    hint: game.i18n.format(`${moduleName}.keybindings.hint`, {message: game.settings.get("macro-manager", "09title")}),
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
    name: game.i18n.format(`${moduleName}.keybindings.summaryname`, {}),
    hint: game.i18n.format(`${moduleName}.keybindings.summaryhint`, {}),
    editable: [{ key: "Digit0", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT]}],
    onDown: () => {
      const mm = game.modules.get(moduleName)?.api.mm;
      mm.tools();      
    },
    onUp: () => {},
    restricted: true,  // Restrict this Keybinding to gamemaster only?
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });  
  
}); // END HOOKS

