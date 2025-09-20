/**
 * Map event variables to context variables
 * @param {Object} event Post-Login Action event
 * @return {Object} context
 */
function mapEventToContext(event) {
  // Auth0 Post-Login action Event object: https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/event-object
  // Auth0 Rules Context object: https://auth0.com/docs/customize/rules/context-object

  // Initialize context object
  const context = {
    // Default context properties
    sso: {},

    // Context properties that get set by the Rule
    accessToken: {},
    idToken: {},
    samlConfiguration: {
      mappings: {},
    },
    multifactor: {},
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
  context.riskAssessment = event.authentication?.riskAssessment;
  context.stats = event.stats;
  context.sessionID = event.session?.id;
  context.request = event.request;
  context.authentication = event.authentication?.methods;
  context.authorization = event.authorization;
  context.organization = event.organization;
  context.sso.current_clients = event.session?.clients;

  // Map secrets
  global.configuration = event.secrets;

  // Return context determined from event
  return context;
}

export { mapEventToContext };
