const version = '1.1';
const sm = game.modules.get('swademacros')?.api.sm;

/*
  GM Menu
  
  icons: icons/sundries/documents/document-sealed-signatures-red.webp
  
  Fill the constant macros with the names of your macros, when you click the button it will run the macro.

  Dialog Window will not close until the X button is pressed.
*/
const managerType = 'GM - Macro Manager';

(()=>{
  const macros = [
    "Active Effect Builder",
    "Adventure Deck - Deck",
    "Chase",
    "Deviation",
    "Dramatic Tasks",
    "Falling Damage Calculator",    
    "Interludes",
    "Mass Battle",
    "Mass Roll",
    "Raise Calculator",
    "Size/Scale Calculator",
    "Social Conflict",
    "Quick Combat",
    "Token Disposition Changer"
  ];

  let buttons = {}, dialog, content = `<div sytle="width:100%;text-align:center;><h2>Choose Macro</h2></div>`;
  
  macros.forEach((str)=> {
    let macro = game.macros.getName(str);
    if(!macro) return;

    buttons[str] = {
      label : `
        <div style="display:flex;flex-direction:row;justify-content:center;align-items:center;width">
          <div style="display:flex;justify-content:left;flex-grow:1;"><img src="${macro.data.img}" width="25" height="25" style="background-color:#5c5c5c;"/></div>
          <div style="display:flex;justify-content:left;flex-grow:4"><label>${str}</label></div>
        </div>`,
      callback : () => {
        game.macros.getName(str).execute();
        //dialog.render(true);
      }
    }
  });
  dialog = new Dialog({title : `${managerType}`,content, buttons}).render(true);
})();