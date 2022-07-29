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
      console.log(data)
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

    const macros = macroList;
    let buttons = {}, dialog, content = `<div sytle="width:100%; text-align:center;><h2>Choose Macro</h2></div>`;
    
    macros.forEach((str)=> {
      let macro;
      if (args.macros!==undefined) {
        macro = args.macros.find(p=>p.name==str);
        console.log(macro)
      } else {
        macro = game.macros.getName(str);
      }
      if(!macro) return;

      buttons[str] = {
        label : `
          <div style="display:flex;flex-direction:row;justify-content:center;align-items:center;width">
            <div style="display:flex;justify-content:left;flex-grow:1;"><img src="${macro.data.img}" width="25" height="25" style="background-color:#5c5c5c;"/></div>
            <div style="display:flex;justify-content:left;flex-grow:4"><label style="${fontSizeStyled}">${str}</label></div>
          </div>`,
        callback : () => {
          if (args.macros===undefined) {
            this.macroRun(macro);
          } else {
            game.macros.getName(str).execute();
          }
          if (args.persistent) dialog.render(true);
        }
      };
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