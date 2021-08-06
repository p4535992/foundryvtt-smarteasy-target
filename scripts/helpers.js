function drawDefault(token, fillColor, p, aw, h, hh, w, hw, ah) {

    token.target.beginFill(fillColor, 1.0)
    .lineStyle(1, 0x000000)
    .drawPolygon([-p, hh, -p - aw, hh - ah, -p - aw, hh + ah])
    .drawPolygon([w + p, hh, w + p + aw, hh - ah, w + p + aw, hh + ah])
    .drawPolygon([hw, -p, hw - ah, -p - aw, hw + ah, -p - aw])
    .drawPolygon([hw, h + p, hw - ah, h + p + aw, hw + ah, h + p + aw]);

}

function drawCrossHairs1(token, fillColor, p, aw, h, hh, w, hw, ah) {
let borderColor = 0x000000;
let rw = 10; // rect width
let rh = 30; // rect length
let r = hh; // radius
let topX = hw - rw / 2;
let topY = 0 - rh / 2;
let rightX = w - rh / 2;
let rightY = hh - rw / 2;
let botX = hw - rw / 2;
let botY = h - rh / 2;
let leftX = 0 - rh / 2;
let leftY = hh - rw / 2;
token.target
    .beginFill(borderColor, 0).lineStyle(10, borderColor).drawCircle(hw, hh, r).endFill()
    .beginFill(fillColor, 0).lineStyle(6, fillColor).drawCircle(hw, hh, r).endFill()
    .beginFill(fillColor).lineStyle(2, borderColor).drawRect(topX, topY, rw, rh).endFill() // top bar
    .beginFill(fillColor).lineStyle(2, borderColor).drawRect(rightX, rightY, rh, rw).endFill() // right bar
    .beginFill(fillColor).lineStyle(2, borderColor).drawRect(botX, botY, rw, rh).endFill() // bottom bar
    .beginFill(fillColor).lineStyle(2, borderColor).drawRect(leftX, leftY, rh, rw).endFill(); // tleft bar
}

function drawCrossHairs2(token, fillColor, p, aw, h, hh, w, hw, ah) {
let borderColor = 0x000000;
let rw = 10; // rect width
let rh = 50; // rect length
let r = hh; // radius
let topX = hw - rw / 2;
let topY = 0 - rh / 2;
let rightX = w - rh / 2;
let rightY = hh - rw / 2;
let botX = hw - rw / 2;
let botY = h - rh / 2;
let leftX = 0 - rh / 2;
let leftY = hh - rw / 2;
token.target
    .beginFill(borderColor, 1).lineStyle(8, borderColor).drawCircle(hw, hh, 2).endFill()
    .beginFill(fillColor, 1).lineStyle(6, fillColor).drawCircle(hw, hh, 2).endFill()
    .beginFill(fillColor).lineStyle(2, borderColor).drawRect(topX, topY, rw, rh).endFill() // top bar
    .beginFill(fillColor).lineStyle(2, borderColor).drawRect(rightX, rightY, rh, rw).endFill() // right bar
    .beginFill(fillColor).lineStyle(2, borderColor).drawRect(botX, botY, rw, rh).endFill() // bottom bar
    .beginFill(fillColor).lineStyle(2, borderColor).drawRect(leftX, leftY, rh, rw).endFill(); // tleft bar
}

function drawBullsEye1(token, fillColor, p, aw, h, hh, w, hw, ah) {
let borderColor = 0x000000;
token.target
    .beginFill(borderColor, 0).lineStyle(6, borderColor).drawCircle(hw, hh, hh).endFill()
    .beginFill(fillColor, 0).lineStyle(4, fillColor).drawCircle(hw, hh, hh).endFill() // stop here for outer ring
    .beginFill(borderColor, 0).lineStyle(6, borderColor).drawCircle(hw, hh, hh - 40).endFill()
    .beginFill(fillColor, 0).lineStyle(4, fillColor).drawCircle(hw, hh, hh - 40).endFill();
}

