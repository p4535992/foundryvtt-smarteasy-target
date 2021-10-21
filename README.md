# Smart and Easy Target
## THIS IS NOT A OFFICIAL MODULE, I'm just learning how to write code for Foundry VTT.

A small Foundry VTT module that allows for easy targeting while holding "alt". 
Also allows for alt+clicking inside an AoE to target all tokens within that AoE. 
Holding alt while placing a template will also target all tokens within that template when placed.

**Note: This is module is inspired from :**

- the  wonderful work done by [theRipper93](https://github.com/theripper93) with its [Smart Target](https://github.com/theripper93/Smart-Target) module.
If you want to support more modules of this kind, I invite you to go and support his patreon

[![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/theripper93) [![alt-text](https://img.shields.io/badge/-Discord-%235662f6?style=for-the-badge)](https://discord.gg/F53gBjR97G)

- the  wonderful work done by [Fyorl](https://bitbucket.org/%7Beee45cf2-a6e7-43d6-bded-8054de334101%7D/) with its [Easy Target](https://bitbucket.org/Fyorl/easy-target/src/master) module.


## Features

1. Target with Alt+Click
2. For players, target by just left clicking a non-owned token
3. Show portraits instead of colored pips to indicate targets, positioning\offset and size of the icons can be configured in the module settings
4. Customize color\shape of the targeting reticule
5. Clear all targets with alt+shift+c, or ctrl+shift+c on Mac.

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-smarteasy-target/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

## Settings

- **Targeting Mode:** 
  - Default: Default foundry behaviour. 
  - Alt-click: Target tokens by pressing Alt+Click, add Shift to target multiple. 
  - Always Target: Clicking on non-owned tokens automatically targets them"

-  **Release Behaviour:** This setting determines how refresh target behaves when clicking multiple tokens. 
   -  'Sticky' mode will target each clicked token without un-targeting anything, and you must click a token again to un-target it. 
   -  'Standard' mode more closely matches the standard foundry behaviour where all previous tokens are automatically un-targeted when clicking a new token, and you must hold Shift while clicking in order to target multiple tokens.

- **Show indicator portraits instead of colors:** Uses avatar for GM, defaults to Token for players if no avatar is found for the assigned actor (requires refresh)

- **Use Tokens instead of Avatars:** Use tokens instead of avatars for players target indicators

- **Gm image:** The image to use on indicator portraits for the GM
  - Player Avatar
  - Token Portrait
  - Token Image

- **Keep target indicators inside the token:** Move the target indicators in a way that they remain inside the token border

- **Target Icon Image Scale:** Set the scale for the image used by the target icons (default: 1)

- **Target Image Y Offset:** Add a flat offset to the image in pixels (default: 0)

- **Target Image X Offset:** Add a flat offset to the image in pixels (default: 0)

- **Target Icon Size:** Set the size for the target icon in pixels (default: 12)

- **Target Icon Offset:** Set the distance between icons in pixels (default: 16)

- **Border Thickness:** Set the thickness of the border in pixels (default: 2)

- **Bring Targeting Arrows Closer Together:** Bring the targeting arrows closer together so that they are inside the token frame

- **Targeting Arrows Color:** Hex color for the targeting arrows (default: #ff9829)

- **Target indicator:** Select the indicator for a targeted token
  - Default Foundry Indicator
  - CrossHair 1
  - CrossHair 2
  - BullsEye 1
  - BullsEye 2
  - Better Target

- **Use player color for target indicator:** Use player color for target indicator

# Build

## Install all packages

```bash
npm install
```
## npm build scripts

### build

will build the code and copy all necessary assets into the dist folder and make a symlink to install the result into your foundry data; create a
`foundryconfig.json` file with your Foundry Data path.

```json
{
  "dataPath": "~/.local/share/FoundryVTT/"
}
```

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run-script build
```

### NOTE:

You don't need to build the `foundryconfig.json` file you can just copy the content of the `dist` folder on the module folder under `modules` of Foundry

### build:watch

`build:watch` will build and watch for changes, rebuilding automatically.

```bash
npm run-script build:watch
```

### clean

`clean` will remove all contents in the dist folder (but keeps the link from build:install).

```bash
npm run-script clean
```
### lint and lintfix

`lint` launch the eslint process based on the configuration [here](./.eslintrc)

```bash
npm run-script lint
```

`lintfix` launch the eslint process with the fix argument

```bash
npm run-script lintfix
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

### package

`package` generates a zip file containing the contents of the dist folder generated previously with the `build` command. Useful for those who want to manually load the module or want to create their own release

```bash
npm run-script package
```

## [Changelog](./changelog.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-smarteasy-target/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

This package is under an [GPL-3.0 License](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

- [GPL-3.0 License](https://bitbucket.org/Fyorl/easy-target/src/master/LICENSE) from [easy target](https://bitbucket.org/Fyorl/easy-target/src/master/)
- [MIT License](https://github.com/sPOiDar/fvtt-module-better-target/blob/master/LICENSE) from [Better Target](https://github.com/sPOiDar/fvtt-module-better-target)
- [MIT License](https://github.com/eadorin/target-enhancements/blob/master/LICENSE) from [Target Enhancements](https://github.com/eadorin/target-enhancements)
- [GPL-3.0 License](https://github.com/basicer/foundryvtt-t-is-for-target/blob/master/LICENSE) from  [T is for target](https://github.com/basicer/foundryvtt-t-is-for-target)
- [GPL-3.0 License](https://bitbucket.org/Fyorl/easy-target/src/master/LICENSE) from [SmartTarget](https://github.com/theripper93/Smart-Target)

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- [easy target](https://bitbucket.org/Fyorl/easy-target/src/master/) thanks to [Fyorl](https://bitbucket.org/%7Beee45cf2-a6e7-43d6-bded-8054de334101%7D/)
- [Better Target](https://github.com/sPOiDar/fvtt-module-better-target) thanks to [sPOiDar](https://github.com/sPOiDar/fvtt-module-better-target)
- [Target Enhancements](https://github.com/eadorin/target-enhancements) thanks to [eadorin](https://github.com/eadorin)
- [T is for target](https://github.com/basicer/foundryvtt-t-is-for-target) ty to [basicer](https://github.com/basicer)
- [SmartTarget](https://github.com/theripper93/Smart-Target) ty to [theripper93](https://github.com/theripper93)

## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

Mad props to the 'League of Extraordinary FoundryVTT Developers' community which helped me figure out a lot.
