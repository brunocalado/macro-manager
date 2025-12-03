/**
 * Classe principal do Macro Manager
 * Responsável pela lógica de exibição e execução das macros.
 */
export class MacroManagerAPI {

  /**
   * Abre o gerenciador de macros baseado no ID (1 a 9).
   * @param {number} managerID - O número do slot do gerenciador.
   */
  static async openMacroManager(managerID) {
    // Garante formato 01, 02, etc.
    const idString = managerID.toString().padStart(2, '0');
    
    const persistent = game.settings.get("macro-manager", `${idString}persistent`);
    const title = game.settings.get("macro-manager", `${idString}title`);
    const macroListRaw = game.settings.get("macro-manager", `${idString}macros`);
    const compendiumListRaw = game.settings.get("macro-manager", `${idString}sourcelist`);
    
    // Verifica se há lista de compêndios
    const compendiumList = this.stringListToArray(compendiumListRaw);
    const sourceFlag = compendiumList.length > 0;

    const data = {
      macroList: macroListRaw,
      title: title,
      persistent: persistent
    };

    if (sourceFlag) {
      data.compendiumList = compendiumListRaw;
      await this.openCompendiumMacroManager(data);
    } else {
      await this.openCustomMacroManager(data);
    }
  }

  /**
   * Abre o diálogo com macros customizadas.
   * @param {Object} args - Argumentos de configuração.
   */
  static async openCustomMacroManager(args) {
    // Configurações Visuais
    const settings = {
      width: game.settings.get("macro-manager", "dialogwidth"),
      transparency: game.settings.get("macro-manager", "dialogtransparency"),
      headerColor: game.settings.get("macro-manager", "headercolor"),
      bgHeaderColor: game.settings.get("macro-manager", "backgroundheadercolor"),
      template: game.settings.get("macro-manager", "theme"),
      fontSize: game.settings.get("macro-manager", "fontsize"),
      sort: game.settings.get("macro-manager", "sortmacros")
    };

    const maxButtonSize = settings.width - 40;
    
    // Opções do Dialog
    const dialogOptions = {
      width: settings.width,
      classes: settings.transparency ? ["macro-manager-dialog"] : []
    };

    // Processa lista de macros
    let macroLabels = this.stringListToArray(args.macroList);
    if (settings.sort) macroLabels.sort();

    let buttons = {};
    // Correção: Typo "sytle" corrigido para "style"
    const content = `<div style="width:100%;"></div>`;
    let dialogInstance;

    for (const label of macroLabels) {
      const isHeader = label.includes("##");
      let macro = null;

      // Busca a macro na lista passada ou no mundo
      if (!isHeader) {
        if (args.macros) {
          macro = args.macros.find(m => m.name === label);
        } else {
          macro = game.macros.getName(label);
        }
      }

      // Se não achou macro e não é cabeçalho, pula
      if (!macro && !isHeader) continue;

      // Dados para o template
      let templateData = {
        labelFontSize: settings.fontSize,
        maxButtonSize: maxButtonSize,
        header: isHeader
      };

      if (isHeader) {
        const cleanText = label.replace(/##/g, '').trim();
        templateData = {
          ...templateData,
          icon: 'icons/sundries/books/book-red-exclamation.webp',
          labelText: cleanText,
          headerColor: settings.headerColor,
          backgroundHeaderColor: settings.bgHeaderColor
        };
      } else {
        templateData = {
          ...templateData,
          icon: macro.img,
          labelText: label
        };
      }

      // Renderiza o botão HTML
      // V13: renderTemplate é global
      const html = await renderTemplate(`modules/macro-manager/templates/${settings.template}.html`, templateData);

      // Adiciona à estrutura de botões do Dialog
      buttons[label] = {
        label: html,
        callback: async () => {
          if (!isHeader && macro) {
             await this.macroRun(macro);
          }
          if (args.persistent && dialogInstance) {
            dialogInstance.render(true);
          }
        }
      };
    }

    // Cria e renderiza o Dialog
    dialogInstance = new Dialog({
      title: args.title,
      content: content,
      buttons: buttons
    }, dialogOptions).render(true);
  }

  /**
   * Abre macros vindas de Compêndios.
   */
  static async openCompendiumMacroManager(args) {
    const compendiums = this.stringListToArray(args.compendiumList);
    let allMacros = [];

    for (const packLabel of compendiums) {
      // V13: game.packs.find é seguro
      const pack = game.packs.find(p => p.metadata.label === packLabel);
      
      if (!pack) {
        ui.notifications.error(game.i18n.format(`macro-manager.messages.compendiumNotFound`, { message: packLabel }));
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

  // ---------------------------------------------------------------
  // Tools & Helpers
  // ---------------------------------------------------------------

  static showSummary() {
    let message = ``;
    
    for (let i = 1; i <= 9; i++) {
      const num = i.toString().padStart(2, '0');
      const title = game.settings.get("macro-manager", `${num}title`);
      const rawMacros = game.settings.get("macro-manager", `${num}macros`);
      const macroList = this.stringListToArray(rawMacros);

      if (macroList.length > 0) {
        message += `
          <details>
            <summary><strong>${title}</strong> (${num})</summary>
            <ul>${macroList.map(m => `<li>${m}</li>`).join('')}</ul>
          </details>`;
      }
    }

    const content = `
      <h2><img style="border:0;vertical-align:middle;" src="icons/sundries/documents/document-sealed-signatures-red.webp" width="28" height="28"> Macro Manager Summary</h2>
      ${message}
    `;

    ChatMessage.create({
      content: content,
      whisper: ChatMessage.getWhisperRecipients("GM")
    });
  }

  static async getAllMacroLabelsFromCompendium() {
    // V13: Filtragem de packs
    const packs = game.packs.filter(p => p.metadata.type === 'Macro');
    
    let options = packs.map(p => `<option value="${p.metadata.id}">${p.metadata.label}</option>`).join('');

    const content = `
      <div style="margin-bottom: 10px;">
        <p><strong>Choose Compendium:</strong></p>
        <select id="compendium-select" style="width: 100%;">${options}</select>
      </div>
    `;

    new Dialog({
      title: "Get All Macros Names",
      content: content,
      buttons: {
        generate: {
          label: "Generate List",
          icon: '<i class="fas fa-cogs"></i>',
          callback: async (html) => {
            const packId = html.find("#compendium-select").val();
            const pack = game.packs.get(packId);
            if (!pack) return;

            const docs = await pack.getDocuments();
            // Filtra apenas scripts se necessário, ou pega tudo
            const names = docs.map(d => d.name).join('; ');

            this.showCopyDialog(names);
          }
        }
      },
      default: "generate"
    }).render(true);
  }

  static showCopyDialog(text) {
     const content = `
       <p>Copy this to your settings:</p>
       <textarea id="copy-text" rows="8" style="width:100%">${text}</textarea>
     `;
     
     new Dialog({
       title: "Macro List",
       content: content,
       buttons: {
         copy: {
           label: "Copy to Clipboard",
           icon: '<i class="fas fa-copy"></i>',
           callback: () => {
             // V13 Modern Clipboard API
             game.clipboard.copyPlainText(text);
             ui.notifications.info("Copied to clipboard!");
           }
         }
       }
     }).render(true);
  }

  static tools() {
    const data = {
      macroList: "Summary; Get All Macro Names From Compendium; Documentation",
      title: "Tools for Macro Manager",
      persistent: false,
      compendiumList: "Macro Manager" // Assumes a pack named "Macro Manager" exists with these tool macros
    };
    this.openCompendiumMacroManager(data);
  }

  static stringListToArray(stringList) {
    if (!stringList) return [];
    return stringList.split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  static async macroRun(macro) {
    if (!macro) return;
    // Executa a macro. Na V11+ execute() é suficiente e lida com permissões se for GM.
    try {
      await macro.execute();
    } catch (err) {
      ui.notifications.error(`Error running macro ${macro.name}: ${err.message}`);
      console.error(err);
    }
  }
}