function drawBullsEye2(token, fillColor, p, aw, h, hh, w, hw, ah) {
let borderColor = 0x000000;
token.target
    .beginFill(borderColor, 0).lineStyle(6, borderColor).drawCircle(hw, hh, hh).endFill()
    .beginFill(fillColor, 0).lineStyle(4, fillColor).drawCircle(hw, hh, hh).endFill() // stop here for outer ring
    .beginFill(borderColor, 0).lineStyle(6, borderColor).drawCircle(hw, hh, hh - 20).endFill()
    .beginFill(fillColor, 0).lineStyle(4, fillColor).drawCircle(hw, hh, hh - 20).endFill()
    .beginFill(fillColor, 1).lineStyle(8, fillColor).drawCircle(hw, hh, 2).endFill();

}

function drawBetterTarget(token, fillColor, p, aw, h, hh, w, hw, ah) {
let size = token.w;
// Constrain dimensions to the shortest axis
if (size > token.h) {
  size = token.h;
}
const padding = 12;
const stroke = 6;
const vmid = token.h / 2;
const hmid = token.w / 2;
const crossLen = (size / 2) - padding;
token.target
    .beginFill(fillColor, 1.0).lineStyle(1, 0x000000)
    .drawCircle(hmid, vmid, (size / 2) - padding)
    .beginHole()
    .drawCircle(hmid, vmid, (size / 2) - padding - stroke)
    .endHole()
    .drawRoundedRect(hmid - (stroke / 2), vmid - stroke - crossLen, stroke, crossLen, null)
    .drawRoundedRect(hmid - (stroke / 2), vmid + padding - stroke, stroke, crossLen, null)
    .drawRoundedRect(hmid - stroke - crossLen, vmid - (stroke / 2), crossLen, stroke, null)
    .drawRoundedRect(hmid + padding - stroke, vmid - (stroke / 2), crossLen, stroke, null)
    .endFill();
}

function getUserAvatarImage(userId) {
    let user = game.users?.get(userId);
    if(user){
      if(user.data && user.data.avatar){ // image path
        return user.data.avatar;
      }
    }
    return "icons/svg/mystery-man.svg";
}

function getActor(actorID, tokenID) {
    let actor =  game.actors?.get(actorID);
    if(!actor && tokenID){
      actor = game.actors?.tokens[tokenID];
    }
    if (!actor) {
        //actor = game.actors.get(actorID); // Deprecated on 0.8.6
        actor = Actors.instance.get(actorID);
    }  
    // if (!actor) {
    //     actor = game.actors?.find((a) => a.data.token.name === ???);
    // }
    return actor;
}

function getTokenFromActor(actorID) {
    let token = null;
    const scene = game.scenes?.get(game.user?.viewedScene);
    if (scene) {
        const thisSceneToken = scene.data.tokens.find((token) => {
        return token.actor && token.actor.id === actorID;
        });
        if (thisSceneToken) {
        token = getTokenFromId(thisSceneToken.id);
        }
    }
    return token;
}
  
function getTokenFromId(tokenId) {
    try{
      return canvas.tokens?.get(tokenId);
    }catch(e){
      return null;
    }
}

function getTokenFromScene(sceneID, tokenID) {
    const specifiedScene = game.scenes?.get(sceneID);
    if (specifiedScene) {
        //return ChatPortrait.getTokenForScene(specifiedScene, tokenID);
        if (!specifiedScene) {
        return null;
        }
        return specifiedScene.data.tokens.find((token) => {
        return token.id === tokenID;
        });
    }
    let foundToken = null;
    game.scenes?.find((scene) => {
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
function getSelectedTokens() {
    // Get first token ownted by the player
    let selectedTokens = canvas.tokens.controlled;
    if(!selectedTokens || selectedTokens.length == 0){
        return null;
    }
    return selectedTokens;
}