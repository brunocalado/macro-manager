export class mm {

  static async openMacroManager( managerID ) {
    const persistent = game.settings.get("macro-manager", `0${managerID}persistent`);
    const title = game.settings.get("macro-manager", `0${managerID}title`);

    const macroList = this.cleanMacroList( game.settings.get("macro-manager", `0${managerID}macros`) );
    
    const fontSize = game.settings.get("macro-manager", "fontsize");
    const fontSizeStyled = `font-size: ${fontSize}px;`;   
    
    (()=>{
      const macros = macroList;
      let buttons = {}, dialog, content = `<div sytle="width:100%; text-align:center;><h2>Choose Macro</h2></div>`;
      
      macros.forEach((str)=> {
        let macro = game.macros.getName(str);
        if(!macro) return;

        buttons[str] = {
          label : `
            <div style="display:flex;flex-direction:row;justify-content:center;align-items:center;width">
              <div style="display:flex;justify-content:left;flex-grow:1;"><img src="${macro.data.img}" width="25" height="25" style="background-color:#5c5c5c;"/></div>
              <div style="display:flex;justify-content:left;flex-grow:4"><label style="${fontSizeStyled}">${str}</label></div>
            </div>`,
          callback : () => {
            game.macros.getName(str).execute();
            if (persistent) dialog.render(true);
          }
        }
      });
      dialog = new Dialog({title : `${title}`, content, buttons}).render(true);
    })();

  } // END openMacroManager   

  static async openCustomMacroManager(  macroListParam=[], title='Title', persistent=false ) {
    const macroList = this.cleanMacroList( macroListParam );
    
    const fontSize = game.settings.get("macro-manager", "fontsize");
    const fontSizeStyled = `font-size: ${fontSize}px;`;   
    
    (()=>{
      const macros = macroList;
      let buttons = {}, dialog, content = `<div sytle="width:100%; text-align:center;><h2>Choose Macro</h2></div>`;
      
      macros.forEach((str)=> {
        let macro = game.macros.getName(str);
        if(!macro) return;

        buttons[str] = {
          label : `
            <div style="display:flex;flex-direction:row;justify-content:center;align-items:center;width">
              <div style="display:flex;justify-content:left;flex-grow:1;"><img src="${macro.data.img}" width="25" height="25" style="background-color:#5c5c5c;"/></div>
              <div style="display:flex;justify-content:left;flex-grow:4"><label style="${fontSizeStyled}">${str}</label></div>
            </div>`,
          callback : () => {
            game.macros.getName(str).execute();
            if (persistent) dialog.render(true);
          }
        }
      });
      dialog = new Dialog({title : `${title}`, content, buttons}).render(true);
    })();

  } // END openMacroManager   

  static showSummary() {
    let titleContent = `<h2><img style="border: 0;vertical-align:middle;" src="icons/sundries/documents/document-sealed-signatures-red.webp" width="28" height="28"> Macro Manager Summary</h2>`;
    let message = ``;
  
    let numbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
    for ( const currentNumber of numbers ) {
      const title = game.settings.get("macro-manager", currentNumber + `title`);
      const macroList = this.cleanMacroList(game.settings.get("macro-manager", currentNumber + `macros`));
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
  
  static cleanMacroList(macroListParam) {
    const macros = macroListParam.split(';'); 
    const macroList = macros.map(element => {
      return element.trim();
    });        
    return macroList;
  }
} // END CLASS
