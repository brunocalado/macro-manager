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
            uuid: m.uuid, 
            id: m.id,     
            name: m.name,
            img: m.img,
            packLabel: "World"
        }));

    } else {
        // COMPENDIUM MODE
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

    // Toggle Packs
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

    // Toggle Target Mode
    const modeRadios = this.element.querySelectorAll('input[data-action="switchMode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', (ev) => {
            if (ev.target.checked) {
                this.targetMode = ev.target.value;
                this.selectedPackIds.clear(); 
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
    let selectedUuids = formData.object.macroData;
    
    // Ensure it's an array
    if (!selectedUuids) selectedUuids = [];
    if (!Array.isArray(selectedUuids)) selectedUuids = [selectedUuids];

    // Filter valid strings
    selectedUuids = selectedUuids.filter(u => typeof u === 'string' && u.length > 0);

    const macroName = formData.object.macroName || "Custom Manager";

    if (selectedUuids.length === 0) {
        ui.notifications.warn("Please select at least one macro.");
        return;
    }

    // Create Macro with UUID list
    await MacroManagerAPI.createManagerMacroV2(macroName, selectedUuids);
    ui.notifications.info(`Macro "${macroName}" created successfully!`);
  }
}

/**
 * Auxiliary Apps
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
    // macroListRaw now contains UUIDs separated by ;
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
    
    const items = MacroManagerAPI.stringListToArray(this.macroListRaw);
    
    // Resolve Macros from UUIDs (Async)
    const promises = items.map(async (item) => {
        // Header Handling
        if (item.startsWith("##")) {
            return {
                label: item.replace(/##/g, '').trim(),
                isHeader: true,
                raw: item
            };
        }

        // UUID Handling
        try {
            let macro = await fromUuid(item);
            // Fallback for simple IDs or legacy formats
            if (!macro && !item.includes('.')) macro = game.macros.get(item);
            
            if (macro) {
                return {
                    label: macro.name,
                    isHeader: false,
                    icon: macro.img,
                    uuid: macro.uuid
                };
            }
        } catch (e) {
            console.warn(`MacroManager | Failed to resolve UUID: ${item}`);
        }
        return null;
    });

    let resolvedButtons = (await Promise.all(promises)).filter(b => b !== null);

    // Filter by search
    if (this.searchValue) {
        const query = this.searchValue.toLowerCase();
        resolvedButtons = resolvedButtons.map(b => {
            const hidden = !b.label.toLowerCase().includes(query);
            return { ...b, hidden };
        });
    }

    // Sort Logic: Only sort if not using headers (or if sort is forced)
    // Sorting with headers typically breaks the layout, but we keep the setting logic
    if (this.settings.sort) {
        // We only sort if we don't detect headers to avoid mixing sections
        const hasHeaders = resolvedButtons.some(b => b.isHeader);
        if (!hasHeaders) {
            resolvedButtons.sort((a, b) => a.label.localeCompare(b.label));
        }
    }

    // Add styles from settings
    context.buttons = resolvedButtons.map(b => ({
        ...b,
        headerColor: b.isHeader ? this.settings.headerColor : null,
        backgroundHeaderColor: b.isHeader ? this.settings.bgHeaderColor : null
    }));
    
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
        this.render(); // Re-render to handle filtering properly
      });
      searchInput.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') ev.preventDefault(); });
    }

    // Click Logic
    const buttons = this.element.querySelectorAll('.mm-macro-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', async (ev) => {
        const target = ev.currentTarget; 
        const isHeader = target.classList.contains('mm-header');

        if (!isHeader) {
          const uuid = target.dataset.uuid;
          let macro;

          if (uuid) {
              macro = await fromUuid(uuid);
              if (!macro && !uuid.includes('.')) macro = game.macros.get(uuid);
          }

          if (macro) {
            await MacroManagerAPI.macroRun(macro);
          } else {
             ui.notifications.warn("Macro not found or deleted.");
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
    // Unified Open: Always expects macroList (UUIDs) or handles custom logic
    return this.openCustomMacroManager(data);
  }

  // --- Builder Function ---
  static async BuildMacro() {
    new MacroBuilderApp().render(true);
  }

  // --- Creator Logic V2 ---
  static async createManagerMacroV2(name, macroUuids) {
    const folderName = "🤖 Manager Macros";
    let folder = game.folders.getName(folderName);
    
    if (!folder) {
        folder = await Folder.create({
            name: folderName,
            type: "Macro",
            color: "#07195f" 
        });
    }

    // Format List (UUIDs)
    const macroListStr = macroUuids.join(";");

    // Generate Script Content (UUID based)
    const scriptContent = `// Macro Manager: ${name}
MacroManager.Open({
    title: "${name}",
    macroList: "${macroListStr}"
});`;

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
        macroList: args.macroList, 
        settings: settings,
        persistent: args.persistent, 
        window: { title: args.title || "Macro Manager" },
        position: { width: settings.width }
    }).render(true);
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