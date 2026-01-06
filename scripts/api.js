const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Application to Build a Custom Macro Manager
 */
class MacroBuilderApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.selectedPackIds = new Set();
    this.targetMode = 'world'; // Default state
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    id: "macro-builder",
    classes: ["macro-manager-window"], 
    window: { title: "Macro Manager Builder", resizable: true },
    position: { width: 750, height: 550 },
    form: { handler: MacroBuilderApp.myFormHandler, submitOnChange: false, closeOnSubmit: true }
  };

  static PARTS = {
    form: { template: "modules/macro-manager/templates/builder.hbs" }
  };

  async _prepareContext(options) {
    const sources = [];
    let macros = [];
    
    // Logic: Mode Handling
    if (this.targetMode === 'world') {
        // WORLD MODE: Auto-load all world macros
        macros = game.macros.map(m => ({
            uuid: m.uuid, // Standard UUID (Macro.ID)
            id: m.id,     // Fallback ID
            name: m.name,
            img: m.img,
            packLabel: "World"
        }));

    } else {
        // COMPENDIUM MODE: Show packs on left, macros on right based on selection
        const packs = game.packs.filter(p => p.metadata.type === 'Macro').map(p => ({
            id: p.metadata.id,
            label: p.metadata.label,
            type: "pack",
            checked: this.selectedPackIds.has(p.metadata.id)
        }));
        sources.push(...packs);

        // Fetch macros from SELECTED compendiums
        for (const source of sources) {
            if (source.checked) {
                const pack = game.packs.get(source.id);
                if (pack) {
                    const docs = await pack.getDocuments();
                    macros.push(...docs.map(d => ({
                        uuid: d.uuid,
                        name: d.name,
                        img: d.img,
                        packLabel: pack.metadata.label
                    })));
                }
            }
        }
    }

    // Sort macros by name
    macros.sort((a, b) => a.name.localeCompare(b.name));

    return { 
        packs: sources, 
        macros,
        isWorldMode: this.targetMode === 'world',
        isCompendiumMode: this.targetMode === 'compendium'
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);

    // Toggle Packs Checkbox (Only relevant in Compendium Mode)
    const packCheckboxes = this.element.querySelectorAll('input[data-action="togglePack"]');
    packCheckboxes.forEach(cb => {
        cb.addEventListener('change', (ev) => {
            if (ev.target.checked) {
                this.selectedPackIds.add(ev.target.value);
            } else {
                this.selectedPackIds.delete(ev.target.value);
            }
            this.render(); 
        });
    });

    // Toggle Target Mode (Radio Buttons)
    const modeRadios = this.element.querySelectorAll('input[data-action="switchMode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', (ev) => {
            if (ev.target.checked) {
                this.targetMode = ev.target.value;
                this.selectedPackIds.clear(); // Reset selections when switching
                this.render();
            }
        });
    });

    // Select All/None
    const btnAll = this.element.querySelector('[data-action="selectAll"]');
    const btnNone = this.element.querySelector('[data-action="deselectAll"]');
    const macroCheckboxes = this.element.querySelectorAll('input[name="macroData"]');

    if (btnAll) btnAll.addEventListener('click', () => macroCheckboxes.forEach(c => c.checked = true));
    if (btnNone) btnNone.addEventListener('click', () => macroCheckboxes.forEach(c => c.checked = false));
  }

  static async myFormHandler(event, form, formData) {
    // Get all checked checkboxes with name="macroData"
    let selectedUuids = formData.object.macroData;
    
    // Ensure it's an array
    if (!selectedUuids) selectedUuids = [];
    if (!Array.isArray(selectedUuids)) selectedUuids = [selectedUuids];

    // FIX: Filter out null/undefined/non-string values to prevent "includes" error
    selectedUuids = selectedUuids.filter(u => typeof u === 'string' && u.length > 0);

    const macroName = formData.object.macroName || "Custom Manager";
    const targetMode = formData.object.targetMode; 

    if (selectedUuids.length === 0) {
        ui.notifications.warn("Please select at least one macro.");
        return;
    }

    // Resolve Names
    const selectedMacroNames = [];
    const involvedPackIds = new Set();

    for (const uuid of selectedUuids) {
        // Try resolving by UUID first (Works for Compendium & World if UUID is correct)
        let doc;
        try {
            doc = await fromUuid(uuid);
        } catch (e) {
            console.warn(`MacroManager | fromUuid failed for ${uuid}`, e);
        }

        // Fallback: If fromUuid failed (common with local macros sometimes), try getting from game.macros directly
        if (!doc && !uuid.includes('.')) {
             const id = uuid.split('.').pop();
             doc = game.macros.get(id);
        } else if (!doc && uuid.startsWith("Macro.")) {
             const id = uuid.split('.')[1];
             doc = game.macros.get(id);
        }

        if (doc) {
            selectedMacroNames.push(doc.name);
            if (doc.pack) {
                involvedPackIds.add(doc.pack);
            }
        } else {
            console.warn(`MacroManager Builder | Could not resolve UUID: ${uuid}`);
        }
    }

    if (selectedMacroNames.length === 0) {
         ui.notifications.error("Could not retrieve names. Check console for details.");
         return;
    }

    await MacroManagerAPI.createManagerMacroV2(macroName, selectedMacroNames, Array.from(involvedPackIds), targetMode);
    ui.notifications.info(`Macro "${macroName}" created successfully!`);
  }
}

