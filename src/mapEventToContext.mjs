/**
 * Map event variables to context variables
 * @param {*} event
 * @return context
 */
function MapEventToContext(event) {
    // Auth0 Post-Login action Event object: https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/event-object
    // Auth0 Rules Context object: https://auth0.com/docs/customize/rules/context-object

    // Initialize context object
    const context = {
        accessToken: {},
        idToken: {},
        multifactor: {},
        sessionID: null
    };
    
    // Map event variables to context variables
    context.tenant = event.tenant.id;
    context.clientID = event.client.client_id;
    context.clientName = event.client.name;
    context.clientMetadata = event.client.metadata;
    context.connectionID = event.connection.id;
    context.connection = event.connection.name;
    context.connectionStrategy = event.connection.strategy;
    context.connectionMetadata = event.connection.metadata;
    context.protocol = event.transaction?.protocol;
    context.riskAssessment = event.riskAssessment;
    context.stats = event.stats;
    context.request = event.request;
    context.authentication = event.authentication;
    context.authorization = event.authorization;
    context.organization = event.organization;

    // Map secrets
    global.configuration = event.secrets;
    
    // Return context determined from event
    return context;
}

export {
    MapEventToContext
}
