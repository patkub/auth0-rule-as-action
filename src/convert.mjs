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

    convertGlobals.context = context;
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
    const oldContext = convertGlobals.context;
    
    // changes between newContext and oldContext

    // get modified ID and Access token claims from context
    const newIDTokenClaims = newContext["idToken"].filter((key, value) => {
        oldContext["idToken"][key] != value;
    });
    const newAccessTokenClaims = newContext["accessToken"].filter((key, value) => {
        oldContext["accessToken"][key] != value;
    });
    
    // set ID and Access token claims
    for (const [claim, value] of newIDTokenClaims.entries()) {
        api.idToken.setCustomClaim(claim, value)
    }
    for (const [claim, value] of newAccessTokenClaims.entries()) {
        api.accessToken.setCustomClaim(claim, value)
    }
}

export {
    convert,
    ruleCallback
}