/**
 * Auxiliary Apps (Compendium Selector & Copy Text)
 */
class CompendiumSelectorApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    id: "compendium-selector",
    window: { title: "Get All Macros Names" },
    position: { width: 400, height: "auto" },
    form: { handler: CompendiumSelectorApp.myFormHandler, submitOnChange: false, closeOnSubmit: true }
  };

  static PARTS = {
    form: { template: "modules/macro-manager/templates/compendium-selector.hbs" }
  };

  async _prepareContext(options) {
    const packs = game.packs.filter(p => p.metadata.type === 'Macro');
    return { 
      packs: packs.map(p => ({ id: p.metadata.id, label: p.metadata.label })) 
    };
  }

  static async myFormHandler(event, form, formData) {
    const packId = formData.object.packId;
    const pack = game.packs.get(packId);
    if (!pack) return;
    
    const docs = await pack.getDocuments();
    const names = docs.map(d => d.name).join('; ');
    
    new CopyTextApp({ text: names }).render(true);
  }
}

class CopyTextApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.textToCopy = options.text || "";
  }

  static DEFAULT_OPTIONS = {
    tag: "div",
    id: "copy-text-app",
    window: { title: "Macro List" },
    position: { width: 400, height: 300 }
  };

  static PARTS = {
    content: { template: "modules/macro-manager/templates/copy-text.hbs" }
  };

  async _prepareContext(options) {
    return { text: this.textToCopy };
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const btn = this.element.querySelector('[data-action="copy"]');
    if (btn) {
      btn.addEventListener('click', () => {
        game.clipboard.copyPlainText(this.textToCopy);
        ui.notifications.info("Copied to clipboard!");
      });
    }
  }
}

/**
 * Main Application V2
 */
class MacroManagerApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.macros = options.macros || [];
    this.macroListRaw = options.macroList || "";
    
    this.settings = {
        width: 400,
        fontSize: 16,
        sort: true,
        ...options.settings 
    };

    this.persistent = (options.persistent !== undefined) ? options.persistent : true;
    this.searchValue = "";
  }

  static DEFAULT_OPTIONS = {
    tag: "div",
    id: "macro-manager-app",
    classes: ["macro-manager-window"],
    window: { resizable: true, title: "Macro Manager", controls: [] },
    position: { width: 400, height: "auto" }
  };

  static PARTS = {
    form: { 
      template: "modules/macro-manager/templates/window.hbs", 
      scrollable: [".mm-buttons-list"] 
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    let macroLabels = MacroManagerAPI.stringListToArray(this.macroListRaw);
    if (this.settings.sort) macroLabels.sort();

    const buttons = [];

    for (const label of macroLabels) {
      const isHeader = label.includes("##");
      let macro = null;

      if (!isHeader) {
        if (this.macros.length > 0) {
          macro = this.macros.find(m => m.name === label);
        } else {
          macro = game.macros.getName(label);
        }
      }

      if (!macro && !isHeader) continue;

      const btnData = {
        label: isHeader ? label.replace(/##/g, '').trim() : label,
        isHeader: isHeader,
        icon: (!isHeader && macro) ? macro.img : null,
        headerColor: isHeader ? this.settings.headerColor : null,
        backgroundHeaderColor: isHeader ? this.settings.bgHeaderColor : null,
        hidden: this.searchValue && !label.toLowerCase().includes(this.searchValue.toLowerCase())
      };

      buttons.push(btnData);
    }

    context.buttons = buttons;
    context.searchValue = this.searchValue;
    return context;
  }

  _onRender(context, options) {
    super._onRender(context, options);

    // Search logic
    const searchInput = this.element.querySelector('.mm-search-input');
    if (searchInput) {
      if (this.searchValue) {
        searchInput.focus();
        searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
      } else {
        searchInput.focus();
      }

      searchInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase().trim();
        this.searchValue = query;
        const buttons = this.element.querySelectorAll('.mm-macro-btn');
        buttons.forEach(btn => {
          const label = btn.dataset.label;
          if (label) {
            const match = label.toLowerCase().includes(query);
            btn.style.display = match ? "" : "none";
          }
        });
      });
      searchInput.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') ev.preventDefault(); });
    }

    // Click Logic
    const buttons = this.element.querySelectorAll('.mm-macro-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', async (ev) => {
        const target = ev.currentTarget; 
        const label = target.dataset.label;
        const isHeader = target.classList.contains('mm-header');

        if (!isHeader) {
          let macro;
          if (this.macros.length > 0) {
            macro = this.macros.find(m => m.name === label);
          } else {
            macro = game.macros.getName(label);
          }

          if (macro) {
            await MacroManagerAPI.macroRun(macro);
          }

          if (!this.persistent) {
            this.close();
          }
        }
      });
    });
  }
}

