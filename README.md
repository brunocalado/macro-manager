# Macro Manager
This module let you open a dialog with your favorite macros (image bellow). This let one hotbar space be used for lots of macros.

<p align="center">
  <img width="1000" src="docs/doc01.webp">
</p>

# Features
Check the module settings to configure Macro Manager.

- You can use up to five Macro Managers. 
- You can set them to be persistent, they will not close until you click the **Close Button**.
- You can change the font size.

# How To
You have to configure each macro manager. You do this in the module settings. 
You just have to settings. Then, add to Macro List field the names of the macros in your world.
The name of the macro in your world MUST be igual to the name you put in these fields.
After each macro name add **;**. 

<p align="center">
  <img width="1000" src="docs/doc01.webp">
</p>

## Macro
To trigger the dialog you can create a macro with the following code. You can switch between the macro manager `replacing the number 1 by 2, 3, 4 or 5`.
```js
const mm = game.modules.get('macro-manager')?.api.mm;
mm.openMacroManager( 1 )
```

## Keybindings
You can used keybindings to trigger too. 
Use **Shift+1, Shift+2, Shift+3, Shift+4 and Shift+5**.
You can change these keybindings in **controls settings**.

# Instalation
You can install this module using the manifest: https://raw.githubusercontent.com/brunocalado/macro-manager/main/module.json

# Localization
WIP

# TODO
- Add localization
- Add another interface for the macros dialog

 
# Community
- Do you have something to improve this module? [Share it!](https://github.com/brunocalado/macro-manager/issues)
- Do you find out a bug? [Report it!](https://github.com/brunocalado/macro-manager/issues)

# Changes
You can see changes at [CHANGELOG](CHANGELOG.md).

# Acknowledgements
- @arcanist#4317 

# License
Code license at [LICENSE](LICENSE).
