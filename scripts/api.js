export class mm {

  static async openMacroManager( managerID ) {
    const persistent = game.settings.get("macro-manager", `0${managerID}persistent`);
    const title = game.settings.get("macro-manager", `0${managerID}title`);
    const macros = game.settings.get("macro-manager", `0${managerID}macros`).split(';'); 
    const macroList = macros.map(element => {
      return element.trim();
    });    
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
  
} // END CLASS