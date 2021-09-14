import { getGame, SMARTEASYTARGET_MODULE_NAME } from './settings';
import { SmartEasyTarget } from './smarteasyTargetImpl';

export const readyHooks = async () => {
  // Do anything once the module is ready
  document.addEventListener('keydown', (event) => {
    if (getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'altTarget')) {
      if ((event.altKey && event.key === 'C') || (event.ctrlKey && event.key === 'C')) {
        getGame().user?.targets.forEach((token) =>
          token.setTarget(false, { releaseOthers: false, groupSelection: true }),
        );
        getGame().user?.broadcastActivity({ targets: getGame().user?.targets.ids });
      }
    }
  });

  Hooks.on('hoverToken', (token, hovered) => {
    if (getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'altTarget')) {
      if (keyboard._downKeys.has('Alt') && hovered) {
        if (ui.controls?.control?.activeTool != 'target') {
          token.smarttargetPrev = ui.controls?.control?.activeTool;
        }
        //@ts-ignore
        ui.controls?.control?.activeTool = 'target';
      } else if (!hovered) {
        if (token.smarttargetPrev) {
          //@ts-ignore
          ui.controls?.control?.activeTool = token.smarttargetPrev;
          token.smarttargetPrev = null;
        }
      }
    }

    if (getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'alwaysTarget')) {
      if (!token.isOwner && hovered) {
        if (ui.controls?.control?.activeTool != 'target') {
          token.smarttargetPrev = ui.controls?.control?.activeTool;
        }
        //@ts-ignore
        ui.controls?.control?.activeTool = 'target';
      } else if (!hovered) {
        if (token.smarttargetPrev) {
          //@ts-ignore
          ui.controls?.control?.activeTool = token.smarttargetPrev;
          token.smarttargetPrev = null;
        }
      }
    }
  });
};

export const initHooks = async () => {
  SmartEasyTarget.init();

  //@ts-ignore
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Token.prototype._refreshTarget',
    SmartEasyTarget._refreshTarget,
    'OVERRIDE',
  );
  //@ts-ignore
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Token.prototype.setTarget',
    SmartEasyTarget.tokenSetTarget,
    'WRAPPER',
  );
  //@ts-ignore
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Token.prototype._onClickLeft',
    SmartEasyTarget.tokenOnClickLeft,
    'WRAPPER',
  );
  //@ts-ignore
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Token.prototype._canControl',
    SmartEasyTarget.tokenCanControl,
    'WRAPPER',
  );
  //@ts-ignore
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'TokenLayer.prototype.targetObjects',
    SmartEasyTarget.tokenLayerTargetObjects,
    'WRAPPER',
  );
  //@ts-ignore
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Canvas.prototype._onClickLeft',
    SmartEasyTarget.canvasOnClickLeft,
    'WRAPPER',
  );
  //@ts-ignore
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Canvas.prototype._onDragLeftDrop',
    SmartEasyTarget.canvasOnDragLeftDrop,
    'WRAPPER',
  );
  //@ts-ignore
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'TemplateLayer.prototype._onDragLeftDrop',
    SmartEasyTarget.templateLayerOnDragLeftDrop,
    'WRAPPER',
  );
  //@ts-ignore
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'KeyboardManager.prototype._onKeyC',
    SmartEasyTarget.keyboardManagerOnKeyC,
    'MIXED',
  );

  Hooks.on('getSceneControlButtons', SmartEasyTarget.getSceneControlButtonsHandler);
};

export const setupHooks = async () => {
  // Do anything after initialization but before ready
};
