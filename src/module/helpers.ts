import { getCanvas, getGame } from './settings';

export function drawDefault(token, fillColor, p, aw, h, hh, w, hw, ah) {
  token.target
    .beginFill(fillColor, 1.0)
    .lineStyle(1, 0x000000)
    .drawPolygon([-p, hh, -p - aw, hh - ah, -p - aw, hh + ah])
    .drawPolygon([w + p, hh, w + p + aw, hh - ah, w + p + aw, hh + ah])
    .drawPolygon([hw, -p, hw - ah, -p - aw, hw + ah, -p - aw])
    .drawPolygon([hw, h + p, hw - ah, h + p + aw, hw + ah, h + p + aw]);
}

export function drawCrossHairs1(token, fillColor, p, aw, h, hh, w, hw, ah) {
  const borderColor = 0x000000;
  const rw = 10; // rect width
  const rh = 30; // rect length
  const r = hh; // radius
  const topX = hw - rw / 2;
  const topY = 0 - rh / 2;
  const rightX = w - rh / 2;
  const rightY = hh - rw / 2;
  const botX = hw - rw / 2;
  const botY = h - rh / 2;
  const leftX = 0 - rh / 2;
  const leftY = hh - rw / 2;
  token.target
    .beginFill(borderColor, 0)
    .lineStyle(10, borderColor)
    .drawCircle(hw, hh, r)
    .endFill()
    .beginFill(fillColor, 0)
    .lineStyle(6, fillColor)
    .drawCircle(hw, hh, r)
    .endFill()
    .beginFill(fillColor)
    .lineStyle(2, borderColor)
    .drawRect(topX, topY, rw, rh)
    .endFill() // top bar
    .beginFill(fillColor)
    .lineStyle(2, borderColor)
    .drawRect(rightX, rightY, rh, rw)
    .endFill() // right bar
    .beginFill(fillColor)
    .lineStyle(2, borderColor)
    .drawRect(botX, botY, rw, rh)
    .endFill() // bottom bar
    .beginFill(fillColor)
    .lineStyle(2, borderColor)
    .drawRect(leftX, leftY, rh, rw)
    .endFill(); // tleft bar
}

export function drawCrossHairs2(token, fillColor, p, aw, h, hh, w, hw, ah) {
  const borderColor = 0x000000;
  const rw = 10; // rect width
  const rh = 50; // rect length
  const r = hh; // radius
  const topX = hw - rw / 2;
  const topY = 0 - rh / 2;
  const rightX = w - rh / 2;
  const rightY = hh - rw / 2;
  const botX = hw - rw / 2;
  const botY = h - rh / 2;
  const leftX = 0 - rh / 2;
  const leftY = hh - rw / 2;
  token.target
    .beginFill(borderColor, 1)
    .lineStyle(8, borderColor)
    .drawCircle(hw, hh, 2)
    .endFill()
    .beginFill(fillColor, 1)
    .lineStyle(6, fillColor)
    .drawCircle(hw, hh, 2)
    .endFill()
    .beginFill(fillColor)
    .lineStyle(2, borderColor)
    .drawRect(topX, topY, rw, rh)
    .endFill() // top bar
    .beginFill(fillColor)
    .lineStyle(2, borderColor)
    .drawRect(rightX, rightY, rh, rw)
    .endFill() // right bar
    .beginFill(fillColor)
    .lineStyle(2, borderColor)
    .drawRect(botX, botY, rw, rh)
    .endFill() // bottom bar
    .beginFill(fillColor)
    .lineStyle(2, borderColor)
    .drawRect(leftX, leftY, rh, rw)
    .endFill(); // tleft bar
}

export function drawBullsEye1(token, fillColor, p, aw, h, hh, w, hw, ah) {
  const borderColor = 0x000000;
  token.target
    .beginFill(borderColor, 0)
    .lineStyle(6, borderColor)
    .drawCircle(hw, hh, hh)
    .endFill()
    .beginFill(fillColor, 0)
    .lineStyle(4, fillColor)
    .drawCircle(hw, hh, hh)
    .endFill() // stop here for outer ring
    .beginFill(borderColor, 0)
    .lineStyle(6, borderColor)
    .drawCircle(hw, hh, hh - 40)
    .endFill()
    .beginFill(fillColor, 0)
    .lineStyle(4, fillColor)
    .drawCircle(hw, hh, hh - 40)
    .endFill();
}

