

const SmartTarget = {

	getTemplateShape: function (template) {
		let shape = template.data.t;
		shape = shape[0].toUpperCase() + shape.substring(1);

		const fn = MeasuredTemplate.prototype[`_get${shape}Shape`];
		const dim = canvas.dimensions;
		let {direction, distance, angle, width} = template.data;

		distance *= (dim.size / dim.distance);
		width *= (dim.size / dim.distance);
		direction = Math.toRadians(direction);

		switch (shape) {
			case 'Circle': return fn.apply(template, [distance]);
			case 'Cone': return fn.apply(template, [direction, angle, distance]);
			case 'Rect': return fn.apply(template, [direction, distance]);
			case 'Ray': return fn.apply(template, [direction, distance, width]);
		}
	},

  init : function() {
    SmartTarget.releaseOthersMap = new WeakMap();
  },

  releaseOthersMap : {},

  tokenSetTarget : function (wrapped, ...args) {
    const releaseOthers = SmartTarget.releaseOthersMap.get(this);
    if (releaseOthers !== undefined) {
      args[1].releaseOthers = releaseOthers;
    }

    return wrapped(...args);
  },

  tokenOnClickLeft : function (wrapped, ...args) {
    const [ event ] = args;
    const oe = event.data.originalEvent;
    const tool = ui.controls.control.activeTool;

    if (oe.altKey && game.settings.get(SMARTTARGET_MODULE_NAME, "altTarget")) {
      ui.controls.control.activeTool = 'target';
    }

    if (ui.controls.control.activeTool === 'target') {
      SmartTarget.releaseOthersMap.set(this, SmartTarget.releaseBehaviour(oe));
      //const mode = game.settings.get(SMARTTARGET_MODULE_NAME, 'release');
      // if(mode == "standard"){
      SmartTarget.clearTokenTargetsHandler(game.user, null);
      // }
    }

    wrapped(...args);

    SmartTarget.releaseOthersMap.delete(this);

    ui.controls.control.activeTool = tool;
  },

  tokenCanControl : function (wrapped, ...args) {
    const [, event] = args;

    if (!event) {
      return wrapped(...args);
    }

    const oe = event.data.originalEvent;
    const tool = ui.controls.control.activeTool;

    if (oe.altKey && game.settings.get(SMARTTARGET_MODULE_NAME, "altTarget")) {
      ui.controls.control.activeTool = 'target';
    }

    const canControl = wrapped(...args);

    ui.controls.control.activeTool = tool;

    return canControl;
  },

  tokenLayerTargetObjects : function (wrapped, ...args) {
    const releaseOthers = SmartTarget.releaseOthersMap.get(this);

    if (releaseOthers !== undefined) {
      args[1].releaseOthers = releaseOthers;
    }

    return wrapped(...args);
  },

  canvasOnClickLeft : function (wrapped, ...args) {
    const [ event ] = args;
    const oe = event.data.originalEvent;
    const tool = ui.controls.control.activeTool;
    const selectState = event.data._selectState;

    if (oe.altKey && game.settings.get(SMARTTARGET_MODULE_NAME, "altTarget")) {
      ui.controls.control.activeTool = 'target';
    }

    wrapped(...args);

    if (oe.altKey && game.settings.get(SMARTTARGET_MODULE_NAME, "altTarget") && selectState !== 2) {
      const {x: ox, y: oy} = event.data.origin;
      const templates = canvas.templates.objects.children.filter(template => {
        const {x: cx, y: cy} = template.center;
        return template.shape.contains(ox - cx, oy - cy);
      });

      SmartTarget.targetTokensInArea(templates, SmartTarget.releaseBehaviour(oe));
    }

    ui.controls.control.activeTool = tool;
  },

  canvasOnDragLeftDrop : function (wrapped, ...args) {
    const [ event ] = args;
    const oe = event.data.originalEvent;
    const tool = ui.controls.control.activeTool;
    const layer = canvas.activeLayer;

    if (oe.altKey && game.settings.get(SMARTTARGET_MODULE_NAME, "altTarget")) {
      ui.controls.control.activeTool = 'target';
    }

    if (ui.controls.control.activeTool === 'target') {
      SmartTarget.releaseOthersMap.set(layer, SmartTarget.releaseBehaviour(oe));
      //const mode = game.settings.get(SMARTTARGET_MODULE_NAME, 'release');
      //if(mode == "standard"){
        SmartTarget.clearTokenTargetsHandler(game.user, null);
      //}
    }

    wrapped(...args);

    SmartTarget.releaseOthersMap.delete(layer);

    ui.controls.control.activeTool = tool;
  },

  templateLayerOnDragLeftDrop : function (wrapped, ...args) {
    const [ event ] = args;
    const object = event.data.preview;
    const oe = event.data.originalEvent;

    wrapped(...args);

    if (oe.altKey && game.settings.get(SMARTTARGET_MODULE_NAME, "altTarget")) {
      const template = new MeasuredTemplate(object.document);
      template.shape = SmartTarget.getTemplateShape(template);
      SmartTarget.targetTokensInArea([template], SmartTarget.releaseBehaviour(oe));
    }
  },

  keyboardManagerOnKeyC : function (wrapped, ...args) {
    const [,, modifiers] = args;

    if (!modifiers.isShift) {
      wrapped(...args);
    }
  },

	releaseBehaviour: function (oe) {
		const mode = game.settings.get(SMARTTARGET_MODULE_NAME, 'release');
		if (mode === 'sticky') {
			return !oe.shiftKey && !oe.altKey;
		}

		return !oe.shiftKey;
	},

	targetTokensInArea: function (templates, releaseOthers) {
		if (releaseOthers) {
			game.user.targets.forEach(token =>
				token.setTarget(false, {releaseOthers: false, groupSelection: true}));
		}

		canvas.tokens.objects.children.filter(token => {
			const {x: ox, y: oy} = token.center;
			return templates.some(template => {
				const {x: cx, y: cy} = template.center;
				return template.shape.contains(ox - cx, oy - cy);
			});
		}).forEach(token => token.setTarget(true, {releaseOthers: false, groupSelection: true}));
		game.user.broadcastActivity({targets: game.user.targets.ids});
	},

  /**
   * Adds the clear targets/selection button to the menu.
   * @param {array} controls -- the current controls hud array
   */
  getSceneControlButtonsHandler : function(controls) {

    let control = controls.find(c => c.name === 'token') || controls[0];

    control.tools.push({
        name: 'cancelTargets',
        title: 'Clear Targets/Selection',
        icon:'fa fa-times-circle',
        //visible: game.settings.get(SMARTTARGET_MODULE_NAME, 'XXX'),
        button:true,
        onClick: () => {
            control.activeTool = 'select';
            Hooks.call('clearTokenTargets',game.user,SmartTarget.clearTokenTargetsHandler(game.user, null));
            return;
        },
        layer: 'TokenLayer'
    });
  },

  /**
   * Button Handler to clear token targets & selections
   * @param {User} user              -- the user clearing the targets
   * @param {TokenLayer} tokenlayer  -- token layer
  */
  clearTokenTargetsHandler : function (user, tokenlayer) {
    for ( let [i, t] of user.targets.entries() ) {
    //   if (hasProperty(t.document.data, 'flags.'+SMARTTARGET_MODULE_NAME+'.imagePortrait_'+t.document.data._id + "_" + this.document.data.actorId)) {
    //     t.document.unsetFlag(SMARTTARGET_MODULE_NAME, 'imagePortrait_'+t.document.data._id + "_" + this.document.data.actorId);
    //   }
      Object.entries(t.document.data.flags[SMARTTARGET_MODULE_NAME]).forEach(([key, val]) => {
        if(key.startsWith('imagePortrait_')){
          t.document.unsetFlag(SMARTTARGET_MODULE_NAME, key);
        }
      });
    }
    user.targets.forEach(t => t.setTarget(false, {
        user: user,
        releaseOthers: true,
        groupSelection: false
    }));
    user.targets.clear();
    return true;
  },

  /**
   * Creates a sprite from the selected avatar and positions around the container
   * @param {User} u -- the user to get
   * @param {int} i  -- the current row count
   * @param {token} target -- PIXI.js container for height & width (the token)
   */
  buildCharacterPortrait : function(u, i, token, target){
    let actorID = "";
    let tokenID = ""; 
    if(token){
      actorID = token.document.actor.data._id
      tokenID = token.document.id;
    }
    let userID = u ? u.data.document.data._id : game.user.id;
    let sceneID = game.scenes.active.id; //game.user.viewedScene ? game.user.viewedScene : game.scenes.active.id;
    let pTexTmp = SmartTarget.loadImagePath(tokenID, actorID, userID, sceneID);
    let pTex = u.avatar;
    
    if(pTexTmp){
      pTex = pTexTmp;
    }else{
      if(!u.isGM){
        let character = u.character;
        if(!character){
          character = u.data.character;
        }
        if(character){
          pTex = game.settings.get(SMARTTARGET_MODULE_NAME, "useToken") ? character.data.token.img || character.data.img : character.data.img || character.data.token.img;
        }else{
          pTex = u.data.avatar;
        }
      }
    }  
   
    let color = colorStringToHex(u.data.color);
    SmartTarget.drawPortrait(i, color, pTex, target);
    return pTex;
  },

  drawPortrait(i, color, pTex, target){
    let circleR = game.settings.get(SMARTTARGET_MODULE_NAME, 'pipScale') || 12;
    let circleOffsetMult = game.settings.get(SMARTTARGET_MODULE_NAME, 'pipOffset') || 16;
    let scaleMulti = game.settings.get(SMARTTARGET_MODULE_NAME, 'pipImgScale') || 1;
    let insidePip = game.settings.get(SMARTTARGET_MODULE_NAME, 'insidePips') ? circleR : 0
    let texture = new PIXI.Texture.from(pTex);
    // let texture = u.isGM
    //   ? new PIXI.Texture.from(u.avatar)
    //   : new PIXI.Texture.from(
    //     pTex
    //     );

    let newTexW = scaleMulti * (2 * circleR);
    let newTexH = scaleMulti * (2 * circleR);
    let borderThic = game.settings.get(SMARTTARGET_MODULE_NAME, 'borderThicc');
    let portraitCenterOffset =
      scaleMulti >= 1 ? (16 + circleR / 12) * Math.log2(scaleMulti) : 0;
    portraitCenterOffset +=
      game.settings.get(SMARTTARGET_MODULE_NAME, 'pipOffsetManualY') || 0;
    let portraitXoffset =
      game.settings.get(SMARTTARGET_MODULE_NAME, 'pipOffsetManualX') || 0;
    let matrix = new PIXI.Matrix(
      (scaleMulti * (2 * circleR + 2)) / texture.width,
      0,
      0,
      (scaleMulti * (2 * circleR + 2)) / texture.height,
      newTexW / 2 + 4 + i * circleOffsetMult + portraitXoffset+insidePip,
      newTexH / 2 + portraitCenterOffset+insidePip
    );
    target
      .beginFill(color)
      .drawCircle(2 + i * circleOffsetMult+insidePip, 0+insidePip, circleR)
      .beginTextureFill({
        texture: texture,
        alpha: 1,
        matrix: matrix,
      })
      .lineStyle(borderThic, 0x0000000)
      .drawCircle(2 + i * circleOffsetMult+insidePip, 0+insidePip, circleR)
      .endFill()
      .lineStyle(borderThic / 2, color)
      .drawCircle(2 + i * circleOffsetMult+insidePip, 0+insidePip, circleR);
  },

    loadImagePath(tokenID, actorID, userID, sceneID) {
      // It's a chat message associated with an actor
      const useTokenImage = game.settings.get(SMARTTARGET_MODULE_NAME, "useToken");
      const actor = getActor(actorID,tokenID);
      let imgFinal= "icons/svg/mystery-man.svg";
      if(userID && !useTokenImage){
        const imgAvatar = getUserAvatarImage(userID);
        if(imgAvatar && !imgAvatar.includes("mystery-man")){
          return imgAvatar;
        }else{
          //warn("No specific avatar player image found it for player '"+getUserName(message)+"'");
          return imgAvatar ? imgAvatar : imgFinal;
        }
      }

      if (!tokenID && !actorID){
        if(userID){
          const imgAvatar = getUserAvatarImage(userID);
          if(imgAvatar && !imgAvatar.includes("mystery-man")){
            return imgAvatar;
          }else{
            // warn("No specific avatar player image found it for player '"+getUserName(message)+"'");
            return imgAvatar ? imgAvatar : imgFinal;
          }
        }else{
          //warn("No message user is found");
          return imgFinal; 
        }
      }

      // Make sense only for player and for non GM
      // if(actor?.type == "character" && game.user.isGM){
      //     const imgAvatar = ChatPortrait.getUserAvatarImage(message);
      //     if(imgAvatar && !imgAvatar.includes("mystery-man")){
      //       return imgAvatar;
      //     }else{
      //       //warn("No specific avatar player image found it for player '"+ChatPortrait.getUserName(message)+"'");
      //     }
      // }

      let token;
      //@ts-ignore
      let tokenData;
      if (tokenID) {
          token = getTokenFromScene(sceneID, tokenID)?.document;
          if(!token){
            token = getTokenFromId(tokenID)?.document;
          }
          if(!token && actorID){
            token = getTokenFromActor(actorID)?.document;
          }
          // THIS PIECE OF CODE IS PROBABLY NOT NECESSARY ANYMORE ??
          if (!token) {
            try{
              token = canvas?.tokens?.getDocuments().find((token) => token.id === tokenID);
              //token = getCanvas()?.tokens?.getDocuments().find(tokenID);
            }catch(e){
              // Do nothing
            }
            if(!token){
              tokenData = game.scenes?.get(sceneID)?.data?.tokens?.find(t => t.document.data._id === tokenID); // Deprecated on 0.8.6
            }else{
              tokenData = token.data;
            }
          }else{
            tokenData = token.data;
          }           
      }

      let imgToken = "";
      if(tokenData){
        if (useTokenImage && tokenData?.img) {
          imgToken = tokenData.img;
        }

        if (!useTokenImage && tokenData?.actorData?.img) {
          imgToken = tokenData.actorData.img;
        }
        
        // if(!imgToken || imgToken.includes("mystery-man")){
          //return useTokenImage ? <string>actor?.data.token.img : <string>actor?.token?.data?.img; // actor?.img; // Deprecated on 0.8.6
          //return useTokenImage ? actor?.data?.token?.img : actor.data.img; // actor?.img; // Deprecated on 0.8.6
        //}
        if(imgToken && !imgToken.includes("mystery-man")){
          return imgToken;
        }
      }
      let imgActor = "";
      if(actor && (!imgToken || imgToken.includes("mystery-man"))){

        if((!imgActor || imgActor.includes("mystery-man")) && useTokenImage){
          imgActor = actor?.data.token.img;
        }
        if((!imgActor || imgActor.includes("mystery-man")) && useTokenImage){
          imgActor= actor?.token?.data?.img
        }
        if(!imgActor || imgActor.includes("mystery-man")){
          imgActor = actor?.data.img;
        }
        if(imgActor && !imgActor.includes("mystery-man")){
          return imgActor;
        }
      }
      
      let imgAvatar = ChatPortrait.getUserAvatarImage(message);
      if(imgAvatar && !imgAvatar.includes("mystery-man")){
        return imgAvatar;
      }else{
        //warn("No specific avatar player image found it for player '"+ChatPortrait.getUserName(message)+"'");
        // return imgAvatar ? imgAvatar : INV_UNIDENTIFIED_BOOK;
      } 
      
      return imgFinal;
      
    },
    
    _refreshTarget : function() {
      this.target.clear();
      if (!this.targeted.size) return;
    
      // Determine whether the current user has target and any other users
      const [others, user] = Array.from(this.targeted).partition(
        (u) => u === game.user
      );
      const userTarget = user.length;
    
      // For the current user, draw the target arrows
      if (userTarget) {
        let textColor = game.settings.get(SMARTTARGET_MODULE_NAME, 'crossairColor') ? game.settings.get(SMARTTARGET_MODULE_NAME, 'crossairColor').replace('#','0x') : 0xff9829;
    
        if (game.settings.get(SMARTTARGET_MODULE_NAME,'use-player-color')) {
          textColor = colorStringToHex(game.user['color']);
        }
    
        let p = game.settings.get(SMARTTARGET_MODULE_NAME, 'crossairSpread') ? -10 : 4;
        let aw = 12;
        let h = this.h;
        let hh = h / 2;
        let w = this.w;
        let hw = w / 2;
        let ah = canvas.dimensions.size / 3;
    
        let selectedIndicator = game.settings.get(SMARTTARGET_MODULE_NAME,'target-indicator');
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
      if(game.settings.get(SMARTTARGET_MODULE_NAME, 'portraitPips')){
        let arrayTokens= getSelectedTokens();
        let foundFlag = false;
        
        // THE FLAG SYSTEM HAS SENSE ONLY WITH TOKEN
        if(game.settings.get(SMARTTARGET_MODULE_NAME, "useToken")){
          if (hasProperty(this.document.data, 'flags.'+SMARTTARGET_MODULE_NAME+'.imagePortrait_'+this.document.data._id + "_" + this.document.data.actorId)) {
            let smartTargetModel = this.document.getFlag(SMARTTARGET_MODULE_NAME, 'imagePortrait_'+this.document.data._id + "_" + this.document.data.actorId);
            if(smartTargetModel && smartTargetModel.image){
              let i = smartTargetModel.index;
              let color = colorStringToHex(smartTargetModel.color);
              let pTex = smartTargetModel.image;
              SmartTarget.drawPortrait(i,color,pTex,this.target); 
              foundFlag = true;
            }
          }
        }
       
        if(!foundFlag){
          if(game.settings.get(SMARTTARGET_MODULE_NAME, "useToken")){
            if(game.settings.get(SMARTTARGET_MODULE_NAME, 'forceToUseSelectedTokenForPortraitPips')){
              if(!arrayTokens || arrayTokens.length == 0){
                //ui.notifications.warn(game.i18n.localize('smarttarget.warningNoSelectMoreThanOneToken'));
                // TODO FIND A WAY TO SHOW THE WARNING ONLY TO THE ORIGINAL USER
                return;
              }
            }
            if(arrayTokens && arrayTokens.length > 0){
              for ( let [i, token] of arrayTokens.entries() ) {
                let pTex = SmartTarget.buildCharacterPortrait(game.user, i, token, this.target);
                let smarTargetModel = new SmartTargetModel(i, game.user.data.color, pTex);
                this.document.setFlag(SMARTTARGET_MODULE_NAME, 'imagePortrait_'+this.document.data._id + "_" + this.document.data.actorId, smarTargetModel);
              }
            }else{
              // Ignore if you are GM
              if(!game.user.isGM){
                if(game.settings.get(SMARTTARGET_MODULE_NAME, 'useOwnedTokenIfNoTokenIsSelected')){
                  // If no token is selected use the token of the users character
                  let token = canvas.tokens.placeables.find(token => token.data.id === game.user.character?.data?.id);             
                  // If no token is selected use the first owned token of the users character you found
                  if(!token){
                    token = canvas.tokens.ownedTokens[0];
                  }
                  if(token){
                    let pTex = SmartTarget.buildCharacterPortrait(game.user, 0, token, this.target);
                    let smarTargetModel = new SmartTargetModel(0, game.user.data.color, pTex);
                    this.document.setFlag(SMARTTARGET_MODULE_NAME, 'imagePortrait_'+this.document.data._id + "_" + this.document.data.actorId, smarTargetModel);   
                  }else{
                    let pTex = SmartTarget.buildCharacterPortrait(game.user, 0, null, this.target);
                    let smarTargetModel = new SmartTargetModel(0, game.user.data.color, pTex);
                    this.document.setFlag(SMARTTARGET_MODULE_NAME, 'imagePortrait_'+this.document.data._id + "_" + this.document.data.actorId, smarTargetModel);   
                  }
                }else{
                  if(others?.length <= 0){
                    //ui.notifications.warn(game.i18n.localize('smarttarget.warningNoSelectMoreThanOneToken'));
                    SmartTarget.clearTokenTargetsHandler(game.user, null);
                  }
                }
              }else{
                if(others && others.length >0){ 
                  for (let [i, u] of others.entries()) {
                    let pTex = SmartTarget.buildCharacterPortrait(u, i, null, this.target);
                    let smarTargetModel = new SmartTargetModel(i, u.data.color, pTex);
                    this.document.setFlag(SMARTTARGET_MODULE_NAME, 'imagePortrait_'+this.document.data._id + "_" + this.document.data.actorId, smarTargetModel);
                  }
                }
              }
            }
          }else{
            if(others && others.length >0){ 
              for (let [i, u] of others.entries()) {
                let pTex = SmartTarget.buildCharacterPortrait(u, i, null, this.target);
                let smarTargetModel = new SmartTargetModel(i, u.data.color, pTex);
                this.document.setFlag(SMARTTARGET_MODULE_NAME, 'imagePortrait_'+this.document.data._id + "_" + this.document.data.actorId, smarTargetModel);
              }
            }
          }
        }
      }else{
        for ( let [i, u] of others.entries() ) {
          let color = colorStringToHex(u.data.color);
          this.target.beginFill(color, 1.0).lineStyle(2, 0x0000000).drawCircle(2 + (i * 8), 0, 6);
        }
      }   
    }
};




