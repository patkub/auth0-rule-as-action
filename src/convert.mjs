import { init } from "./init.mjs";
import { MapEventToContext } from "./mapEventToContext.mjs";

/**
 * globals used by convert method
 */
const convertGlobals = {}

/**
 * Auto convert Rule to Action
 * @param {*} event 
 * @param {*} api 
 * @param {*} rule 
 */
async function convert (event, api, rule) {
    return convertWithCallback(event, api, rule, ruleCallback);
}

/**
 * Auto convert Rule to Action
 * @param {*} event 
 * @param {*} api 
 * @param {*} rule 
 * @param {*} ruleCallback 
 */
async function convertWithCallback (event, api, rule, ruleCallback) {
    // Initialize globals
    init();

    // map user from event
    const user = event.user;

    // map context from event
    const context = MapEventToContext(event);

    // convertGlobals.event = event;
    convertGlobals.api = api;

    // Run the rule, result handled by callback
    rule(user, context, ruleCallback);
}

/**
 * Handle Rule callback function
 * @param {*} obj 
 * @param {*} newUser 
 * @param {*} newContext 
 */
// eslint-disable-next-line no-unused-vars
function ruleCallback(obj, newUser, newContext) {
    // pass in api from convert method
    // const event = convertGlobals.event;
    const api = convertGlobals.api;

    if (obj instanceof Error) {
        // handle errors
        console.log(`Error: ${obj.message}`);
        api.access.deny(obj.message);
    } else {
        // success, have "newUser" and "newContext" variables
        console.log("Rule ran as Action")
    }
}

export {
    convert,
    convertWithCallback,
    ruleCallback
}