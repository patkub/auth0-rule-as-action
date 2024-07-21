import { init } from "./init.js";
import { MapEventToContext } from "./mapEventToContext.js";


/**
 * Auto convert Rule to Action
 * @param {*} event 
 * @param {*} api 
 * @param {*} rule 
 * @param {*} ruleCallback 
 */
async function convert (event, api, rule, ruleCallback) {
    // Initialize globals
    init();

    // map user from event
    const user = event.user;

    // map context from event
    const context = MapEventToContext(event);

    // Run the rule, result handled by callback
    rule(user, context, ruleCallback);
}

/**
 * Handle Rule callback function
 * @param {*} obj 
 * @param {*} newUser 
 * @param {*} newContext 
 */
function ruleCallback(obj, newUser, newContext) {
    if (obj instanceof Error) {
        // handle errors
        console.log(`Error: ${obj.message}`);
        api.access.deny(obj.message);
    } else {
        // success, have "user" and "context" variables
        console.log("Rule ran as Action")

        // compare "newUser" to "user"

        // compare "newContext" to "context"
    }
}

export {
    convert,
    ruleCallback
}