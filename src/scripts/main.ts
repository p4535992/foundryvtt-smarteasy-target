const SMARTEASYTARGET_MODULE_NAME = 'foundryvtt-smarteasy-target';

// Import JavaScript modules

// Import TypeScript modules

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.on('init', () => {
  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'altTarget', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.altTarget.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.altTarget.hint'),
    scope: 'client',
    config: true,
    default: true,
    type: Boolean,
  });

  // hotkeys.registerShortcut({
  // 	name: SMARTEASYTARGET_MODULE_NAME+".customHotKeyTarget", // <- Must be unique
  // 	label: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME+'settings.customHotKeyTarget.name"),
  // 	get: () => game.settings.get(SMARTEASYTARGET_MODULE_NAME, "customHotKeyTarget"),
  // 	set: async value => await game.settings.set(SMARTEASYTARGET_MODULE_NAME, "customHotKeyTarget", value),
  //   scope: "client",
  //   config: true,
  // 	default: () => { return { key: null, alt: true, ctrl: false, shift: false }; },
  // 	onKeyDown: self => { customRefreshTarget(false); },
  //   type: String,
  // });

  // hotkeys.registerShortcut({
  // 	name: SMARTEASYTARGET_MODULE_NAME+".customHotKeyTargetMulti", // <- Must be unique
  // 	label: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME+'settings.customHotKeyTargetMulti.name"),
  // 	get: () => game.settings.get(SMARTEASYTARGET_MODULE_NAME, "customHotKeyTargetMulti"),
  // 	set: async value => await game.settings.set(SMARTEASYTARGET_MODULE_NAME, "customHotKeyTargetMulti", value),
  //   scope: "client",
  //   config: true,
  // 	default: () => { return { key: null, alt: true, ctrl: false, shift: true }; },
  // 	onKeyDown: self => { customRefreshTarget(true); },
  //   type: String,
  // });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'alwaysTarget', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.alwaysTarget.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.alwaysTarget.hint'),
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'portraitPips', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.portraitPips.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.portraitPips.hint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'insidePips', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.insidePips.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.insidePips.hint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'pipImgScale', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.pipImgScale.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.pipImgScale.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: {
      min: 0.05,
      max: 10,
      step: 0.05,
    },
    default: 1,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'pipOffsetManualY', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.pipOffsetManualY.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.pipOffsetManualY.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 0.05,
    },
    default: 0,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'pipOffsetManualX', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.pipOffsetManualX.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.pipOffsetManualX.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 0.05,
    },
    default: 0,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'pipScale', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.pipScale.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.pipScale.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: {
      min: 0.05,
      max: 100,
      step: 0.05,
    },
    default: 12,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'pipOffset', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.pipOffset.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.pipOffset.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: {
      min: 0.05,
      max: 100,
      step: 0.05,
    },
    default: 16,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'borderThicc', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.borderThicc.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.borderThicc.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 10,
      step: 1,
    },
    default: 2,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'crossairSpread', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.crossairSpread.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.crossairSpread.hint'),
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'crossairColor', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.crossairColor.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.crossairColor.hint'),
    scope: 'client',
    config: true,
    type: String,
    default: '#ff9829',
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'target-indicator', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.target-indicator.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.target-indicator.hint'),
    scope: 'client',
    config: true,
    default: '0',
    type: String,
    choices: {
      0: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.target-indicator-choices-0'),
      1: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.target-indicator-choices-1'),
      2: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.target-indicator-choices-2'),
      3: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.target-indicator-choices-3'),
      4: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.target-indicator-choices-4'),
      5: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.target-indicator-choices-5'),
    },
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'use-player-color', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.use-player-color.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.use-player-color.hint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'release', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.releaseBehaviour.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.releaseBehaviour.hint'),
    scope: 'client',
    config: true,
    default: 'sticky',
    type: String,
    choices: {
      sticky: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.releaseBehaviour.choice0.Sticky'),
      standard: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.releaseBehaviour.choice0.Standard'),
    },
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'useToken', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.useToken.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.useToken.hint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'forceToUseSelectedTokenForPortraitPips', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.forceToUseSelectedTokenForPortraitPips.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.forceToUseSelectedTokenForPortraitPips.hint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(SMARTEASYTARGET_MODULE_NAME, 'useOwnedTokenIfNoTokenIsSelected', {
    name: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.useOwnedTokenIfNoTokenIsSelected.name'),
    hint: game.i18n.localize(SMARTEASYTARGET_MODULE_NAME + 'settings.useOwnedTokenIfNoTokenIsSelected.hint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  SmartEasyTarget.init();

  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Token.prototype._refreshTarget',
    SmartEasyTarget._refreshTarget,
    'OVERRIDE',
  );

  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Token.prototype.setTarget',
    SmartEasyTarget.tokenSetTarget,
    'WRAPPER',
  );
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Token.prototype._onClickLeft',
    SmartEasyTarget.tokenOnClickLeft,
    'WRAPPER',
  );
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Token.prototype._canControl',
    SmartEasyTarget.tokenCanControl,
    'WRAPPER',
  );
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'TokenLayer.prototype.targetObjects',
    SmartEasyTarget.tokenLayerTargetObjects,
    'WRAPPER',
  );
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Canvas.prototype._onClickLeft',
    SmartEasyTarget.canvasOnClickLeft,
    'WRAPPER',
  );
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Canvas.prototype._onDragLeftDrop',
    SmartEasyTarget.canvasOnDragLeftDrop,
    'WRAPPER',
  );
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'TemplateLayer.prototype._onDragLeftDrop',
    SmartEasyTarget.templateLayerOnDragLeftDrop,
    'WRAPPER',
  );
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'KeyboardManager.prototype._onKeyC',
    SmartEasyTarget.keyboardManagerOnKeyC,
    'MIXED',
  );

  Hooks.on('getSceneControlButtons', SmartEasyTarget.getSceneControlButtonsHandler);
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
  // Do anything after initialization but before ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', () => {
  // Do anything once the module is ready
  if (!game.modules.get('lib-wrapper')?.active && game.user.isGM) {
    ui.notifications.error(
      `The "${SMARTEASYTARGET_MODULE_NAME}" module requires to install and activate the "libWrapper" module.`,
    );
    return;
  }
  // if (!game.modules.get("lib-df-hotkey")?.active && game.user.isGM){
  //   ui.notifications.error(`The "${SMARTEASYTARGET_MODULE_NAME}" module requires to install and activate the "lib-df-hotkey" module.`);
  //   return;
  // }
  document.addEventListener('keydown', (event) => {
    if (game.settings.get(SMARTEASYTARGET_MODULE_NAME, 'altTarget')) {
      if ((event.altKey && event.key === 'C') || (event.ctrlKey && event.key === 'C')) {
        game.user.targets.forEach((token) => token.setTarget(false, { releaseOthers: false, groupSelection: true }));
        game.user.broadcastActivity({ targets: game.user.targets.ids });
      }
    }
  });
});

// Add any additional hooks if necessary

Hooks.on('hoverToken', (token, hovered) => {
  if (game.settings.get(SMARTEASYTARGET_MODULE_NAME, 'altTarget')) {
    if (keyboard._downKeys.has('Alt') && hovered) {
      if (ui.controls.control.activeTool != 'target') {
        token.SmartEasyTargetPrev = ui.controls.control.activeTool;
      }
      ui.controls.control.activeTool = 'target';
    } else if (!hovered) {
      if (token.SmartEasyTargetPrev) {
        ui.controls.control.activeTool = token.SmartEasyTargetPrev;
        token.SmartEasyTargetPrev = null;
      }
    }
  }

  if (game.settings.get(SMARTEASYTARGET_MODULE_NAME, 'alwaysTarget')) {
    if (!token.isOwner && hovered) {
      if (ui.controls.control.activeTool != 'target') {
        token.SmartEasyTargetPrev = ui.controls.control.activeTool;
      }
      ui.controls.control.activeTool = 'target';
    } else if (!hovered) {
      if (token.SmartEasyTargetPrev) {
        ui.controls.control.activeTool = token.SmartEasyTargetPrev;
        token.SmartEasyTargetPrev = null;
      }
    }
  }
});
