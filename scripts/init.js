import { MacroManagerAPI } from './api.js';

const MODULE_ID = 'macro-manager';

// Hook para modificar a UI de Configurações (Transformar inputs em TextAreas)
Hooks.on("renderSettingsConfig", (app, [html]) => {
  // Loop para tratar os 9 slots
  for (let i = 1; i <= 9; i++) {
    const num = i.toString().padStart(2, '0');
    const settingKey = `${MODULE_ID}.${num}macros`;
    
    // Tenta encontrar o input padrão gerado pelo Foundry
    const input = html.querySelector(`[name="${settingKey}"]`);
    
    if (input) {
      const textarea = document.createElement("textarea");
      textarea.name = settingKey;
      textarea.textContent = game.settings.get(MODULE_ID, `${num}macros`);
      textarea.style.minHeight = "100px"; // Melhor usabilidade
      input.replaceWith(textarea);
    }
  }
});

Hooks.once('init', () => {
  // Expor API globalmente
  game.modules.get(MODULE_ID).api = { mm: MacroManagerAPI };

  // Registrar configurações em Loop (DRY - Don't Repeat Yourself)
  for (let i = 1; i <= 9; i++) {
    const num = i.toString().padStart(2, '0');

    // 1. Source List (Compendiums)
    game.settings.register(MODULE_ID, `${num}sourcelist`, {
      name: game.i18n.format(`${MODULE_ID}.settings.sourcelist.name`, { number: num }),
      hint: game.i18n.localize(`${MODULE_ID}.settings.sourcelist.hint`),
      scope: 'world',
      config: true,
      default: '',
      type: String,
      requiresReload: true
    });

    // 2. Title
    game.settings.register(MODULE_ID, `${num}title`, {
      name: game.i18n.format(`${MODULE_ID}.settings.title.name`, { number: num }),
      hint: game.i18n.localize(`${MODULE_ID}.settings.title.hint`),
      scope: 'world',
      config: true,
      default: `Macro Manager ${num}`,
      type: String,
      requiresReload: true
    });

    // 3. Macros (Content)
    game.settings.register(MODULE_ID, `${num}macros`, {
      name: game.i18n.format(`${MODULE_ID}.settings.macros.name`, { number: num }),
      hint: game.i18n.localize(`${MODULE_ID}.settings.macros.hint`),
      scope: 'world',
      config: true,
      default: '',
      type: String
    });

    // 4. Persistent
    game.settings.register(MODULE_ID, `${num}persistent`, {
      name: game.i18n.format(`${MODULE_ID}.settings.persistent.name`, { number: num }),
      hint: game.i18n.localize(`${MODULE_ID}.settings.persistent.hint`),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean
    });

    // 5. Player Permission
    game.settings.register(MODULE_ID, `${num}player`, {
      name: game.i18n.format(`${MODULE_ID}.settings.player.name`, { number: num }),
      hint: game.i18n.localize(`${MODULE_ID}.settings.player.hint`),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
      requiresReload: true
    });

    // Keybindings (Registrar no init é a prática V13 correta)
    game.keybindings.register(MODULE_ID, `mm${num}`, {
      name: `Macro Manager ${num}`, // Nome direto para evitar problemas de tradução dinâmica no init
      hint: `Open Macro Manager ${num}`,
      editable: [{ key: `Digit${i}`, modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT] }],
      onDown: () => {
        MacroManagerAPI.openMacroManager(i);
      },
      restricted: !game.settings.get(MODULE_ID, `${num}player`),
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }

  // Keybinding Especial (Tools/Summary) - Shift + 0
  game.keybindings.register(MODULE_ID, "mm00", {
    name: game.i18n.localize(`${MODULE_ID}.keybindings.summaryname`),
    hint: game.i18n.localize(`${MODULE_ID}.keybindings.summaryhint`),
    editable: [{ key: "Digit0", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT] }],
    onDown: () => {
      MacroManagerAPI.tools();
    },
    restricted: true,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });

  // --- General Settings ---

  game.settings.register(MODULE_ID, 'fontsize', {
    name: game.i18n.localize(`${MODULE_ID}.settings.fontsize.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.fontsize.hint`),
    scope: 'client',
    config: true,
    default: 14,
    type: Number,
    range: { min: 10, max: 30, step: 1 }
  });

  game.settings.register(MODULE_ID, 'dialogwidth', {
    name: game.i18n.localize(`${MODULE_ID}.settings.dialogwidth.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.dialogwidth.hint`),
    scope: 'client',
    config: true,
    default: 400,
    type: Number,
    range: { min: 200, max: 800, step: 10 }
  });

  game.settings.register(MODULE_ID, 'sortmacros', {
    name: game.i18n.localize(`${MODULE_ID}.settings.sortmacros.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.sortmacros.hint`),
    scope: 'client',
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register(MODULE_ID, 'theme', {
    name: game.i18n.localize(`${MODULE_ID}.settings.theme.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.theme.hint`),
    scope: "client",
    config: true,
    type: String,
    choices: {
      'button_standard': game.i18n.localize(`${MODULE_ID}.settings.theme.standard`),
      'button_cyberpunk': game.i18n.localize(`${MODULE_ID}.settings.theme.cyberpunk`),
      'button_rainbow': game.i18n.localize(`${MODULE_ID}.settings.theme.rainbow`)
    },
    default: "button_standard",
    requiresReload: true
  });

  game.settings.register(MODULE_ID, 'dialogtransparency', {
    name: game.i18n.localize(`${MODULE_ID}.settings.dialogtransparency.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.dialogtransparency.hint`),
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
    requiresReload: true
  });

  game.settings.register(MODULE_ID, 'headercolor', {
    name: game.i18n.localize(`${MODULE_ID}.settings.headercolor.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.headercolor.hint`),
    scope: "client",
    config: true,
    type: String,
    default: "#000000",
    requiresReload: true
  });

  game.settings.register(MODULE_ID, 'backgroundheadercolor', {
    name: game.i18n.localize(`${MODULE_ID}.settings.backgroundheadercolor.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.backgroundheadercolor.hint`),
    scope: "client",
    config: true,
    type: String,
    default: "#ffffff",
    requiresReload: true
  });
});