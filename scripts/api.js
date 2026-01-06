const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Application to Build a Custom Macro Manager
 */
class MacroBuilderApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.selectedPackIds = new Set();
    this.selectedMacroUuids = new Set(); 
    this.targetMode = 'world'; 
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    id: "macro-builder",
    classes: ["macro-manager-window"], 
    window: { title: "Macro Manager Builder", resizable: true },
    position: { width: 900, height: 600 },
    form: { handler: MacroBuilderApp.formHandler, submitOnChange: false, closeOnSubmit: false }
  };

  static PARTS = {
    form: { template: "modules/macro-manager/templates/builder.hbs" }
  };

  _getPackageTitle(pack) {
      if (!pack) return "World";
      const packageName = pack.metadata.packageName;
      const module = game.modules.get(packageName);
      if (module) return module.title;
      if (game.system.id === packageName) return game.system.title;
      if (packageName === 'world') return "World";
      return packageName; 
  }

  async _prepareContext(options) {
    const sources = [];
    let macros = [];
    
    if (this.targetMode === 'world') {
        macros = game.macros.map(m => ({
            uuid: m.uuid, 
            id: m.id,     
            name: m.name,
            img: m.img,
            packLabel: "",
            checked: this.selectedMacroUuids.has(m.uuid)
        }));

    } else {
        const packs = game.packs.filter(p => p.metadata.type === 'Macro').map(p => {
            const packageTitle = this._getPackageTitle(p);
            return {
                id: p.metadata.id,
                label: `${packageTitle}: ${p.metadata.label}`,
                type: "pack",
                checked: this.selectedPackIds.has(p.metadata.id)
            };
        });
        
        packs.sort((a, b) => a.label.localeCompare(b.label));
        sources.push(...packs);

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
                        packLabel: friendlyPackLabel,
                        checked: this.selectedMacroUuids.has(d.uuid)
                    })));
                }
            }
        }
    }

    macros.sort((a, b) => a.name.localeCompare(b.name));

    return { 
        packs: sources, 
        macros,
        isWorldMode: this.targetMode === 'world',
        isCompendiumMode: this.targetMode === 'compendium',
        selectedCount: this.selectedMacroUuids.size
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);

    const updateCount = () => {
        const countEl = this.element.querySelector('.mm-count-val');
        if (countEl) countEl.textContent = this.selectedMacroUuids.size;
    };

    const tabLinks = this.element.querySelectorAll('.mm-tab-link');
    const tabContents = this.element.querySelectorAll('.mm-tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', (ev) => {
            ev.preventDefault();
            const targetId = ev.currentTarget.dataset.tab;

            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            ev.currentTarget.classList.add('active');
            const targetContent = this.element.querySelector(`.mm-tab-content[data-tab="${targetId}"]`);
            if (targetContent) targetContent.classList.add('active');
        });
    });

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

    const modeRadios = this.element.querySelectorAll('input[data-action="switchMode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', (ev) => {
            if (ev.target.checked) {
                this.targetMode = ev.target.value;
                this.render();
            }
        });
    });

    const macroCheckboxes = this.element.querySelectorAll('input[name="macroData"]');
    macroCheckboxes.forEach(cb => {
        cb.addEventListener('change', (ev) => {
            const val = ev.target.value;
            if (ev.target.checked) this.selectedMacroUuids.add(val);
            else this.selectedMacroUuids.delete(val);
            updateCount(); 
        });
    });

    const btnAll = this.element.querySelector('[data-action="selectAll"]');
    const btnNone = this.element.querySelector('[data-action="deselectAll"]');

    if (btnAll) {
        btnAll.addEventListener('click', () => {
            macroCheckboxes.forEach(c => {
                c.checked = true;
                this.selectedMacroUuids.add(c.value);
            });
            updateCount();
        });
    }
    
    if (btnNone) {
        btnNone.addEventListener('click', () => {
            macroCheckboxes.forEach(c => {
                c.checked = false;
                this.selectedMacroUuids.delete(c.value);
            });
            updateCount();
        });
    }

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

  static async formHandler(event, form, formData) {
    let selectedUuids = Array.from(this.selectedMacroUuids);
    selectedUuids = selectedUuids.filter(u => typeof u === 'string' && u.length > 0);

    const macroName = formData.object.macroName || "Custom Manager";
    const macroTitle = formData.object.macroTitle || macroName;

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

    const createdMacro = await MacroManagerAPI.createManagerMacroV2(macroName, selectedUuids, config, macroTitle);
    if (createdMacro) {
        ui.notifications.info(`Macro "${createdMacro.name}" created successfully!`);
        this.close(); 
    }
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
    
    // Parse the raw string into an array
    const rawItems = MacroManagerAPI.stringListToArray(this.macroListRaw);
    
    // Data Structures
    const folders = [];
    const looseMacros = [];
    let currentFolder = null;

    // Helper to resolve macro
    const resolveMacro = async (item) => {
        try {
            let macro = await fromUuid(item);
            if (!macro && !item.includes('.')) macro = game.macros.get(item);
            if (macro) {
                return {
                    label: macro.name,
                    icon: macro.img,
                    uuid: macro.uuid,
                    isMacro: true
                };
            }
        } catch (e) {
             // console.warn(`MacroManager | Failed: ${item}`);
        }
        return null;
    };

    // 1. Structural Parsing
    for (const item of rawItems) {
        if (item.startsWith("##")) {
            // It's a Folder
            const folderName = item.replace(/##/g, '').trim();
            currentFolder = {
                label: folderName,
                isFolder: true,
                items: [],
                id: `folder-${foundry.utils.randomID()}` // Unique ID for toggle
            };
            folders.push(currentFolder);
        } else {
            // It's a Macro
            const macroData = await resolveMacro(item);
            if (macroData) {
                if (currentFolder) {
                    currentFolder.items.push(macroData);
                } else {
                    looseMacros.push(macroData);
                }
            }
        }
    }

    // 2. Sorting (if enabled)
    if (this.settings.sort) {
        // Sort folder labels
        folders.sort((a, b) => a.label.localeCompare(b.label));
        // Sort macros inside folders
        folders.forEach(f => f.items.sort((a, b) => a.label.localeCompare(b.label)));
        // Sort loose macros
        looseMacros.sort((a, b) => a.label.localeCompare(b.label));
    }

    // 3. Search Filtering
    let filteredFolders = folders;
    let filteredLoose = looseMacros;

    if (this.searchValue) {
        const query = this.searchValue.toLowerCase();
        
        // Filter loose
        filteredLoose = looseMacros.filter(m => m.label.toLowerCase().includes(query));

        // Filter folders: Keep folder if Name matches OR if it contains matching macros
        filteredFolders = folders.map(f => {
            const nameMatch = f.label.toLowerCase().includes(query);
            const matchingItems = f.items.filter(m => m.label.toLowerCase().includes(query));
            
            if (nameMatch || matchingItems.length > 0) {
                return {
                    ...f,
                    items: nameMatch ? f.items : matchingItems, // If folder matches, show all. If only items match, show only those.
                    forceOpen: true // Auto open on search
                };
            }
            return null;
        }).filter(f => f !== null);
    }

    return { 
        folders: filteredFolders,
        looseMacros: filteredLoose,
        searchValue: this.searchValue,
        fontSize: this.settings.fontSize
    };
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

    // --- Folder Toggling ---
    const folderHeaders = this.element.querySelectorAll('.mm-folder-header');
    folderHeaders.forEach(header => {
        header.addEventListener('click', (ev) => {
            ev.preventDefault();
            const folderId = header.dataset.folderId;
            const content = this.element.querySelector(`#${folderId}`);
            const icon = header.querySelector('.mm-folder-icon');

            if (content) {
                const isHidden = content.style.display === 'none';
                if (isHidden) {
                    content.style.display = 'flex'; // Show
                    icon.classList.remove('fa-folder');
                    icon.classList.add('fa-folder-open');
                } else {
                    content.style.display = 'none'; // Hide
                    icon.classList.remove('fa-folder-open');
                    icon.classList.add('fa-folder');
                }
            }
        });
    });

    // --- Macro Clicking ---
    const buttons = this.element.querySelectorAll('.mm-macro-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', async (ev) => {
        const uuid = ev.currentTarget.dataset.uuid;
        
        // Prevent clicking the folder header from triggering this if classes overlap
        if (!uuid) return; 

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

  static async createManagerMacroV2(name, macroUuids, config = {}, title = null) {
    const folderName = "🤖 Manager Macros";
    let folder = game.folders.getName(folderName);
    
    if (!folder) {
        folder = await Folder.create({
            name: folderName,
            type: "Macro",
            color: "#07195f" 
        });
    }

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
    const displayTitle = title || finalName;

    const scriptContent = `// Macro Manager: ${finalName}
MacroManager.Open({
    title: "${displayTitle}",
    macroList: "${macroListStr}",
    persistent: ${persistent},
    settings: ${JSON.stringify(settings, null, 4)}
});`;

    return await Macro.create({
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
    
    const uniqueId = args.id || `macro-manager-${foundry.utils.randomID()}`;

    new MacroManagerApp({
        id: uniqueId, 
        classes: ["macro-manager-window"], 
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