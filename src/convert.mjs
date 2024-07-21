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
 * @param {Object} options 
 * @param {Function} options.ruleCallback callback called by Rule
 */
async function convert (event, api, rule, options={}) {
    // Initialize globals
    init();

    // map user from event
    const user = event.user;

    // map context from event
    const context = MapEventToContext(event);

    convertGlobals.oldContext = structuredClone(context);
    convertGlobals.api = api;

    const callback = options.callback || defaultRuleCallback;
    // Run the rule, result handled by callback
    rule(user, context, callback);
}

/**
 * Handle Rule callback function
 * @param {*} obj 
 * @param {*} newUser 
 * @param {*} newContext 
 */
 
function defaultRuleCallback(obj, newUser, newContext) {
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

        // handle changes applied to context by Rule
        handleContextMutations(newContext);
        console.log("Handled context changes applied by Rule")
    }
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
        if (value && value != oldContext.idToken[claim]) {
            api.idToken.setCustomClaim(claim, value)
        }
    }
    for (const [claim, value] of Object.entries(newContext.accessToken)) {
        if (value && value != oldContext.accessToken[claim]) {
            api.accessToken.setCustomClaim(claim, value)
        }
    }

    // set SAML configuration mappings
    for (const [claim, value] of Object.entries(newContext.samlConfiguration?.mappings)) {
        if (value && value != oldContext.samlConfiguration?.mappings[claim]) {
            api.samlResponse.setAttribute(claim, value);
        }
    }
}

export {
    convert,
    defaultRuleCallback,
    handleContextMutations
}