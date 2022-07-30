export class mm {

  static async openMacroManager( managerID ) {
    const persistent = game.settings.get("macro-manager", `0${managerID}persistent`);
    const title = game.settings.get("macro-manager", `0${managerID}title`);
    const macroList = game.settings.get("macro-manager", `0${managerID}macros`);  
    const compendiumList = game.settings.get("macro-manager", `0${managerID}sourcelist`);
    const sourceFlag = compendiumList.length>0; // false: world or true: compendium

    if (sourceFlag) {
      const data = {
        "macroList": macroList,
        "title": title,
        "persistent": persistent,
        "compendiumList": compendiumList
      };        
      this.openCompendiumMacroManager( data );
    } else {
      const data = {
        "macroList": macroList,
        "title": title,
        "persistent": persistent
      };      
      this.openCustomMacroManager(  data );
    }
  } // END openMacroManager   

  //static async openCustomMacroManager( args macroListParam=[], title='Title', persistent=false ) {

/*  
    const data = {
      "macroList": "macro 1; macro 2",
      "title": "title",
      "persistent": false,
      "macros": "[]",
    }   
*/ 
  static async openCustomMacroManager( args ) {        
    const macroList = this.stringListToArray( args.macroList );

    const fontSize = game.settings.get("macro-manager", "fontsize");
    const fontSizeStyled = `font-size: ${fontSize}px;`;   

    let macros = macroList;
    let buttons = {}, dialog, content = `<div sytle="width:100%; text-align:center;><h2>Choose Macro</h2></div>`;
    
    if ( game.settings.get("macro-manager", "sortmacros") ) macros = macros.sort();
    
    macros.forEach((macroLabel)=> {
      const headerFrag = macroLabel.includes("##");
      
      let macro;
      if (args.macros!==undefined) {
        macro = args.macros.find(p=>p.name==macroLabel);
      } else {
        macro = game.macros.getName(macroLabel);
      }
      if(!macro && !headerFrag ) return;
      
      if (headerFrag) {
        const headerImage = 'modules/macro-manager/assets/icons/settings.svg';
        const headerText = macroLabel.replace('##', '').replace('##', '');
        buttons[macroLabel] = {
          label : `
            <div style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
              <div style="display:flex;justify-content:left;flex-grow:1;">
                <img src="${headerImage}" width="25" height="25" style="background-color:#5c5c5c;"/>
              </div>
              <div style="display:flex;justify-content:left;flex-grow:4">
                <label style="${fontSizeStyled}"><b>${headerText}</b></label>
              </div>
            </div>`,
          callback : () => {
            if (args.persistent) dialog.render(true);
          }
        }; // END BUTTONS
      } else {
        buttons[macroLabel] = {
          label : `
            <div style="display:flex;flex-direction:row; justify-content:center; align-items:center;">
              <div style="display:flex;justify-content:left;flex-grow:1;">
                <img src="${macro.data.img}" width="25" height="25" style="background-color:#5c5c5c;"/>
              </div>
              <div style="display:flex;justify-content:left;flex-grow:4">
                <label style="${fontSizeStyled}">${macroLabel}</label>
              </div>
            </div>`,
          callback : () => {
            if (args.macros!==undefined) {
              this.macroRun(macro);
            } else {
              game.macros.getName(macroLabel).execute();
            }
            if (args.persistent) dialog.render(true);
          }
        }; // END BUTTONS        
      }
    });
    dialog = new Dialog({title : `${args.title}`, content, buttons}).render(true);
  } // END openMacroManager   

/*  
    const data = {
      "macroList": "macro 1; macro 2",
      "title": "title",
      "persistent": false,
      "compendiumList": "macro 1; macro 2",
    }   
*/   
  static async openCompendiumMacroManager( args ) {
    // Compendium    
    const compendiums = this.stringListToArray(args.compendiumList);
    let macros = [];
    // Get all macros from all compendiums
    for (const compendiumLabel of compendiums) {
      const compendiumMacros = await game.packs.find(p=>p.metadata.label==compendiumLabel).getDocuments();
      for (const compendiumMacro of compendiumMacros) {
        macros.push(compendiumMacro); // get it with:  macros.find(p=>p.name=='Macro Manager 1')
      }
    }    
    
    const data = {
      "macroList": args.macroList,
      "title": args.title,
      "persistent": args.persistent,
      "macros": macros
    };   
    this.openCustomMacroManager(data);    
    
  } // END openMacroManager   
  
  // ---------------------------------------------------------------
  // Tools
  static showSummary() {
    let titleContent = `<h2><img style="border: 0;vertical-align:middle;" src="icons/sundries/documents/document-sealed-signatures-red.webp" width="28" height="28"> Macro Manager Summary</h2>`;
    let message = ``;
  
    let numbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
    for ( const currentNumber of numbers ) {
      const title = game.settings.get("macro-manager", currentNumber + `title`);
      const macroList = this.stringListToArray(game.settings.get("macro-manager", currentNumber + `macros`));
      if ( game.settings.get("macro-manager", currentNumber + `macros`).length>0 ) {        
        message += `<details>`;            
        message += `<summary>${title} (click to expand)</summary>`;      

        message += `<ul>`;      
        for ( const item of macroList ) {
          message += `<li>${item}</li>`;
        }      
        message += `</ul>`;      
        
        message += `</details>`;
      } // END IF
    }

    let chatData = {
      speaker: null,
      whisper : ChatMessage.getWhisperRecipients("GM"),
      content: `
      ${titleContent}
      ${message}
      `};
    ChatMessage.create(chatData, {});    
  }
  
  static async getAllMacroLabelsFromCompendium() {
    const compendiums = await game.packs.filter(p=>p.metadata.type=='Macro');
    let compendiumsList = '';
    for (const compendium of compendiums) {
      compendiumsList += `<option value="${compendium.metadata.name}">${compendium.metadata.label}</option>`
    }    

    let template = `  
      <h2 style="font-align: center;">Get All Macros Labels!</h2>
      <div>
        <b>Compendium (Choose):</b> 
        <select id="compendium" type="text">
          ${compendiumsList}
        </select>  
      </div>
      </br>
    `;
    new Dialog({
      title: "Get All Macros Names",
      content: template,
      buttons: {
        ok: {
          label: "Generate",
          callback: async (html) => {
            let compendium = html.find("#compendium")[0].value;
            const allMacros = await game.packs.find(p=>p.metadata.name==compendium).getDocuments();
            const macros = allMacros.filter(p=>p.data.type=='script');
            let template = '';
            for (const macro of macros) {
              template += `${macro.name};`
            }               

            /* view */
            let form = `
              <label>Copy this to Settings</label>
              <textarea id="moduleTextArea" rows="5" cols="33">${template}</textarea>
            `;

            let dialog = new Dialog({
              title: "Macros",
              content: form,
              buttons: {
                use: {
                  label: "Copy to Clipboard",
                  callback: () => {
                    let copyText = document.getElementById("moduleTextArea"); /* Get the text field */  
                    copyText.select(); /* Select the text field */  
                    document.execCommand("copy"); /* Copy the text inside the text field */  
                    ui.notifications.notify(`Saved on Clipboard`); /* Alert the copied text */
                  }
                }
              }
            }).render(true); 
      
          } // END CALLBACK
        }
      }
    }).render(true);    

  }
  
  static tools(stringList) {
    const macroList = "Summary; Get All Macro Names From Compendium;Documentation";
    const compendiumList = "Macro Manager";
    const data = {
      "macroList": macroList,
      "title": "Tools for Macro Manager",
      "persistent": false,
      "compendiumList" : compendiumList
    }
    this.openCompendiumMacroManager( data );  
  }
  
  // ---------------------------------------------------------------
  // Helpers stringListToArray 
  static stringListToArray(stringList) {
    stringList = stringList.split(';'); 
    const arrayList = stringList.map(element => {
      return element.trim();
    });        
    return arrayList;
  }
  
  // ---------------------------------------------------------------
  // Macros
  static async macroRun(macro) {  
    // Get the data from the macro in the compendium in a JS object form
    let macro_data = macro.toObject();
    let temp_macro = new Macro(macro_data);
    temp_macro.data.permission.default = 3;
    await temp_macro.execute();
  }
  
} // END CLASS