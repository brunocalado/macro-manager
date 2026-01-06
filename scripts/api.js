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
    position: { width: 900, height: 600 },
    form: { handler: MacroBuilderApp.myFormHandler, submitOnChange: false, closeOnSubmit: false }
  };

  static PARTS = {
    form: { template: "modules/macro-manager/templates/builder.hbs" }
  };

  // Helper to get friendly package name
  _getPackageTitle(pack) {
      if (!pack) return "World";
      const packageName = pack.metadata.packageName;
      
      // Check if it's a module
      const module = game.modules.get(packageName);
      if (module) return module.title;
      
      // Check if it's the system
      if (game.system.id === packageName) return game.system.title;
      
      // Check if it's 'world'
      if (packageName === 'world') return "World";
      
      return packageName; // Fallback
  }

  async _prepareContext(options) {
    const sources = [];
    let macros = [];
    
    // Logic: Mode Handling
    if (this.targetMode === 'world') {
        // WORLD MODE
        macros = game.macros.map(m => ({
            uuid: m.uuid, 
            id: m.id,     
            name: m.name,
            img: m.img,
            packLabel: "World"
        }));

    } else {
        // COMPENDIUM MODE
        const packs = game.packs.filter(p => p.metadata.type === 'Macro').map(p => {
            const packageTitle = this._getPackageTitle(p);
            return {
                id: p.metadata.id,
                label: `${packageTitle}: ${p.metadata.label}`, // Friendly Label
                type: "pack",
                checked: this.selectedPackIds.has(p.metadata.id)
            };
        });
        
        packs.sort((a, b) => a.label.localeCompare(b.label));
        sources.push(...packs);

        // Fetch macros from SELECTED compendiums
        for (const source of sources) {
            if (source.checked) {
                const pack = game.packs.get(source.id);
                if (pack) {
                    const docs = await pack.getDocuments();
                    const friendlyPackLabel = this._getPackageTitle(pack);
                    
                    macros.push(...docs.map(d => ({
                        uuid: d.uuid,
                        name: d.name,
                        img: d.img,
                        packLabel: friendlyPackLabel
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

    // --- Tabs Logic ---
    const tabLinks = this.element.querySelectorAll('.mm-tab-link');
    const tabContents = this.element.querySelectorAll('.mm-tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', (ev) => {
            ev.preventDefault();
            const targetId = ev.currentTarget.dataset.tab;

            // Remove active class
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class
            ev.currentTarget.classList.add('active');
            const targetContent = this.element.querySelector(`.mm-tab-content[data-tab="${targetId}"]`);
            if (targetContent) targetContent.classList.add('active');
        });
    });

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

    // Preview Macro
    const previewBtns = this.element.querySelectorAll('[data-action="previewMacro"]');
    previewBtns.forEach(btn => {
        btn.addEventListener('click', async (ev) => {
            ev.stopPropagation(); 
            ev.preventDefault();
            const uuid = ev.currentTarget.dataset.uuid;
            try {
                let doc = await fromUuid(uuid);
                if (!doc && !uuid.includes('.')) doc = game.macros.get(uuid);
                
                if (doc) doc.sheet.render(true);
                else ui.notifications.warn("Could not find macro to preview.");
            } catch (err) {
                console.error(err);
                ui.notifications.error("Error previewing macro.");
            }
        });
    });
  }

  static async myFormHandler(event, form, formData) {
    let selectedUuids = formData.object.macroData;
    
    if (!selectedUuids) selectedUuids = [];
    if (!Array.isArray(selectedUuids)) selectedUuids = [selectedUuids];
    selectedUuids = selectedUuids.filter(u => typeof u === 'string' && u.length > 0);

    const macroName = formData.object.macroName || "Custom Manager";

    // Extract Config Settings
    const config = {
        persistent: formData.object.confPersistent === "true" || formData.object.confPersistent === true,
        settings: {
            width: Number(formData.object.confWidth) || 400,
            fontSize: Number(formData.object.confFontSize) || 16,
            sort: formData.object.confSort === "true" || formData.object.confSort === true
        }
    };

    if (selectedUuids.length === 0) {
        ui.notifications.warn("Please select at least one macro.");
        return;
    }

    await MacroManagerAPI.createManagerMacroV2(macroName, selectedUuids, config);
    ui.notifications.info(`Macro "${macroName}" created successfully!`);
  }
}

/**
 * Main Application V2
 */
class MacroManagerApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
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
    
    const promises = items.map(async (item) => {
        if (item.startsWith("##")) {
            return {
                label: item.replace(/##/g, '').trim(),
                isHeader: true,
                raw: item
            };
        }

        try {
            let macro = await fromUuid(item);
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

    if (this.searchValue) {
        const query = this.searchValue.toLowerCase();
        resolvedButtons = resolvedButtons.map(b => {
            const hidden = !b.label.toLowerCase().includes(query);
            return { ...b, hidden };
        });
    }

    if (this.settings.sort) {
        const hasHeaders = resolvedButtons.some(b => b.isHeader);
        if (!hasHeaders) {
            resolvedButtons.sort((a, b) => a.label.localeCompare(b.label));
        }
    }

    context.buttons = resolvedButtons.map(b => ({
        ...b,
        headerColor: b.isHeader ? this.settings.headerColor : null,
        backgroundHeaderColor: b.isHeader ? this.settings.bgHeaderColor : null
    }));
    
    context.searchValue = this.searchValue;
    // UPDATED: Pass fontSize to template context
    context.fontSize = this.settings.fontSize;
    return context;
  }

  _onRender(context, options) {
    super._onRender(context, options);

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
        this.render(); 
      });
      searchInput.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') ev.preventDefault(); });
    }

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
    return this.openCustomMacroManager(data);
  }

  static async BuildMacro() {
    new MacroBuilderApp().render(true);
  }

  // --- Creator Logic V2 ---
  static async createManagerMacroV2(name, macroUuids, config = {}) {
    const folderName = "🤖 Manager Macros";
    let folder = game.folders.getName(folderName);
    
    if (!folder) {
        folder = await Folder.create({
            name: folderName,
            type: "Macro",
            color: "#07195f" 
        });
    }

    // Unique Name Logic
    let finalName = name;
    let counter = 1;
    
    const existingMacros = folder.contents;
    
    while (existingMacros.some(m => m.name === finalName)) {
        finalName = `${name} ${counter}`;
        counter++;
    }

    const macroListStr = macroUuids.join(";");
    
    const persistent = config.persistent !== undefined ? config.persistent : true;
    const settings = config.settings || { width: 400, fontSize: 16, sort: true };

    const scriptContent = `// Macro Manager: ${finalName}
MacroManager.Open({
    title: "${finalName}",
    macroList: "${macroListStr}",
    persistent: ${persistent},
    settings: ${JSON.stringify(settings, null, 4)}
});`;

    await Macro.create({
        name: finalName,
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