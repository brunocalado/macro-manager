const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Auxiliary App: Compendium Selector
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

/**
 * Auxiliary App: Copy Text
 */
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
    
    // Default visual settings (Hardcoded)
    this.settings = {
        width: 400,
        fontSize: 16,
        headerColor: "#ffd43b",
        bgHeaderColor: "#ffffff",
        sort: true,
        ...options.settings // Allows override if passed via code
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

    // Search
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
      
      searchInput.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter') ev.preventDefault();
      });
    }

    // Click
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

  static async openCustomMacroManager(args) {
    const defaultSettings = {
      width: 400,
      fontSize: 16,
      headerColor: "#ffd43b",
      bgHeaderColor: "#ffffff",
      sort: true
    };

    const settings = { ...defaultSettings, ...(args.settings || {}) };

    const classes = ["macro-manager-window"];
    if (args.transparent) {
        classes.push("macro-manager-transparent");
    }

    new MacroManagerApp({
        classes: classes, 
        macros: args.macros || [], 
        macroList: args.macroList, 
        settings: settings,
        persistent: args.persistent, 
        window: { 
            title: args.title || "Macro Manager" 
        },
        position: {
            width: settings.width
        }
    }).render(true);
  }

  static async openCompendiumMacroManager(args) {
    const compendiums = this.stringListToArray(args.compendiumList);
    let allMacros = [];

    for (const packLabel of compendiums) {
      const pack = game.packs.find(p => p.metadata.label === packLabel);
      if (!pack) {
        ui.notifications.error(`Compendium not found: ${packLabel}`);
        continue;
      }
      const docs = await pack.getDocuments();
      allMacros.push(...docs);
    }

    const data = {
      ...args,
      macros: allMacros
    };
    await this.openCustomMacroManager(data);
  }

  // --- Helpers ---

  static async getAllMacroLabelsFromCompendium() {
    new CompendiumSelectorApp().render(true);
  }

  static stringListToArray(stringList) {
    if (!stringList) return [];
    return stringList.split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
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