export function drawBullsEye2(token, fillColor, p, aw, h, hh, w, hw, ah) {
  const borderColor = 0x000000;
  token.target
    .beginFill(borderColor, 0)
    .lineStyle(6, borderColor)
    .drawCircle(hw, hh, hh)
    .endFill()
    .beginFill(fillColor, 0)
    .lineStyle(4, fillColor)
    .drawCircle(hw, hh, hh)
    .endFill() // stop here for outer ring
    .beginFill(borderColor, 0)
    .lineStyle(6, borderColor)
    .drawCircle(hw, hh, hh - 20)
    .endFill()
    .beginFill(fillColor, 0)
    .lineStyle(4, fillColor)
    .drawCircle(hw, hh, hh - 20)
    .endFill()
    .beginFill(fillColor, 1)
    .lineStyle(8, fillColor)
    .drawCircle(hw, hh, 2)
    .endFill();
}

export function drawBetterTarget(token, fillColor, p, aw, h, hh, w, hw, ah) {
  let size = token.w;
  // Constrain dimensions to the shortest axis
  if (size > token.h) {
    size = token.h;
  }
  const padding = 12;
  const stroke = 6;
  const vmid = token.h / 2;
  const hmid = token.w / 2;
  const crossLen = size / 2 - padding;
  token.target
    .beginFill(fillColor, 1.0)
    .lineStyle(1, 0x000000)
    .drawCircle(hmid, vmid, size / 2 - padding)
    .beginHole()
    .drawCircle(hmid, vmid, size / 2 - padding - stroke)
    .endHole()
    .drawRoundedRect(hmid - stroke / 2, vmid - stroke - crossLen, stroke, crossLen, null)
    .drawRoundedRect(hmid - stroke / 2, vmid + padding - stroke, stroke, crossLen, null)
    .drawRoundedRect(hmid - stroke - crossLen, vmid - stroke / 2, crossLen, stroke, null)
    .drawRoundedRect(hmid + padding - stroke, vmid - stroke / 2, crossLen, stroke, null)
    .endFill();
}

export function getUserAvatarImage(userId) {
  const user = getGame().users?.get(userId);
  if (user) {
    if (user.data && user.data.avatar) {
      // image path
      return user.data.avatar;
    }
  }
  return 'icons/svg/mystery-man.svg';
}

export function getActor(actorID, tokenID) {
  let actor = getGame().actors?.get(actorID);
  if (!actor && tokenID) {
    actor = getGame().actors?.tokens[tokenID];
  }
  if (!actor) {
    //actor = getGame().actors.get(actorID); // Deprecated on 0.8.6
    actor = Actors.instance.get(actorID);
  }
  // if (!actor) {
  //     actor = getGame().actors?.find((a) => a.data.token.name === ???);
  // }
  return actor;
}

export function getTokenFromActor(actorID) {
  let token;
  const scene = <Scene>getGame().scenes?.get(<string>getGame().user?.viewedScene);
  if (scene) {
    const thisSceneToken = <TokenDocument>scene.data.tokens.find((tokenTmp: any) => {
      return tokenTmp.actor && tokenTmp.actor?.id === actorID;
    });
    if (thisSceneToken) {
      token = <Token>getTokenFromId(thisSceneToken.id);
    }
  }
  return token;
}

export function getTokenFromId(tokenId) {
  try {
    return getCanvas().tokens?.get(tokenId);
  } catch (e) {
    return null;
  }
}

export function getTokenFromScene(sceneID, tokenID) {
  const specifiedScene = getGame().scenes?.get(sceneID);
  if (specifiedScene) {
    //return ChatPortrait.getTokenForScene(specifiedScene, tokenID);
    if (!specifiedScene) {
      return null;
    }
    return specifiedScene.data.tokens.find((token) => {
      return token.id === tokenID;
    });
  }
  let foundToken;
  getGame().scenes?.find((scene) => {
    //foundToken = ChatPortrait.getTokenForScene(scene, tokenID);
    if (!scene) {
      foundToken = null;
    }
    foundToken = scene.data.tokens.find((token) => {
      return token.id === tokenID;
    });
    return !!foundToken;
  });
  return foundToken;
}

/**
 * Returns the selected token
 */
export function getSelectedTokens() {
  // Get first token ownted by the player
  const selectedTokens = getCanvas().tokens?.controlled;
  if (!selectedTokens || selectedTokens.length == 0) {
    return null;
  }
  return selectedTokens;
}
