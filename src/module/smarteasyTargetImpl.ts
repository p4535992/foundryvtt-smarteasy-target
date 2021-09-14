import { Dimensions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseScene';
import { getActor, getTokenFromActor, getTokenFromId, getTokenFromScene, getUserAvatarImage } from './helpers';
import {
  drawBetterTarget,
  drawBullsEye1,
  drawBullsEye2,
  drawCrossHairs1,
  drawCrossHairs2,
  drawDefault,
  getSelectedTokens,
} from './helpers';
import { getCanvas, getGame, SMARTEASYTARGET_MODULE_NAME } from './settings';

export const SmartEasyTarget = {
  getTemplateShape: function (template) {
    let shape = template.data.t;
    shape = shape[0].toUpperCase() + shape.substring(1);

    const fn = MeasuredTemplate.prototype[`_get${shape}Shape`];
    const dim = <Dimensions>getCanvas().dimensions;

    let { direction, distance, angle, width } = template.data;

    distance *= dim.size / dim.distance;
    width *= dim.size / dim.distance;
    direction = Math.toRadians(direction);
    angle = <any>angle;

    switch (shape) {
      case 'Circle':
        return fn.apply(template, [distance]);
      case 'Cone':
        return fn.apply(template, [direction, angle, distance]);
      case 'Rect':
        return fn.apply(template, [direction, distance]);
      case 'Ray':
        return fn.apply(template, [direction, distance, width]);
    }
  },

  init: function () {
    SmartEasyTarget.releaseOthersMap = new WeakMap();
  },

  releaseOthersMap: {},

  tokenSetTarget: function (wrapped, ...args) {
    const releaseOthers = (<Map<Object, any>>SmartEasyTarget.releaseOthersMap).get(this);
    if (releaseOthers !== undefined) {
      args[1].releaseOthers = releaseOthers;
    }

    return wrapped(...args);
  },

  tokenOnClickLeft: function (wrapped, ...args) {
    const [event] = args;
    const oe = event.data.originalEvent;
    const tool = ui.controls?.control?.activeTool;

    if (oe.altKey && getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'altTarget')) {
      //@ts-ignore
      ui.controls?.control?.activeTool = 'target';
    }

    if (ui.controls?.control?.activeTool === 'target') {
      (<Map<Object, any>>SmartEasyTarget.releaseOthersMap).set(this, SmartEasyTarget.releaseBehaviour(oe));
      //const mode = getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'release');
      // if(mode == "standard"){
      SmartEasyTarget.clearTokenTargetsHandler(getGame().user, null);
      // }
    }

    wrapped(...args);

    (<Map<Object, any>>SmartEasyTarget.releaseOthersMap).delete(this);
    //@ts-ignore
    ui.controls?.control?.activeTool = tool;
  },

  tokenCanControl: function (wrapped, ...args) {
    const [, event] = args;

    if (!event) {
      return wrapped(...args);
    }

    const oe = event.data.originalEvent;
    const tool = ui.controls?.control?.activeTool;

    if (oe.altKey && getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'altTarget')) {
      //@ts-ignore
      ui.controls?.control?.activeTool = 'target';
    }

    const canControl = wrapped(...args);
    //@ts-ignore
    ui.controls?.control?.activeTool = tool;

    return canControl;
  },

  tokenLayerTargetObjects: function (wrapped, ...args) {
    const releaseOthers = (<Map<Object, any>>SmartEasyTarget.releaseOthersMap).get(this);

    if (releaseOthers !== undefined) {
      args[1].releaseOthers = releaseOthers;
    }

    return wrapped(...args);
  },

  canvasOnClickLeft: function (wrapped, ...args) {
    const [event] = args;
    const oe = event.data.originalEvent;
    const tool = ui.controls?.control?.activeTool;
    const selectState = event.data._selectState;

    if (oe.altKey && getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'altTarget')) {
      //@ts-ignore
      ui.controls?.control?.activeTool = 'target';
    }

    wrapped(...args);

    if (oe.altKey && getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'altTarget') && selectState !== 2) {
      const { x: ox, y: oy } = event.data.origin;
      const templates = getCanvas().templates?.objects?.children.filter((template: PIXI.DisplayObject) => {
        //@ts-ignore
        const { x: cx, y: cy } = template.center;
        //@ts-ignore
        return template.shape.contains(ox - cx, oy - cy);
      });

      SmartEasyTarget.targetTokensInArea(templates, SmartEasyTarget.releaseBehaviour(oe));
    }
    //@ts-ignore
    ui.controls?.control?.activeTool = tool;
  },

  canvasOnDragLeftDrop: function (wrapped, ...args) {
    const [event] = args;
    const oe = event.data.originalEvent;
    const tool = ui.controls?.control?.activeTool;
    const layer = <any>getCanvas().activeLayer;

    if (oe.altKey && getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'altTarget')) {
      //@ts-ignore
      ui.controls?.control?.activeTool = 'target';
    }

    if (ui.controls?.control?.activeTool === 'target') {
      (<Map<Object, any>>SmartEasyTarget.releaseOthersMap).set(layer, SmartEasyTarget.releaseBehaviour(oe));
      //const mode = getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'release');
      //if(mode == "standard"){
      SmartEasyTarget.clearTokenTargetsHandler(getGame().user, null);
      //}
    }

    wrapped(...args);

    (<Map<Object, any>>SmartEasyTarget.releaseOthersMap).delete(layer);
    //@ts-ignore
    ui.controls?.control?.activeTool = tool;
  },

  templateLayerOnDragLeftDrop: function (wrapped, ...args) {
    const [event] = args;
    const object = event.data.preview;
    const oe = event.data.originalEvent;

    wrapped(...args);

    if (oe.altKey && getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'altTarget')) {
      const template = new MeasuredTemplate(object.document);
      template.shape = SmartEasyTarget.getTemplateShape(template);
      SmartEasyTarget.targetTokensInArea([template], SmartEasyTarget.releaseBehaviour(oe));
    }
  },

  keyboardManagerOnKeyC: function (wrapped, ...args) {
    const [, , modifiers] = args;

    if (!modifiers.isShift) {
      wrapped(...args);
    }
  },

  releaseBehaviour: function (oe) {
    const mode = getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'release');
    if (mode === 'sticky') {
      return !oe.shiftKey && !oe.altKey;
    }

    return !oe.shiftKey;
  },

  targetTokensInArea: function (templates, releaseOthers) {
    if (releaseOthers) {
      getGame().user?.targets.forEach((token) =>
        token.setTarget(false, { releaseOthers: false, groupSelection: true }),
      );
    }

    getCanvas()
      .tokens?.objects?.children.filter((token: Token) => {
        const { x: ox, y: oy } = token.center;
        return templates.some((template) => {
          const { x: cx, y: cy } = template.center;
          return template.shape.contains(ox - cx, oy - cy);
        });
      })
      .forEach((token: Token) => token.setTarget(true, { releaseOthers: false, groupSelection: true }));
    getGame().user?.broadcastActivity({ targets: getGame().user?.targets.ids });
  },

  /**
   * Adds the clear targets/selection button to the menu.
   * @param {array} controls -- the current controls hud array
   */
  getSceneControlButtonsHandler: function (controls) {
    const control = controls.find((c) => c.name === 'token') || controls[0];

    control.tools.push({
      name: 'cancelTargets',
      title: 'Clear Targets/Selection',
      icon: 'fa fa-times-circle',
      visible: true, //getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'XXX'),
      button: true,
      onClick: () => {
        control.activeTool = 'select';
        Hooks.call('clearTokenTargets', getGame().user, SmartEasyTarget.clearTokenTargetsHandler(getGame().user, null));
        return;
      },
      layer: 'TokenLayer',
    });
    control.tools.push({
      name: 'cancelTargetsAll',
      title: 'Clear Targets/Selection All',
      icon: 'fa fa-times-sqare',
      visible: getGame().user?.isGM,
      button: true,
      onClick: () => {
        control.activeTool = 'select';
        const users = <Users>getGame().users;
        for (const [i, user] of users.entries()) {
          Hooks.call('clearTokenTargets', getGame().user, SmartEasyTarget.clearTokenTargetsHandler(user, null));
        }
        return;
      },
      layer: 'TokenLayer',
    });
  },

  /**
   * Button Handler to clear token targets & selections
   * @param {User} user              -- the user clearing the targets
   * @param {TokenLayer} tokenlayer  -- token layer
   */
  clearTokenTargetsHandler: function (user, tokenlayer) {
    for (const [i, t] of user.targets.entries()) {
      //   if (hasProperty(t.document.data, 'flags.'+SMARTEASYTARGET_MODULE_NAME+'.imagePortrait_'+t.document.data._id + "_" + this.document.data.actorId)) {
      //     t.document.unsetFlag(SMARTEASYTARGET_MODULE_NAME, 'imagePortrait_'+t.document.data._id + "_" + this.document.data.actorId);
      //   }
      Object.entries(t.document.data.flags[SMARTEASYTARGET_MODULE_NAME]).forEach(([key, val]) => {
        if (key.startsWith('imagePortrait_')) {
          t.document.unsetFlag(SMARTEASYTARGET_MODULE_NAME, key);
        }
      });
    }
    user.targets.forEach((t) =>
      t.setTarget(false, {
        user: user,
        releaseOthers: true,
        groupSelection: false,
      }),
    );
    user.targets.clear();
    return true;
  },

  // /**
  //  * Creates a sprite from the selected avatar and positions around the container
  //  * @param {User} u -- the user to get
  //  * @param {int} i  -- the current row count
  //  * @param {token} target -- PIXI.js container for height & width (the token)
  //  */
  // buildCharacterPortrait: function (u, i, token, target) {
  //   let actorID = '';
  //   let tokenID = '';
  //   if (token) {
  //     actorID = token.document.actor.data._id;
  //     tokenID = token.document.id;
  //   }
  //   const userID = u ? u.data.document.data._id : getGame().user?.id;
  //   const sceneID = getGame().scenes?.active?.id; //getGame().user?.viewedScene ? getGame().user?.viewedScene : getGame().scenes.active.id;
  //   const pTexTmp = SmartEasyTarget.loadImagePath(tokenID, actorID, userID, sceneID);
  //   let pTex = u.avatar;

  //   if (pTexTmp) {
  //     pTex = pTexTmp;
  //   } else {
  //     if (!u.isGM) {
  //       let character = u.character;
  //       if (!character) {
  //         character = u.data.character;
  //       }
  //       if (character) {
  //         pTex = getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'useToken')
  //           ? character.data.token.img || character.data.img
  //           : character.data.img || character.data.token.img;
  //       } else {
  //         pTex = u.data.avatar;
  //       }
  //     }
  //   }

  //   const color = colorStringToHex(u.data.color);
  //   SmartEasyTarget.drawPortrait(i, color, pTex, target);
  //   return pTex;
  // },

  // drawPortrait(i, color, pTex, target) {
  //   const circleR = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'pipScale') || 12;
  //   const circleOffsetMult = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'pipOffset') || 16;
  //   const scaleMulti = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'pipImgScale') || 1;
  //   const insidePip = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'insidePips') ? circleR : 0;
  //   const texture = PIXI.Texture.from(pTex);
  //   // let texture = u.isGM
  //   //   ? new PIXI.Texture.from(u.avatar)
  //   //   : new PIXI.Texture.from(
  //   //     pTex
  //   //     );

  //   const newTexW = scaleMulti * (2 * circleR);
  //   const newTexH = scaleMulti * (2 * circleR);
  //   const borderThic = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'borderThicc');
  //   let portraitCenterOffset = scaleMulti >= 1 ? (16 + circleR / 12) * Math.log2(scaleMulti) : 0;
  //   portraitCenterOffset += <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'pipOffsetManualY') || 0;
  //   const portraitXoffset = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'pipOffsetManualX') || 0;
  //   const matrix = new PIXI.Matrix(
  //     (scaleMulti * (2 * circleR + 2)) / texture.width,
  //     0,
  //     0,
  //     (scaleMulti * (2 * circleR + 2)) / texture.height,
  //     newTexW / 2 + 4 + i * circleOffsetMult + portraitXoffset + insidePip,
  //     newTexH / 2 + portraitCenterOffset + insidePip,
  //   );
  //   target
  //     .beginFill(color)
  //     .drawCircle(2 + i * circleOffsetMult + insidePip, 0 + insidePip, circleR)
  //     .beginTextureFill({
  //       texture: texture,
  //       alpha: 1,
  //       matrix: matrix,
  //     })
  //     .lineStyle(borderThic, 0x0000000)
  //     .drawCircle(2 + i * circleOffsetMult + insidePip, 0 + insidePip, circleR)
  //     .endFill()
  //     .lineStyle(borderThic / 2, color)
  //     .drawCircle(2 + i * circleOffsetMult + insidePip, 0 + insidePip, circleR);
  // },

  // loadImagePath(tokenID, actorID, userID, sceneID) {
  //   // It's a chat message associated with an actor
  //   const useTokenImage = getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'useToken');
  //   const actor = getActor(actorID, tokenID);
  //   const imgFinal = 'icons/svg/mystery-man.svg';
  //   if (userID && !useTokenImage) {
  //     const imgAvatar = getUserAvatarImage(userID);
  //     if (imgAvatar && !imgAvatar.includes('mystery-man')) {
  //       return imgAvatar;
  //     } else {
  //       //warn("No specific avatar player image found it for player '"+getUserName(message)+"'");
  //       return imgAvatar ? imgAvatar : imgFinal;
  //     }
  //   }

  //   if (!tokenID && !actorID) {
  //     if (userID) {
  //       const imgAvatar = getUserAvatarImage(userID);
  //       if (imgAvatar && !imgAvatar.includes('mystery-man')) {
  //         return imgAvatar;
  //       } else {
  //         // warn("No specific avatar player image found it for player '"+getUserName(message)+"'");
  //         return imgAvatar ? imgAvatar : imgFinal;
  //       }
  //     } else {
  //       //warn("No message user is found");
  //       return imgFinal;
  //     }
  //   }

  //   // Make sense only for player and for non GM
  //   // if(actor?.type == "character" && getGame().user?.isGM){
  //   //     const imgAvatar = ChatPortrait.getUserAvatarImage(message);
  //   //     if(imgAvatar && !imgAvatar.includes("mystery-man")){
  //   //       return imgAvatar;
  //   //     }else{
  //   //       //warn("No specific avatar player image found it for player '"+ChatPortrait.getUserName(message)+"'");
  //   //     }
  //   // }

  //   let token;
  //   //@ts-ignore
  //   let tokenData;
  //   if (tokenID) {
  //     token = getTokenFromScene(sceneID, tokenID)?.document;
  //     if (!token) {
  //       token = getTokenFromId(tokenID)?.document;
  //     }
  //     if (!token && actorID) {
  //       token = getTokenFromActor(actorID)?.document;
  //     }
  //     // THIS PIECE OF CODE IS PROBABLY NOT NECESSARY ANYMORE ??
  //     if (!token) {
  //       try {
  //         token = canvas?.tokens?.getDocuments().find((token) => token.id === tokenID);
  //         //token = getCanvas()?.tokens?.getDocuments().find(tokenID);
  //       } catch (e) {
  //         // Do nothing
  //       }
  //       if (!token) {
  //         tokenData = getGame()
  //           .scenes?.get(sceneID)
  //           ?.data?.tokens?.find((t: TokenDocument) => t.data._id === tokenID); // Deprecated on 0.8.6
  //       } else {
  //         tokenData = token.data;
  //       }
  //     } else {
  //       tokenData = token.data;
  //     }
  //   }

  //   let imgToken = '';
  //   if (tokenData) {
  //     if (useTokenImage && tokenData?.img) {
  //       imgToken = tokenData.img;
  //     }

  //     if (!useTokenImage && tokenData?.actorData?.img) {
  //       imgToken = tokenData.actorData.img;
  //     }

  //     // if(!imgToken || imgToken.includes("mystery-man")){
  //     //return useTokenImage ? <string>actor?.data.token.img : <string>actor?.token?.data?.img; // actor?.img; // Deprecated on 0.8.6
  //     //return useTokenImage ? actor?.data?.token?.img : actor.data.img; // actor?.img; // Deprecated on 0.8.6
  //     //}
  //     if (imgToken && !imgToken.includes('mystery-man')) {
  //       return imgToken;
  //     }
  //   }
  //   let imgActor = '';
  //   if (actor && (!imgToken || imgToken.includes('mystery-man'))) {
  //     if ((!imgActor || imgActor.includes('mystery-man')) && useTokenImage) {
  //       imgActor = <string>actor?.data.token.img;
  //     }
  //     if ((!imgActor || imgActor.includes('mystery-man')) && useTokenImage) {
  //       imgActor = <string>actor?.token?.data?.img;
  //     }
  //     if (!imgActor || imgActor.includes('mystery-man')) {
  //       imgActor = <string>actor?.data.img;
  //     }
  //     if (imgActor && !imgActor.includes('mystery-man')) {
  //       return imgActor;
  //     }
  //   }

  //   const imgAvatar = getUserAvatarImage(userID);
  //   if (imgAvatar && !imgAvatar.includes('mystery-man')) {
  //     return imgAvatar;
  //   } else {
  //     //warn("No specific avatar player image found it for player '"+ChatPortrait.getUserName(message)+"'");
  //     // return imgAvatar ? imgAvatar : INV_UNIDENTIFIED_BOOK;
  //   }

  //   return imgFinal;
  // },

  // _refreshTarget: function () {
  //   this.target.clear();
  //   if (!this.targeted.size) return;

  //   // Determine whether the current user has target and any other users
  //   const [others, user] = Array.from(this.targeted).partition((u) => u === getGame().user);
  //   const userTarget = user.length;

  //   // For the current user, draw the target arrows
  //   if (userTarget) {
  //     let textColor = <string>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'crossairColor')
  //       ? (<string>getGame().settings?.get(SMARTEASYTARGET_MODULE_NAME, 'crossairColor')).replace('#', '0x')
  //       : 0xff9829;

  //     if (getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'use-player-color')) {
  //       textColor = <number>colorStringToHex(<string>getGame().user?.['color']);
  //     }

  //     const p = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'crossairSpread') ? -10 : 4;
  //     const aw = 12;
  //     const h = this.h;
  //     const hh = h / 2;
  //     const w = this.w;
  //     const hw = w / 2;
  //     const ah = <number>getCanvas().dimensions?.size / 3;

  //     const selectedIndicator = getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'target-indicator');
  //     switch (selectedIndicator) {
  //       case '0':
  //         drawDefault(this, textColor, p, aw, h, hh, w, hw, ah);
  //         break;
  //       case '1':
  //         drawCrossHairs1(this, textColor, p, aw, h, hh, w, hw, ah);
  //         break;
  //       case '2':
  //         drawCrossHairs2(this, textColor, p, aw, h, hh, w, hw, ah);
  //         break;
  //       case '3':
  //         drawBullsEye1(this, textColor, p, aw, h, hh, w, hw, ah);
  //         break;
  //       case '4':
  //         drawBullsEye2(this, textColor, p, aw, h, hh, w, hw, ah);
  //         break;
  //       case '5':
  //         drawBetterTarget(this, textColor, p, aw, h, hh, w, hw, ah);
  //         break;
  //       default:
  //         drawDefault(this, textColor, p, aw, h, hh, w, hw, ah);
  //         break;
  //     }
  //   }

  //   // For other users, draw offset pips
  //   if (getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'portraitPips')) {
  //     const arrayTokens = getSelectedTokens();
  //     let foundFlag = false;

  //     // THE FLAG SYSTEM HAS SENSE ONLY WITH TOKEN
  //     if (getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'useToken')) {
  //       if (
  //         hasProperty(
  //           this.document.data,
  //           'flags.' +
  //             SMARTEASYTARGET_MODULE_NAME +
  //             '.imagePortrait_' +
  //             this.document.data._id +
  //             '_' +
  //             this.document.data.actorId,
  //         )
  //       ) {
  //         const smartTargetModel = this.document.getFlag(
  //           SMARTEASYTARGET_MODULE_NAME,
  //           'imagePortrait_' + this.document.data._id + '_' + this.document.data.actorId,
  //         );
  //         if (smartTargetModel && smartTargetModel.image) {
  //           const i = smartTargetModel.index;
  //           const color = colorStringToHex(smartTargetModel.color);
  //           const pTex = smartTargetModel.image;
  //           SmartEasyTarget.drawPortrait(i, color, pTex, this.target);
  //           foundFlag = true;
  //         }
  //       }
  //     }

  //     if (!foundFlag) {
  //       if (getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'useToken')) {
  //         if (getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'forceToUseSelectedTokenForPortraitPips')) {
  //           if (!arrayTokens || arrayTokens.length == 0) {
  //             //ui.notifications.warn(getGame().i18n.localize('SmartEasyTarget.warningNoSelectMoreThanOneToken'));
  //             // TODO FIND A WAY TO SHOW THE WARNING ONLY TO THE ORIGINAL USER
  //             return;
  //           }
  //         }
  //         if (arrayTokens && arrayTokens.length > 0) {
  //           for (const [i, token] of arrayTokens.entries()) {
  //             const pTex = SmartEasyTarget.buildCharacterPortrait(getGame().user, i, token, this.target);
  //             const smarTargetModel = new SmartTargetModel(i, getGame().user?.data.color, pTex);
  //             this.document.setFlag(
  //               SMARTEASYTARGET_MODULE_NAME,
  //               'imagePortrait_' + this.document.data._id + '_' + this.document.data.actorId,
  //               smarTargetModel,
  //             );
  //           }
  //         } else {
  //           // Ignore if you are GM
  //           if (!getGame().user?.isGM) {
  //             if (getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'useOwnedTokenIfNoTokenIsSelected')) {
  //               // If no token is selected use the token of the users character
  //               let token = getCanvas().tokens?.placeables.find(
  //                 (token) => token.data?._id === getGame().user?.character?.data?._id,
  //               );
  //               // If no token is selected use the first owned token of the users character you found
  //               if (!token) {
  //                 token = getCanvas().tokens?.ownedTokens[0];
  //               }
  //               if (token) {
  //                 const pTex = SmartEasyTarget.buildCharacterPortrait(getGame().user, 0, token, this.target);
  //                 const smarTargetModel = new SmartTargetModel(0, getGame().user?.data.color, pTex);
  //                 this.document.setFlag(
  //                   SMARTEASYTARGET_MODULE_NAME,
  //                   'imagePortrait_' + this.document.data._id + '_' + this.document.data.actorId,
  //                   smarTargetModel,
  //                 );
  //               } else {
  //                 const pTex = SmartEasyTarget.buildCharacterPortrait(getGame().user, 0, null, this.target);
  //                 const smarTargetModel = new SmartTargetModel(0, getGame().user?.data.color, pTex);
  //                 this.document.setFlag(
  //                   SMARTEASYTARGET_MODULE_NAME,
  //                   'imagePortrait_' + this.document.data._id + '_' + this.document.data.actorId,
  //                   smarTargetModel,
  //                 );
  //               }
  //             } else {
  //               if (others?.length <= 0) {
  //                 //ui.notifications.warn(getGame().i18n.localize('SmartEasyTarget.warningNoSelectMoreThanOneToken'));
  //                 SmartEasyTarget.clearTokenTargetsHandler(getGame().user, null);
  //               }
  //             }
  //           } else {
  //             if (others && others.length > 0) {
  //               for (const [i, u] of others.entries()) {
  //                 const pTex = SmartEasyTarget.buildCharacterPortrait(u, i, null, this.target);
  //                 const smarTargetModel = new SmartTargetModel(i, (<User>u).data.color, pTex);
  //                 this.document.setFlag(
  //                   SMARTEASYTARGET_MODULE_NAME,
  //                   'imagePortrait_' + this.document.data._id + '_' + this.document.data.actorId,
  //                   smarTargetModel,
  //                 );
  //               }
  //             }
  //           }
  //         }
  //       } else {
  //         if (others && others.length > 0) {
  //           for (const [i, u] of others.entries()) {
  //             const pTex = SmartEasyTarget.buildCharacterPortrait(u, i, null, this.target);
  //             const smarTargetModel = new SmartTargetModel(i, (<User>u).data.color, pTex);
  //             this.document.setFlag(
  //               SMARTEASYTARGET_MODULE_NAME,
  //               'imagePortrait_' + this.document.data._id + '_' + this.document.data.actorId,
  //               smarTargetModel,
  //             );
  //           }
  //         }
  //       }
  //     }
  //   } else {
  //     for (const [i, u] of others.entries()) {
  //       const color = colorStringToHex(<string>(<User>u).data.color);
  //       this.target
  //         .beginFill(color, 1.0)
  //         .lineStyle(2, 0x0000000)
  //         .drawCircle(2 + i * 8, 0, 6);
  //     }
  //   }
  // },

  handleTargeting(token, shift) {
    const isTargeted = token.isTargeted;
    const release = shift ? !SmartEasyTarget.settings().release : SmartEasyTarget.settings().release;
    token.setTarget(!isTargeted, { releaseOthers: release });
  },

  _tokenOnClickLeft(wrapped, ...args) {
    const mode = SmartEasyTarget.settings().mode;
    const oe = args[0].data.originalEvent;
    switch (mode) {
      case 0:
        return wrapped(...args);
        break;
      case 1:
        if (oe.altKey) {
          SmartEasyTarget.handleTargeting(this, oe.shiftKey);
          return;
        } else {
          return wrapped(...args);
        }
        break;
      case 2:
        if ((!getGame().user?.isGM && !this.isOwner) || (this.isOwner && oe.altKey)) {
          SmartEasyTarget.handleTargeting(this, oe.shiftKey);
          return;
        } else {
          return wrapped(...args);
        }
        break;
    }
    super._onClickLeft(...args);
  },

  canvasOnClickLeft(wrapped, ...args) {
    const oe = args[0].data.originalEvent;
    const canvasMousePos = args[0].data.origin;
    if (oe.altKey) {
      let distance = Infinity;
      let closestTemplate:MeasuredTemplate|null = null;
      const places = <MeasuredTemplate[]>getCanvas().templates?.placeables;
      for (const template of places) {
        if (!template.owner) continue;
        const inTemplate = template.shape.contains(canvasMousePos.x - template.x, canvasMousePos.y - template.y);
        const d = Math.sqrt(Math.pow(template.x - canvasMousePos.x, 2) + Math.pow(template.y - canvasMousePos.y, 2));
        if (inTemplate && d < distance) {
          distance = d;
          closestTemplate = <MeasuredTemplate>template;
        }
      }
      if (closestTemplate) {
        const release = oe.shiftKey ? !SmartEasyTarget.settings().release : SmartEasyTarget.settings().release;
        if (release) getCanvas().tokens?.placeables[0]?.setTarget(false, { releaseOthers: true });
        const tokens = <Token[]>getCanvas().tokens?.placeables;
        for (const token of tokens) {
          if (closestTemplate.shape.contains(token.center.x - closestTemplate.x, token.center.y - closestTemplate.y)) {
            token.setTarget(!token.isTargeted, { releaseOthers: false });
          }
        }
      }
    }
    return wrapped(...args);
  },

  _canControl(wrapped, ...args) {
    if (!args[1]) return wrapped(...args);
    const mode = SmartEasyTarget.settings().mode;
    const oe = args[1].data.originalEvent;
    switch (mode) {
      case 1:
        if (oe.altKey) return true;
        break;
      case 2:
        if (!<boolean>getGame().user?.isGM && !this.isOwner) return true;
        break;
    }
    return wrapped(...args);
  },

  /**
   * Creates a sprite from the selected avatar and positions around the container
   * @param {User} u -- the user to get
   * @param {int} i  -- the current row count
   * @param {token} target -- PIXI.js container for height & width (the token)
   */
  async buildCharacterPortrait(u:User, i, target:PIXI.Graphics, token:Token) {
    const color = <number>colorStringToHex(<string>u.data.color);
    const circleR = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'pipScale') || 12;
    const circleOffsetMult = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'pipOffset') || 16;
    const scaleMulti = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'pipImgScale') || 1;
    const insidePip = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'insidePips') ? circleR : 0;
    let pTex;
    if (!u.isGM) {
      let character = <Actor>u.character;
      if (!character) {
        character = <Actor>getGame().actors?.get(<string>u.data.character);
      }
      if (character) {
        pTex = getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'useToken')
          ? character.data.token.img || character.data.img
          : character.data.img || character.data.token.img;
      } else {
        pTex = u.data.avatar;
      }
    }
    const gmTexSetting = <string>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'useTokenGm');
    const gmTexture = gmTexSetting
      ? <string>token.document.getFlag(SMARTEASYTARGET_MODULE_NAME, 'gmtargetimg') || u.avatar
      : u.avatar;
    const texture = u.isGM ? await PIXI.Texture.fromURL(gmTexture) : await PIXI.Texture.fromURL(pTex);
    const newTexW = scaleMulti * (2 * circleR);
    const newTexH = scaleMulti * (2 * circleR);
    const borderThic = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'borderThicc');
    let portraitCenterOffset = scaleMulti >= 1 ? (16 + circleR / 12) * Math.log2(scaleMulti) : 0;
    portraitCenterOffset += <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'pipOffsetManualY') || 0;
    const portraitXoffset = <number>getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'pipOffsetManualX') || 0;
    const matrix = new PIXI.Matrix(
      (scaleMulti * (2 * circleR + 2)) / texture.width,
      0,
      0,
      (scaleMulti * (2 * circleR + 2)) / texture.height,
      newTexW / 2 + 4 + i * circleOffsetMult + portraitXoffset + insidePip,
      newTexH / 2 + portraitCenterOffset + insidePip,
    );
    target
      .beginFill(color)
      .drawCircle(2 + i * circleOffsetMult + insidePip, 0 + insidePip, circleR)
      .beginTextureFill({
        texture: texture,
        alpha: 1,
        matrix: matrix,
      })
      .lineStyle(borderThic, 0x0000000)
      .drawCircle(2 + i * circleOffsetMult + insidePip, 0 + insidePip, circleR)
      .endFill()
      .lineStyle(borderThic / 2, color)
      .drawCircle(2 + i * circleOffsetMult + insidePip, 0 + insidePip, circleR);
  },

  // Draw custom crosshair and pips
  async _refreshTarget() {
    this.target.clear();
    if (!this.targeted.size) return;

    if (getGame().user.isGM) {
      let flag;
      const gmTexSetting = getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'useTokenGm');
      if (gmTexSetting == 1) flag = _token?.actor?.data.img || _token?.data.img;
      if (gmTexSetting == 2) flag = _token?.data.img || _token?.actor?.data.img;
      flag &&
        flag != this.document.getFlag(SMARTEASYTARGET_MODULE_NAME, 'gmtargetimg') &&
        this.document.setFlag(SMARTEASYTARGET_MODULE_NAME, 'gmtargetimg', flag);
    }

    // Determine whether the current user has target and any other users
    const [others, user] = Array.from(this.targeted).partition((u) => u === getGame().user);
    const userTarget = user.length;

    // For the current user, draw the target arrows
    if (userTarget) {
      let textColor = getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'crossairColor')
        ? String(getGame().settings?.get(SMARTEASYTARGET_MODULE_NAME, 'crossairColor')).replace('#', '0x')
        : 0xff9829;

      if (getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'use-player-color')) {
        textColor = <number>colorStringToHex(<string>getGame().user?.['color']);
      }

      const p = getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'crossairSpread') ? -10 : 4;
      const aw = 12;
      const h = this.h;
      const hh = h / 2;
      const w = this.w;
      const hw = w / 2;
      const ah = <number>getCanvas().dimensions?.size / 3;

      const selectedIndicator = getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'target-indicator');
      switch (selectedIndicator) {
        case '0':
          drawDefault(this, textColor, p, aw, h, hh, w, hw, ah);
          break;
        case '1':
          drawCrossHairs1(this, textColor, p, aw, h, hh, w, hw, ah);
          break;
        case '2':
          drawCrossHairs2(this, textColor, p, aw, h, hh, w, hw, ah);
          break;
        case '3':
          drawBullsEye1(this, textColor, p, aw, h, hh, w, hw, ah);
          break;
        case '4':
          drawBullsEye2(this, textColor, p, aw, h, hh, w, hw, ah);
          break;
        case '5':
          drawBetterTarget(this, textColor, p, aw, h, hh, w, hw, ah);
          break;
        default:
          drawDefault(this, textColor, p, aw, h, hh, w, hw, ah);
          break;
      }
    }

    // For other users, draw offset pips
    if (getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'portraitPips')) {
      for (const [i, u] of others.entries()) {
        SmartEasyTarget.buildCharacterPortrait(<User>u, i, this.target, this);
      }
    } else {
      for (const [i, u] of others.entries()) {
        const color = <number>colorStringToHex(<string>(<User>u).data.color);
        this.target
          .beginFill(color, 1.0)
          .lineStyle(2, 0x0000000)
          .drawCircle(2 + i * 8, 0, 6);
      }
    }
  },

  settings() {
    const settings = {
      mode: getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'targetingMode'),
      release: !getGame().settings.get(SMARTEASYTARGET_MODULE_NAME, 'release'),
    };
    return settings;
  },
};
