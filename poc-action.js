/**
 * Define errors used in rules
 */
class UnauthorizedError extends Error {
    constructor(message) {
      super(message)
    }
}

/**
 * Handle secrets
 */
let configuration;

/**
 * The Rule
 */
function accessOnWeekdaysOnly(user, context, callback) {
  if (context.clientName === 'Default App') {
    const date = new Date();
    const d = date.getDay();

    if (d === 0 || d === 6) {
      return callback(
        new UnauthorizedError('This app is available during the week')
      );
    }
  }

  callback(null, user, context);
}

/**
 * Auto convert Rule to Action
 * @param {*} event
 * @param {*} api
 * @param {*} rule 
 */
const RuleToAction = (event, api, rule) => {
    // map user from event
    const user = event.user;

    // map context from event
    const context = MapEventToContext(event);

    // Handle rule callback
    const callback = (obj, newUser, newContext) => {
        if (obj instanceof Error) {
            // handle errors
            console.log(`Error: ${obj.message}`)
            api.access.deny(obj.message)
        } else {
            // success, have "user" and "context" variables
            console.log("Rule ran as Action")

            // compare "newUser" to "user"

            // compare "newContext" to "context"
        }
    }

    // Run the rule, result handled by callback
    rule(user, context, callback);
}

/**
 * Map event variables to context variables
 * @param {*} event
 * @return context
 */
const MapEventToContext = (event) => {
    const context = {};
    
    // map event variables to context variables
    // event: https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/event-object
    // context: https://auth0.com/docs/customize/rules/context-object

    context.tenant = event.tenant.id;
    context.clientID = event.client.client_id;
    context.clientName = event.client.name;
    context.clientMetadata = event.client.metadata;
    context.connectionID = event.connection.id;
    context.connection = event.connection.name;
    context.connectionStrategy = event.connection.strategy;
    context.protocol = event.transaction?.protocol;

    // TODO: add more mappings...

    // Map secrets
    configuration = event.secrets;
    
    // Return context determined from event
    return context;
}

/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  const rule = accessOnWeekdaysOnly;
  RuleToAction(event, api, rule);
};
