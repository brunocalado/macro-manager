import { MacroManagerAPI } from './api.js';

const MODULE_ID = 'macro-manager';

Hooks.once('init', () => {
  // 1. Expose API in the module structure
  game.modules.get(MODULE_ID).api = { 
    mm: MacroManagerAPI,
    MacroManager: MacroManagerAPI
  };

  // 2. Expose Globally
  // Allows access via: MacroManager.Open(data)
  globalThis.MacroManager = MacroManagerAPI;
  
  console.log(`${MODULE_ID} | Initialized (API Only Mode)`);
});