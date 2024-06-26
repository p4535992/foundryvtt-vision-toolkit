import CONSTANTS from "./scripts/constants.js";
import { registerKeyBindings, registerSettings } from "./scripts/settings.js";
import { HiddenTokenCanSeeAndLightHelpers } from "./scripts/hidden-token-can-see-and-light-helpers.js";
import { GmVisionHelpers } from "./scripts/gm-vision-helpers.js";
import { DisableVisionOnDragAsGMHelpers } from "./scripts/disable-vision-on-drag-as-gm-helpers.js";
import { DoNotRevealMyMapHelpers } from "./scripts/do-not-reveal-my-map-helpers.js";
import { NoTokenAnimationClassHelpers } from "./scripts/no-token-animation-helpers.js";
import { IgnoreVisionHelpers } from "./scripts/ignore-vision-helpers.js";
import Logger from "./scripts/lib/Logger.js";
import { RevealObservableTokensHelpers } from "./scripts/reveal-observable-tokens-helpers.js";
import { TokenWarpHelpers } from "./scripts/token-warp-helpers.js";

Hooks.once("init", () => {
    registerSettings();
    registerKeyBindings();

    IgnoreVisionHelpers.registerIgnoreVision();

    DisableVisionOnDragAsGMHelpers.registerDisableVisionOnDragAsGM();
});

Hooks.once("setup", () => {
    if (foundry.utils.isNewerVersion(game.version, 11)) {
        GmVisionHelpers.registerGmVision();
        RevealObservableTokensHelpers.registerRevealObservableTokens();
    } else {
        if (!game.settings.get("core", "noCanvas")) {
            Hooks.once("canvasInit", () => {
                GmVisionHelpers.registerGmVision();
                RevealObservableTokensHelpers.registerRevealObservableTokens();
            });
        }
    }

    HiddenTokenCanSeeAndLightHelpers.registerVisionSourceCalculation();
    HiddenTokenCanSeeAndLightHelpers.registerLightSourceCalculation();
});

Hooks.once("ready", () => {
    // Do anything once the module is ready
    if (!game.modules.get("lib-wrapper")?.active && game.user?.isGM) {
        let word = "install and activate";
        if (game.modules.get("lib-wrapper")) word = "activate";
        throw Logger.error(`Requires the 'libWrapper' module. Please ${word} it.`);
    }
    // if (!game.modules.get("socketlib")?.active && game.user?.isGM) {
    //   let word = "install and activate";
    //   if (game.modules.get("socketlib")) word = "activate";
    //   throw Logger.error(`Requires the 'socketlib' module. Please ${word} it.`);
    // }
});

Hooks.on("getSceneControlButtons", (controls) => {
    IgnoreVisionHelpers.getSceneControlButtonsIgnoreVision(controls);
});

Hooks.on("preUpdateToken", (token, changes, data, userId) => {
    DoNotRevealMyMapHelpers.registerDoNotRevealMyMapPreUpdateToken(token, changes, data, userId);
    NoTokenAnimationClassHelpers.registerNoTokenAnimationPreUpdateToken(token, changes, data, userId);
    TokenWarpHelpers.registerTokenWarpPreUpdateToken(token, changes, data, userId);
});