/**
 * Main API
 */
export class MacroManagerAPI {

  static async Open(data) {
    if (data.compendiumList) {
      return this.openCompendiumMacroManager(data);
    } else {
      return this.openCustomMacroManager(data);
    }
  }

  // --- Builder Function ---
  static async BuildMacro() {
    new MacroBuilderApp().render(true);
  }

  // --- Creator Logic V2 ---
  static async createManagerMacroV2(name, macroNames, packIds, targetMode) {
    const folderName = "🤖 Manager Macros";
    let folder = game.folders.getName(folderName);
    
    if (!folder) {
        folder = await Folder.create({
            name: folderName,
            type: "Macro",
            color: "#07195f" // Updated Color
        });
    }

    // Format Lists
    const macroListStr = macroNames.join("; ");
    const compendiumListStr = packIds.join("; ");

    // Generate Script Content
    let scriptContent = `// Macro Manager: ${name}\n`;
    
    if (targetMode === 'compendium' && packIds.length > 0) {
        scriptContent += `MacroManager.Open({
    title: "${name}",
    compendiumList: "${compendiumListStr}",
    macroList: "${macroListStr}"
});`;
    } else {
        // World Mode (No compendiumList param)
        scriptContent += `MacroManager.Open({
    title: "${name}",
    macroList: "${macroListStr}"
});`;
    }

    await Macro.create({
        name: name,
        type: "script",
        img: "icons/sundries/books/book-red-exclamation.webp",
        command: scriptContent,
        folder: folder.id
    });
  }

  static async openCustomMacroManager(args) {
    const defaultSettings = { width: 400, fontSize: 16, sort: true };
    const settings = { ...defaultSettings, ...(args.settings || {}) };
    const classes = ["macro-manager-window"];

    new MacroManagerApp({
        classes: classes, 
        macros: args.macros || [], 
        macroList: args.macroList, 
        settings: settings,
        persistent: args.persistent, 
        window: { title: args.title || "Macro Manager" },
        position: { width: settings.width }
    }).render(true);
  }

  static async openCompendiumMacroManager(args) {
    const compendiumIds = this.stringListToArray(args.compendiumList);
    let allMacros = [];

    for (const packId of compendiumIds) {
      const pack = game.packs.get(packId);
      if (!pack) {
        ui.notifications.error(`Compendium not found with ID: ${packId}`);
        continue;
      }
      const docs = await pack.getDocuments();
      allMacros.push(...docs);
    }

    const data = { ...args, macros: allMacros };
    await this.openCustomMacroManager(data);
  }

  // --- Helpers ---
  static async getAllMacroLabelsFromCompendium() {
    new CompendiumSelectorApp().render(true);
  }

  static stringListToArray(stringList) {
    if (!stringList) return [];
    return stringList.split(';').map(s => s.trim()).filter(s => s.length > 0);
  }

  static async macroRun(macro) {
    if (!macro) return;
    try {
      await macro.execute();
    } catch (err) {
      ui.notifications.error(`Error running macro ${macro.name}: ${err.message}`);
      console.error(err);
    }
  }
}