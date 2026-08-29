/*!
 * Macro Manager
 * Copyright (c) 2022 https://github.com/brunocalado
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3.
 */

import { MacroManagerAPI } from './api.js';
import { MODULE_ID } from './constants.js';

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

// Inject "Build Macro" button into the Macro Directory sidebar (GM only).
Hooks.on('renderMacroDirectory', (app, html) => {
  if (!game.user.isGM) return;

  const element = (html instanceof HTMLElement) ? html : html[0];
  const actionButtons = element.querySelector('.header-actions');
  if (!actionButtons) return;

  // The directory re-renders on every macro CRUD and tab switch; bail if the button is already there.
  if (actionButtons.querySelector('.mm-build-btn')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.classList.add('mm-build-btn');
  btn.innerHTML = `<i class="fas fa-wand-magic-sparkles"></i> Build Macro Manager`;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    MacroManagerAPI.BuildMacro();
  });

  actionButtons.appendChild(btn);
});