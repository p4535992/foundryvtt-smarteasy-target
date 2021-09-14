import { getGame, SMARTEASYTARGET_MODULE_NAME } from './settings';
import { SmartEasyTarget } from './smarteasyTargetImpl';

export const readyHooks = async () => {
  // Do anything once the module is ready
  document.addEventListener('keydown', (event) => {
    if ((event.altKey && event.key === 'C') || (event.ctrlKey && event.key === 'C')) {
      getGame().user?.targets.forEach((token) =>
        token.setTarget(false, { releaseOthers: false, groupSelection: true }),
      );
      getGame().user?.broadcastActivity({ targets: getGame().user?.targets.ids });
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
    SmartEasyTarget._tokenOnClickLeft, //tokenOnClickLeft,
    'MIXED', //'WRAPPER',
  );
  //@ts-ignore
  libWrapper.register(
    SMARTEASYTARGET_MODULE_NAME,
    'Token.prototype._canControl',
    SmartEasyTarget._canControl, // tokenCanControl,
    'MIXED', //'WRAPPER',
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
