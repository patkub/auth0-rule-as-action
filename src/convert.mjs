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
 * @param {*} ruleCallback 
 */
async function convert (event, api, rule, ruleCallback) {
    // Initialize globals
    init();

    // map user from event
    const user = event.user;

    // map context from event
    const context = MapEventToContext(event);

    convertGlobals.oldContext = structuredClone(context);
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
    // have "newUser" and "newContext" variables

    // handle changes applied to context by Rule
    handleContextMutations(newContext);
    console.log("Handled context changes applied by Rule");

    if (obj instanceof Error) {
        // handle errors
        console.log(`Error: ${obj.message}`);
        api.access.deny(obj.message);
    }
    
    console.log("Rule ran as Action");
}

/**
 * Handles changes applied to context by Rule
 * @param {*} context 
 */
function handleContextMutations(newContext) {
    const api = convertGlobals.api;
    const oldContext = convertGlobals.oldContext;
    
    // set ID and Access token claims that changed between newContext and oldContext
    for (const [claim, value] of Object.entries(newContext.idToken)) {
        if (newContext.idToken[claim] && newContext.idToken[claim] != oldContext.idToken[claim]) {
            api.idToken.setCustomClaim(claim, value)
        }
    }
    for (const [claim, value] of Object.entries(newContext.accessToken)) {
        if (newContext.accessToken[claim] && newContext.accessToken[claim] != oldContext.accessToken[claim]) {
            api.accessToken.setCustomClaim(claim, value)
        }
    }
}

export {
    convert,
    ruleCallback
}