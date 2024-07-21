import { init } from "./init.js";
import { MapEventToContext } from "./mapEventToContext.js";
import { convert, ruleCallback } from "./convert.js";

/**
 * RuleToAction
 */
const RuleToAction = {
    init: init,
    MapEventToContext: MapEventToContext,
    convert: convert,
    ruleCallback: ruleCallback
}

export {
    RuleToAction
}
