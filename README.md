# Macro Manager
This module let you open a dialog with your favorite macros (image bellow). 
This let one hotbar space be used for lots of macros or you can just use a keyboard shortcut without the hotbar.

<p align="center">
  <img width="1000" src="docs/doc01.webp">
</p>

## Applications

- Heavy macro users 
- It's alternate way to call your macros or anything that you would use in the hotbar

# Features
Check the module settings to configure Macro Manager.

- You can use up to nine Macro Managers. 
- You can set them to be persistent, they will not close until you click the **Close Button**.
- You can call Summary to know how your macros are organized.
- You can change the font size.

**Summary**
<p align="center">
  <img width="1000" src="docs/doc03.webp">
</p>

# How To
You have to configure each macro manager. You do this in the module settings. 
You just have to settings. Then, add to Macro List field the names of the macros in your world.
The name of the macro in your world MUST be igual to the name you put in these fields.
After each macro name add **;**. 

<p align="center">
  <img width="1000" src="docs/doc01.webp">
</p>

## Macro
To trigger the dialog you can create a macro with the following code. You can switch between the macro manager `replacing the number 1 by 2, 3, 4, 6, 7, 8 or 9`.

```js
const mm = game.modules.get('macro-manager')?.api.mm;
mm.openMacroManager( 1 );
```

You can call the summary with:
```js
const mm = game.modules.get('macro-manager')?.api.mm;
mm.showSummary();
```

## Keybindings
You can used keybindings to trigger too. 
Use **Shift+1, Shift+2, Shift+3, Shift+4, Shift+5 Shift+6, Shift+7, Shift+8, and Shift+9**.

You can trigger the Summary with **Shift+0**.

You can change these keybindings in **controls settings**.

<p align="center">
  <img width="1000" src="docs/doc02.webp">
</p>

# Instalation
You can install this module using the manifest: https://raw.githubusercontent.com/brunocalado/macro-manager/main/module.json

# Localization
WIP

# TODO
- Add localization
- Add another interface for the macros dialog
- improve menu
 
# Community
- Do you have something to improve this module? [Share it!](https://github.com/brunocalado/macro-manager/issues)
- Do you find out a bug? [Report it!](https://github.com/brunocalado/macro-manager/issues)

# Changes
You can see changes at [CHANGELOG](CHANGELOG.md).

# Acknowledgements
- @arcanist#4317 

# License
Code license at [LICENSE](LICENSE).
