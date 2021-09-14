import { i18n } from '../smarteasy-target';

export const SMARTEASYTARGET_MODULE_NAME = 'foundryvtt-smarteasy-target';

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas) || !canvas.ready) {
    throw new Error('Canvas Is Not Initialized');
  }
  return canvas;
}
/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('Game Is Not Initialized');
  }
  return game;
}

export const registerSettings = function () {
  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'targetingMode', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.targetingMode.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.targetingMode.hint'),
    scope: 'client',
    config: true,
    default: 1,
    type: Number,
    choices: {
      0: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.targetingMode.opt0'),
      1: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.targetingMode.opt1'),
      2: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.targetingMode.opt2'),
    },
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'release', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.releaseBehaviour.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.releaseBehaviour.hint'),
    scope: 'client',
    config: true,
    default: 0,
    type: Number,
    choices: {
      0: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.releaseBehaviour.choice0.Standard'),
      1: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.releaseBehaviour.choice0.Sticky'),
    },
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'portraitPips', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.portraitPips.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.portraitPips.hint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'useToken', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.useToken.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.useToken.hint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'useTokenGm', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.useTokenGm.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.useTokenGm.hint'),
    scope: 'world',
    config: true,
    default: 0,
    type: Number,
    choices: {
      0: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.useTokenGm.opt0'),
      1: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.useTokenGm.opt1'),
      2: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.useTokenGm.opt2'),
    },
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'insidePips', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.insidePips.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.insidePips.hint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'pipImgScale', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.pipImgScale.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.pipImgScale.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: <any>{
      min: 0.05,
      max: 10,
      step: 0.05,
    },
    default: 1,
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'pipOffsetManualY', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.pipOffsetManualY.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.pipOffsetManualY.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: <any>{
      min: 0,
      max: 100,
      step: 0.05,
    },
    default: 0,
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'pipOffsetManualX', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.pipOffsetManualX.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.pipOffsetManualX.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: <any>{
      min: 0,
      max: 100,
      step: 0.05,
    },
    default: 0,
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'pipScale', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.pipScale.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.pipScale.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: <any>{
      min: 0.05,
      max: 100,
      step: 0.05,
    },
    default: 12,
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'pipOffset', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.pipOffset.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.pipOffset.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: <any>{
      min: 0.05,
      max: 100,
      step: 0.05,
    },
    default: 16,
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'borderThicc', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.borderThicc.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.borderThicc.hint'),
    scope: 'world',
    config: true,
    type: Number,
    range: <any>{
      min: 0,
      max: 10,
      step: 1,
    },
    default: 2,
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'crossairSpread', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.crossairSpread.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.crossairSpread.hint'),
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'crossairColor', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.crossairColor.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.crossairColor.hint'),
    scope: 'client',
    config: true,
    type: String,
    default: '#ff9829',
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'target-indicator', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.target-indicator.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.target-indicator.hint'),
    scope: 'client',
    config: true,
    default: '0',
    type: String,
    choices: {
      0: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.target-indicator-choices-0'),
      1: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.target-indicator-choices-1'),
      2: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.target-indicator-choices-2'),
      3: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.target-indicator-choices-3'),
      4: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.target-indicator-choices-4'),
      5: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.target-indicator-choices-5'),
    },
  });

  getGame().settings.register(SMARTEASYTARGET_MODULE_NAME, 'use-player-color', {
    name: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.use-player-color.name'),
    hint: i18n(SMARTEASYTARGET_MODULE_NAME + '.settings.use-player-color.hint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
};
